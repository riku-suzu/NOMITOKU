import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_HOST = 'http://localhost:8000'

function HomePage() {
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  // ページが開いた瞬間に1回だけ実行される
  useEffect(() => {
    const token = localStorage.getItem('token')

    // トークンがなければログインページに飛ばす
    if (!token) {
      navigate('/login')
      return
    }

    fetch(`${API_HOST}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json()
        // トークンが無効なら（期限切れなど）ログインページへ
        navigate('/login')
      })
      .then((data) => {
        if (data) setNickname(data.nickname)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="container">
      <h2>こんにちは、{nickname}さん</h2>

      <div className="search-options">
        <Link to="/nearby" className="button12">近くの「今のお得」を探す</Link>
      </div>

      <br />
      <button onClick={handleLogout} className="button13">ログアウト</button>
    </div>
  )
}

export default HomePage
