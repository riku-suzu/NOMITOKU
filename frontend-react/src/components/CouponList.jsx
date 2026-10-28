import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Icon from './Icon'
import EmptyState from './EmptyState'
import { Skeleton } from './Skeleton'
import { fetchCoupons, getCachedCoupons } from '../utils/api'
import { stagger, rise } from '../utils/motion'

// 詳細ページのクーポン一覧（チケット型）
function CouponList({ storeId }) {
  const [coupons, setCoupons] = useState(() => getCachedCoupons(storeId) ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetchCoupons(storeId).then(setCoupons).catch(() => setFailed(true))
  }, [storeId])

  if (failed) {
    return <EmptyState icon="alert" title="クーポン情報を取得できませんでした" />
  }
  if (coupons === null) {
    return (
      <div className="ticket ticket--skeleton" aria-busy="true">
        <Skeleton width="80%" height={18} />
        <Skeleton width="55%" height={12} style={{ marginTop: 12 }} />
      </div>
    )
  }
  if (!coupons.length) {
    return <EmptyState icon="ticket" title="現在掲載中のクーポンはありません" />
  }

  return (
    <motion.ul className="ticket-list" variants={stagger(0.06)} initial="initial" animate="animate">
      {coupons.map(c => <CouponTicket key={c.name} coupon={c} />)}
    </motion.ul>
  )
}

function CouponTicket({ coupon }) {
  const { 利用条件: rules, ...rest } = coupon.conditions
  return (
    <motion.li className="ticket" variants={rise}>
      <p className="ticket-name">{coupon.name}</p>
      <dl className="ticket-facts">
        {Object.entries(rest).map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      {rules && (
        <details className="ticket-rules">
          <summary>利用条件<Icon name="chevron" size={16} /></summary>
          <p>{rules.replace(/\//g, ' / ')}</p>
        </details>
      )}
    </motion.li>
  )
}

export default CouponList
