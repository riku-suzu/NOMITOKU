import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants, pageTransition } from '../utils/motion'

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

let storeCache = null

function LandingPage() {
  const [view, setView] = useState(storeCache ? 'list' : 'landing')
  const [stores, setStores] = useState(storeCache || [])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [geoError, setGeoError] = useState(null)
  const navigate = useNavigate()
  const { dir } = useDir()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API_HOST}/me/favoritestores`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const raw = data.favorite ?? data
        setFavoriteIds(Array.isArray(raw) ? raw : JSON.parse(raw))
      })
      .catch(() => {})
  }, [])

  const handleEnter = () => {
    if (view !== 'landing') return
    setView('loading')

    if (!navigator.geolocation) {
      setGeoError('この端末では位置情報が使えません')
      setView('list')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        fetch(`${API_HOST}/stores/nearby?lat=${lat}&lng=${lng}`)
          .then(r => { if (!r.ok) throw new Error(); return r.json() })
          .then(data => { storeCache = data; setStores(data); setView('list') })
          .catch(() => { setGeoError('お店情報の取得に失敗しました'); setView('list') })
      },
      (err) => {
        setGeoError(err.code === 1
          ? '位置情報が許可されていません。\nSafari設定 → プライバシーとセキュリティ → 位置情報サービスをオンにしてください。'
          : '位置情報を取得できませんでした。')
        setView('list')
      },
      { timeout: 15000, enableHighAccuracy: false }
    )
  }

  const favoriteStores = stores.filter(s => favoriteIds.includes(s.store_id))
  const otherStores    = stores.filter(s => !favoriteIds.includes(s.store_id))

  return (
    <motion.div
      className="photo-page"
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <AnimatePresence mode="wait">

        {view === 'landing' && (
          <motion.div
            key="intro"
            className="landing-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="landing-title">ノミトク</h1>
            <p className="landing-tagline">今夜のお得、ここにある</p>
            <button className="landing-btn" onClick={handleEnter}>
              お得を探す 🍺
            </button>
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            className="landing-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="loading-spinner--light" />
            <p className="loading-text--light">お得を探しています</p>
          </motion.div>
        )}

        {view === 'list' && (
          <motion.div
            key="list"
            className="store-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="store-overlay-header">
              <span className="store-overlay-logo">ノミトク</span>
              <button className="store-overlay-login-btn" onClick={() => navigate('/login')}>
                {localStorage.getItem('token') ? 'ログアウト' : 'ログイン'}
              </button>
            </div>

            <div className="store-overlay-body">
              {geoError && <p className="store-overlay-error">{geoError}</p>}

              {favoriteStores.length > 0 && (
                <>
                  <p className="store-overlay-section">★ お気に入り</p>
                  {favoriteStores.map(store => (
                    <StoreCardDark key={store.store_id} store={store}
                      onClick={() => navigate(`/shop/${store.store_id}`, { state: { store } })} />
                  ))}
                </>
              )}

              {!geoError && (
                <>
                  <p className="store-overlay-section">近くの今のお得</p>
                  {otherStores.length === 0
                    ? <p className="store-overlay-empty">近くに該当するお店が見つかりませんでした</p>
                    : otherStores.map(store => (
                      <StoreCardDark key={store.store_id} store={store}
                        onClick={() => navigate(`/shop/${store.store_id}`, { state: { store } })} />
                    ))
                  }
                </>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}

function StoreCardDark({ store, onClick }) {
  return (
    <div className="store-card-dark" onClick={onClick}>
      <div className="store-card-dark-header">
        <span className="store-card-dark-name">{store.store_name}</span>
        <span className="store-card-dark-dist">📍 {store.distance}</span>
      </div>
      <div className="store-card-dark-deal">{store.coupon}</div>
      {store.note && <p className="store-card-dark-note">{store.note}</p>}
    </div>
  )
}

export default LandingPage
