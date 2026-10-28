import { useState, useEffect } from 'react'
import { fetchCoupons, getCachedCoupons } from '../utils/api'

// 一覧のお店のクーポンを順次取得する（{ [store_id]: coupons[] }）
export function useCoupons(stores) {
  const [coupons, setCoupons] = useState(() => initialFromCache(stores))

  useEffect(() => {
    let alive = true
    stores
      .filter(s => s.source === 'hotpepper')
      .forEach(s => {
        fetchCoupons(s.store_id)
          .catch(() => [])
          .then(list => { if (alive) setCoupons(prev => ({ ...prev, [s.store_id]: list })) })
      })
    return () => { alive = false }
  }, [stores])

  return coupons
}

function initialFromCache(stores) {
  const map = {}
  stores.forEach(s => {
    const cached = getCachedCoupons(s.store_id)
    if (cached) map[s.store_id] = cached
  })
  return map
}
