import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants, pageTransition, zoomFromBackVariants, zoomFromBackTransition } from '../utils/motion'

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

let storeCache = null
let favCache = null

function StoreCard({ store, onNavigate }) {
  return (
    <div className="store-card" onClick={onNavigate}>
      <div className="store-card-header">
        <span className="store-card-name">{store.store_name}</span>
        <span className="store-card-dist">📍 {store.distance}</span>
      </div>
      <div className="store-deal">{store.coupon}</div>
      {store.note && <p className="store-card-note">{store.note}</p>}
    </div>
  )
}

function NearbyPage() {
  const [stores, setStores] = useState(storeCache !== null ? storeCache : [])
  const [favoriteIds, setFavoriteIds] = useState(favCache || [])
  const [geoError, setGeoError] = useState(null)
  const [loading, setLoading] = useState(storeCache === null)
  const [loadingPhase, setLoadingPhase] = useState('geo')
  const navigate = useNavigate()
  const location = useLocation()
  const { dir } = useDir()
  const fromLanding = location.state?.fromLanding

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    if (token) {
      fetch(`${API_HOST}/me`, { headers })
        .then((r) => {
          if (r.status === 401) localStorage.removeItem('token')
          else return r.json()
        })
        .then((d) => d && localStorage.setItem('nickname', d.nickname))

      fetch(`${API_HOST}/me/favoritestores`, { headers })
        .then((r) => r.json())
        .then((data) => {
          const raw = data.favorite ?? data
          const ids = Array.isArray(raw) ? raw : JSON.parse(raw)
          favCache = ids
          setFavoriteIds(ids)
        })
    }

    if (storeCache !== null) { setLoading(false); return }

    if (!navigator.geolocation) {
      setGeoError('この端末では位置情報が使えません')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setLoadingPhase('fetch')
        fetch(`${API_HOST}/stores/nearby?lat=${lat}&lng=${lng}`, {})
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .then((d) => { storeCache = d; setStores(d); setLoading(false) })
          .catch(() => { setGeoError('お店情報の取得に失敗しました'); setLoading(false) })
      },
      (err) => {
        if (err.code === 1) {
          setGeoError('位置情報が許可されていません。\nSafari設定 → プライバシーとセキュリティ → 位置情報サービスをオンにしてください。')
        } else {
          setGeoError('位置情報を取得できませんでした。')
        }
        setLoading(false)
      },
      { timeout: 15000, enableHighAccuracy: false }
    )
  }, [])

  const favoriteStores = stores.filter((s) => favoriteIds.includes(s.store_id))
  const otherStores = stores.filter((s) => !favoriteIds.includes(s.store_id))

  return (
    <motion.div
      custom={dir}
      variants={fromLanding ? zoomFromBackVariants : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={fromLanding ? zoomFromBackTransition : pageTransition}
    >
      <div className="page-content">
        {favoriteStores.length > 0 && (
          <>
            <p className="section-title">★ お気に入り</p>
            <div className="store-list">
              {favoriteStores.map((store) => (
                <StoreCard
                  key={store.store_id}
                  store={store}
                  onNavigate={() => navigate(`/shop/${store.store_id}`, { state: { store } })}
                />
              ))}
            </div>
            <hr className="divider" />
          </>
        )}

        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p className="loading-text">
              {loadingPhase === 'fetch' ? 'お得を探しています' : 'あなたに最適なお得を\n頑張って探しています'}
            </p>
          </div>
        ) : (
          <>
            <p className="section-title">近くの今のお得</p>
            {geoError && <p className="empty-text">{geoError}</p>}
            {!geoError && (
              <div className="store-list">
                {otherStores.length === 0
                  ? <p className="empty-text">近くに該当するお店が見つかりませんでした</p>
                  : otherStores.map((store) => (
                    <StoreCard
                      key={store.store_id}
                      store={store}
                      onNavigate={() => navigate(`/shop/${store.store_id}`, { state: { store } })}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default NearbyPage
