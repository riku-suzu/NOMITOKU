export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

export const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

// /me/favoritestores のレスポンスは配列 or JSON文字列のどちらでも来る
export const parseFavoriteIds = (data) => {
  const raw = data.favorite ?? data
  return Array.isArray(raw) ? [...raw] : JSON.parse(raw)
}

export const fetchFavoriteIds = () =>
  fetch(`${API_HOST}/me/favoritestores`, { headers: authHeader() })
    .then(r => r.json())
    .then(parseFavoriteIds)

export const fetchToken = (email, password) =>
  fetch(`${API_HOST}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  })

// 一覧と詳細で同じお店を二重に取りに行かないようキャッシュする
const couponRequests = new Map()
const couponResults = new Map()

export const getCachedCoupons = (storeId) => couponResults.get(storeId)

export const fetchCoupons = (storeId) => {
  if (!couponRequests.has(storeId)) {
    const p = fetch(`${API_HOST}/stores/${storeId}/coupons`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(list => { couponResults.set(storeId, list); return list })
    p.catch(() => couponRequests.delete(storeId))
    couponRequests.set(storeId, p)
  }
  return couponRequests.get(storeId)
}

export const fetchNearbyStores = (lat, lng) =>
  fetch(`${API_HOST}/stores/nearby?lat=${lat}&lng=${lng}`)
    .then(r => { if (!r.ok) throw new Error(); return r.json() })

export const fetchStore = (storeId) =>
  fetch(`${API_HOST}/store/${storeId}`)
    .then(r => { if (!r.ok) throw new Error(); return r.json() })

export const updateFavoriteIds = (ids) =>
  fetch(`${API_HOST}/update_favorite`, {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  }).then(r => { if (!r.ok) throw new Error() })

// 位置情報を Promise で取得する
export const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) { reject({ code: 'unsupported' }); return }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
    reject,
    { timeout: 15000, enableHighAccuracy: false, maximumAge: 60000 },
  )
})
