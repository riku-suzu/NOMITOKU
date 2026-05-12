import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const API_HOST = 'http://localhost:8000'

function ShopDetailPage() {
  const [store, setStore] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

  // URLの /shop/:storeId から storeId を取り出す
  const { storeId } = useParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    // ① 店舗詳細を取得
    fetch(`${API_HOST}/store/${storeId}`, { headers })
      .then((res) => res.json())
      .then((data) => setStore(data))

    // ② お気に入り状態を確認
    fetch(`${API_HOST}/me/favoritestores`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.favorite ?? data
        const idList = Array.isArray(raw) ? raw : JSON.parse(raw)
        setIsFavorite(idList.includes(Number(storeId)))
      })
  }, [storeId])

  // お気に入りの追加・削除
  const handleToggleFavorite = () => {
    const token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    fetch(`${API_HOST}/me/favoritestores`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.favorite ?? data
        let idList = Array.isArray(raw) ? [...raw] : JSON.parse(raw)

        if (isFavorite) {
          idList = idList.filter((id) => id !== Number(storeId))
        } else {
          idList.push(Number(storeId))
        }

        return fetch(`${API_HOST}/update_favorite`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(idList),
        })
      })
      .then(() => setIsFavorite(!isFavorite))
  }

  // 店舗情報がまだ取得できていない間はローディング表示
  if (!store) return <p>読み込み中...</p>

  return (
    <div className="container">
      <h2>お店の詳細</h2>

      <button onClick={handleToggleFavorite} className="button14">
        {isFavorite ? 'お気に入り済み' : 'お気に入り'}
      </button>

      <div className="section">
        <div className="container">
          <h1>{store.store_name}</h1>
          <p>距離: {store.distance}</p>
          <p>本日のお得: {store.coupon}</p>
          <p>備考: {store.note}</p>
          <p>電話番号: {store.phonenumber}</p>
          <p>場所:</p>
          <iframe
            src={store.map_url}
            width="750"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      <br />
      <Link to="/nearby" className="button13">一覧に戻る</Link>
    </div>
  )
}

export default ShopDetailPage
