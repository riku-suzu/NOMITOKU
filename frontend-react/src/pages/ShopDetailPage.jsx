import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants, pageTransition } from '../utils/motion'

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

function ShopDetailPage() {
  const location = useLocation()
  const [store, setStore] = useState(location.state?.store || null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const navigate = useNavigate()
  const { storeId } = useParams()
  const { dir } = useDir()

  useEffect(() => {
    if (!location.state?.store) {
      fetch(`${API_HOST}/store/${storeId}`).then(r => r.json()).then(setStore)
    }
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API_HOST}/me/favoritestores`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          const raw = data.favorite ?? data
          const ids = Array.isArray(raw) ? raw : JSON.parse(raw)
          setIsFavorite(ids.includes(Number(storeId)))
        })
    }
  }, [storeId])

  const handleToggleFavorite = () => {
    if (favLoading) return
    setFavLoading(true)
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    fetch(`${API_HOST}/me/favoritestores`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const raw = data.favorite ?? data
        let ids = Array.isArray(raw) ? [...raw] : JSON.parse(raw)
        ids = isFavorite ? ids.filter(id => id !== Number(storeId)) : [...ids, Number(storeId)]
        return fetch(`${API_HOST}/update_favorite`, { method: 'PUT', headers, body: JSON.stringify(ids) })
      })
      .then(() => { setIsFavorite(!isFavorite); setFavLoading(false) })
      .catch(() => setFavLoading(false))
  }

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

      <div className="shop-detail-overlay">
        <div className="store-overlay-header">
          <span />
          {localStorage.getItem('token') ? (
            <button
              onClick={handleToggleFavorite}
              className={`shop-detail-fav${isFavorite ? ' shop-detail-fav--on' : ''}`}
            >
              {favLoading ? '登録中...' : isFavorite ? '♥ お気に入り済み' : '♡ お気に入り'}
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="shop-detail-fav">
              ♡ お気に入り
            </button>
          )}
        </div>

        {!store ? (
          <div className="landing-loading" style={{ flex: 1 }}>
            <div className="loading-spinner--light" />
          </div>
        ) : (
          <div className="store-overlay-body">
            <div className="shop-detail-card">
              <h2 className="shop-detail-name">{store.store_name}</h2>
              {store.distance && <p className="shop-detail-dist">📍 {store.distance}</p>}
            </div>

            <div className="shop-detail-card">
              <p className="shop-detail-coupon-label">本日のお得</p>
              <p className="shop-detail-coupon-text">{store.coupon}</p>
            </div>

            {(store.phonenumber || store.note) && (
              <div className="shop-detail-card">
                {store.phonenumber && (
                  <div className="shop-detail-info-row">
                    <span>📞</span>
                    <span>{store.phonenumber}</span>
                  </div>
                )}
                {store.note && (
                  <div className="shop-detail-info-row">
                    <span>📝</span>
                    <span>{store.note}</span>
                  </div>
                )}
              </div>
            )}

            {store.map_url && (
              <iframe
                src={store.map_url}
                className="shop-detail-map"
                allowFullScreen
                loading="lazy"
                title="地図"
              />
            )}
          </div>
        )}
        <div className="shop-detail-footer">
          <button className="shop-detail-back-btn" onClick={() => navigate(-1)}>
            ← 一覧に戻る
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ShopDetailPage
