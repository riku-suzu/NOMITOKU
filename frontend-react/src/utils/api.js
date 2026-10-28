const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

// ===== ログイン状態（トークンは localStorage に保存する） =====
const TOKEN_KEY = 'token'

export const hasToken = () => !!localStorage.getItem(TOKEN_KEY)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` })

// ===== 通信の共通処理 =====
// 失敗（ok でない）ときは例外にして、成功したら JSON を返す
const getJson = (path, options) =>
  fetch(`${API_HOST}${path}`, options)
    .then(r => { if (!r.ok) throw new Error(); return r.json() })

// 画面に出すエラー文。通信そのものに失敗したとき（fetch は TypeError を投げる）は共通の文言にする
export const toErrorMessage = (error) =>
  error instanceof TypeError ? '通信に失敗しました。時間をおいてお試しください' : error.message

// ===== 会員登録・ログイン =====
export const createUser = (user) =>
  fetch(`${API_HOST}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

// トークンを取得して保存する（メールアドレスかパスワードが違えば false）
export const login = (email, password) =>
  fetch(`${API_HOST}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  }).then(res => {
    if (!res.ok) return false
    return res.json().then(data => { localStorage.setItem(TOKEN_KEY, data.access_token); return true })
  })

export const fetchMe = () => fetch(`${API_HOST}/me`, { headers: authHeader() })

// ===== お気に入り =====
// /me/favoritestores のレスポンスは配列 or JSON文字列のどちらでも来る
const parseFavoriteIds = (data) => {
  const raw = data.favorite ?? data
  return Array.isArray(raw) ? [...raw] : JSON.parse(raw)
}

export const fetchFavoriteIds = () =>
  getJson('/me/favoritestores', { headers: authHeader() }).then(parseFavoriteIds)

export const updateFavoriteIds = (ids) =>
  fetch(`${API_HOST}/update_favorite`, {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  }).then(r => { if (!r.ok) throw new Error() })

// ===== お店 =====
export const fetchNearbyStores = (lat, lng) => getJson(`/stores/nearby?lat=${lat}&lng=${lng}`)

export const fetchStore = (storeId) => getJson(`/store/${storeId}`)

// 一覧と詳細で同じお店を二重に取りに行かないようキャッシュする
const couponRequests = new Map()
const couponResults = new Map()

export const getCachedCoupons = (storeId) => couponResults.get(storeId)

export const fetchCoupons = (storeId) => {
  if (!couponRequests.has(storeId)) {
    const p = getJson(`/stores/${storeId}/coupons`)
      .then(list => { couponResults.set(storeId, list); return list })
    p.catch(() => couponRequests.delete(storeId))
    couponRequests.set(storeId, p)
  }
  return couponRequests.get(storeId)
}

// ===== 位置情報 =====
// 位置情報を Promise で取得する
export const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) { reject({ code: 'unsupported' }); return }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
    reject,
    { timeout: 15000, enableHighAccuracy: false, maximumAge: 60000 },
  )
})
