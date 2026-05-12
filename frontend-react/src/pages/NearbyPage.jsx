import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_HOST = 'http://localhost:8000'

function NearbyPage() {
  const [nickname, setNickname] = useState('')
  const [stores, setStores] = useState([])         // 全店舗リスト
  const [favoriteIds, setFavoriteIds] = useState([]) // お気に入り店舗IDのリスト
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    // ① ユーザー情報を取得
    fetch(`${API_HOST}/me`, { headers })
      .then((res) => res.json())
      .then((data) => setNickname(data.nickname))

    // ② 全店舗を取得
    fetch(`${API_HOST}/stores`, { headers })
      .then((res) => res.json())
      .then((data) => setStores(data))

    // ③ お気に入り店舗IDを取得
    fetch(`${API_HOST}/me/favoritestores`, { headers })
      .then((res) => res.json())
      .then((data) => {
        // favoriteはDB上でJSON文字列なのでパースが必要
        const raw = data.favorite ?? data
        const ids = Array.isArray(raw) ? raw : JSON.parse(raw)
        setFavoriteIds(ids)
      })
  }, [])

  // 距離順に並び替えるヘルパー関数
  const sortByDistance = (list) =>
    [...list].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

  // お気に入りとそれ以外に分ける
  const favoriteStores = sortByDistance(
    stores.filter((s) => favoriteIds.includes(s.store_id))
  )
  const otherStores = sortByDistance(
    stores.filter((s) => !favoriteIds.includes(s.store_id))
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="container">
      <h1>近くの店舗と今のお得</h1>

      <div className="section">
        {/* お気に入り店舗 */}
        <h2>{nickname}さんのお気に入り店舗</h2>
        <div className="store-item">
          {favoriteStores.length === 0 ? (
            <p>お気に入り店舗はありません</p>
          ) : (
            favoriteStores.map((store) => (
              <div
                key={store.store_id}
                className="container store-card"
                onClick={() => navigate(`/shop/${store.store_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{store.store_name}</h3>
                <p>距離: {store.distance}</p>
                <p>本日のお得: {store.coupon}</p>
                <p>備考: {store.note}</p>
              </div>
            ))
          )}
        </div>

        <button onClick={handleLogout} className="button13">ログアウト</button>

        {/* 近隣店舗 */}
        <div className="section">
          <h2>近くの今のお得</h2>
          <div className="store-item">
            {otherStores.map((store) => (
              <div
                key={store.store_id}
                className="container store-card"
                onClick={() => navigate(`/shop/${store.store_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{store.store_name}</h3>
                <p>距離: {store.distance}</p>
                <p>本日のお得: {store.coupon}</p>
                <p>備考: {store.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link to="/home" className="button13">戻る</Link>
    </div>
  )
}

export default NearbyPage
