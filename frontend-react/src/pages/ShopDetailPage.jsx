import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageShell from '../components/PageShell'
import Icon from '../components/Icon'
import StoreTags from '../components/StoreTags'
import CouponList from '../components/CouponList'
import EmptyState from '../components/EmptyState'
import { Skeleton } from '../components/Skeleton'
import { fetchFavoriteIds, fetchStore, hasToken, updateFavoriteIds } from '../utils/api'
import { stagger, rise, tap } from '../utils/motion'

function ShopDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { storeId } = useParams()
  const id = Number(storeId)
  const [store, setStore] = useState(location.state?.store || null)
  const [notFound, setNotFound] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favBusy, setFavBusy] = useState(false)
  const isLoggedIn = hasToken()

  useEffect(() => {
    if (!store) fetchStore(id).then(setStore).catch(() => setNotFound(true))
    if (isLoggedIn) fetchFavoriteIds().then(ids => setIsFavorite(ids.includes(id))).catch(() => {})
  }, [id])

  const toggleFavorite = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (favBusy) return
    const next = !isFavorite
    setIsFavorite(next) // 先に見た目を切り替え、失敗したら戻す
    setFavBusy(true)
    fetchFavoriteIds()
      .then(ids => updateFavoriteIds(next ? [...new Set([...ids, id])] : ids.filter(x => x !== id)))
      .catch(() => setIsFavorite(!next))
      .finally(() => setFavBusy(false))
  }

  // 直接開いたときは戻る先がないのでトップへ
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  return (
    <PageShell className="detail-page">
      <div className="detail-hero">
        {store?.photo
          ? <img
              src={store.photo_large || store.photo}
              onError={e => { if (e.currentTarget.src !== store.photo) e.currentTarget.src = store.photo }}
              alt=""
              className="detail-hero-img"
            />
          : <div className="detail-hero-img detail-hero-img--empty"><Icon name="beer" size={40} /></div>}
        <motion.button
          className={`fav-btn${isFavorite ? ' fav-btn--on' : ''}`}
          whileTap={{ scale: 0.88 }}
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isFavorite ? 'on' : 'off'}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 18 } }}
              exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.1 } }}
              style={{ display: 'flex' }}
            >
              <Icon name="heart" size={22} filled={isFavorite} />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <main className="container detail-body">
        {notFound ? (
          <EmptyState icon="alert" title="お店の情報が見つかりませんでした">
            掲載が終了した可能性があります。
          </EmptyState>
        ) : !store ? (
          <div className="detail-skeleton" aria-busy="true">
            <Skeleton width="75%" height={28} />
            <Skeleton width="50%" height={14} style={{ marginTop: 14 }} />
            <Skeleton width="100%" height={96} radius={16} style={{ marginTop: 28 }} />
          </div>
        ) : (
          <motion.div variants={stagger(0.06, 0.05)} initial="initial" animate="animate">
            <motion.section className="detail-head" variants={rise}>
              <p className="detail-meta">
                {[store.genre, store.station, store.distance && `現在地から${store.distance}`].filter(Boolean).join(' ・ ')}
              </p>
              <h1 className="detail-name">{store.store_name}</h1>
              {store.catch && <p className="detail-catch">{store.catch}</p>}
              <StoreTags store={store} />
            </motion.section>

            <motion.section className="detail-section" variants={rise}>
              <h2 className="section-label"><Icon name="ticket" size={15} />クーポン</h2>
              {store.source === 'hotpepper' ? (
                <>
                  <CouponList storeId={store.store_id} />
                  <p className="fine-print">
                    クーポンは、お店でホットペッパーグルメの画面を見せて使います（スクリーンショットは不可）。
                  </p>
                </>
              ) : (
                <div className="ticket"><p className="ticket-name">{store.coupon}</p></div>
              )}
            </motion.section>

            <motion.section className="detail-section" variants={rise}>
              <h2 className="section-label">お店の情報</h2>
              <dl className="info-list">
                <InfoRow icon="clock" label="営業時間" value={store.open || store.note} />
                <InfoRow icon="train" label="アクセス" value={store.access} />
                <InfoRow icon="yen" label="予算" value={store.budget} />
                <InfoRow icon="pin" label="住所" value={store.address} />
              </dl>
              {store.map_url && (
                <iframe src={store.map_url} className="detail-map" loading="lazy" title={`${store.store_name}の地図`} />
              )}
            </motion.section>

            {store.source === 'hotpepper' && (
              <p className="credit">
                <a href="http://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer">
                  Powered by ホットペッパーグルメ Webサービス
                </a>
              </p>
            )}
          </motion.div>
        )}
      </main>

      <div className="action-bar">
        <div className="action-bar-inner">
          <motion.button className="btn btn-secondary btn-lg" whileTap={tap} onClick={goBack}>
            <Icon name="back" size={18} />
            戻る
          </motion.button>
          {store?.coupon_url && (
            <motion.a
              className="btn btn-primary btn-lg"
              whileTap={tap}
              href={store.coupon_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              クーポンを表示
              <Icon name="external" size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </PageShell>
  )
}

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="info-row">
      <dt><Icon name={icon} size={16} /><span>{label}</span></dt>
      <dd>{value}</dd>
    </div>
  )
}

export default ShopDetailPage
