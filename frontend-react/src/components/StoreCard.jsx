import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from './Icon'
import StoreTags from './StoreTags'
import { Skeleton } from './Skeleton'
import { fade, tap } from '../utils/motion'

const MotionLink = motion.create(Link)

// coupons: undefined = 取得中 / [] = なし / [...] = あり
function StoreCard({ store, coupons, isFavorite, onOpen }) {
  const isHotpepper = store.source === 'hotpepper'
  const meta = [store.distance, store.station, store.budget].filter(Boolean)

  return (
    <motion.li className="store-item" variants={fade} layout="position" exit={{ opacity: 0 }}>
      <MotionLink
        to={`/shop/${store.store_id}`}
        state={{ store }}
        className="store-card"
        whileTap={tap}
        onClick={onOpen}
      >
        <div className="store-card-main">
          <div className="store-thumb">
            {store.photo
              ? <img src={store.photo} alt="" loading="lazy" />
              : <Icon name="beer" size={28} />}
          </div>

          <div className="store-card-body">
            <h3 className="store-card-name">
              {store.store_name}
              {isFavorite && <Icon name="heart" size={14} filled className="store-card-fav" />}
            </h3>
            <p className="store-card-meta">
              {meta.map((m, i) => (
                <span key={i}>{i === 0 && <Icon name="pin" size={13} />}{m}</span>
              ))}
            </p>
            <StoreTags store={store} className="store-card-tags" />
          </div>
        </div>

        {isHotpepper ? (
          <CouponStrip coupons={coupons} fallback={store.catch} />
        ) : (
          store.coupon && <div className="coupon-strip"><Icon name="ticket" size={16} /><span className="coupon-strip-text">{store.coupon}</span></div>
        )}
      </MotionLink>
    </motion.li>
  )
}

function CouponStrip({ coupons, fallback }) {
  if (coupons === undefined) {
    return <div className="coupon-strip coupon-strip--loading"><Skeleton width="75%" height={13} /></div>
  }
  if (!coupons.length) {
    return fallback ? <p className="store-card-catch">{fallback}</p> : null
  }
  return (
    <motion.div className="coupon-strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Icon name="ticket" size={16} />
      <span className="coupon-strip-text">{coupons[0].name.replace(/\n/g, ' ')}</span>
      {coupons.length > 1 && <span className="coupon-strip-more">+{coupons.length - 1}</span>}
    </motion.div>
  )
}

export default StoreCard
