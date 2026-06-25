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
  const { dir, setDir } = useDir()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!location.state?.store) {
      fetch(`${API_HOST}/store/${storeId}`).then((r) => r.json()).then((d) => setStore(d))
    }

    if (token) {
      fetch(`${API_HOST}/me/favoritestores`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => {
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
      .then((r) => r.json())
      .then((data) => {
        const raw = data.favorite ?? data
        let ids = Array.isArray(raw) ? [...raw] : JSON.parse(raw)
        ids = isFavorite ? ids.filter((id) => id !== Number(storeId)) : [...ids, Number(storeId)]
        return fetch(`${API_HOST}/update_favorite`, { method: 'PUT', headers, body: JSON.stringify(ids) })
      })
      .then(() => { setIsFavorite(!isFavorite); setFavLoading(false) })
      .catch(() => setFavLoading(false))
  }

  if (!store) return <p style={{ textAlign: 'center', padding: '48px', color: '#ccc' }}>読み込み中...</p>

  return (
    <motion.div
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="page-content">
        <div className="detail-card">
          <div className="detail-top">
            <div className="detail-top-left">
              <h2 className="detail-name">{store.store_name}</h2>
              <p className="detail-dist">📍 {store.distance}</p>
            </div>
            {localStorage.getItem('token') ? (
              <button
                onClick={handleToggleFavorite}
                className={`btn-fav${isFavorite ? ' btn-fav--on' : ''}`}
              >
                {favLoading ? '登録中...' : isFavorite ? '♥ お気に入り済み' : '♡ お気に入り'}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-fav">
                ♡ お気に入り
              </button>
            )}
          </div>

          <hr className="detail-rule" />

          <div className="detail-coupon-section">
            <p className="detail-coupon-label">本日のお得</p>
            <p className="detail-coupon-text">{store.coupon}</p>
          </div>

          <hr className="detail-rule" />

          <div className="detail-info">
            {store.phonenumber && (
              <div className="detail-info-row">
                <span className="detail-info-icon">📞</span>
                <span>{store.phonenumber}</span>
              </div>
            )}
            {store.note && (
              <div className="detail-info-row">
                <span className="detail-info-icon">📝</span>
                <span>{store.note}</span>
              </div>
            )}
          </div>
        </div>

        {store.map_url && (
          <iframe
            src={store.map_url}
            className="detail-map"
            allowFullScreen
            loading="lazy"
            title="地図"
          />
        )}

        <button onClick={() => { setDir(-1); navigate('/nearby') }} className="btn-secondary">
          ← 一覧に戻る
        </button>
      </div>
    </motion.div>
  )
}

export default ShopDetailPage
