import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_HOST = 'http://localhost:8000'

function LoginPage() {
  // フォームの入力値をstateで管理する
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // ページ遷移に使うhook（React RouterのLink以外でコードから遷移したいとき）
  const navigate = useNavigate()

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorMsg('全ての項目を入力してください')
      return
    }

    fetch(`${API_HOST}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${email}&password=${password}`,
    })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('メールアドレスまたはパスワードが間違っています')
      })
      .then((data) => {
        localStorage.setItem('token', data.access_token)
        navigate('/home')
      })
      .catch((error) => {
        setErrorMsg(error.message)
      })
  }

  return (
    <div className="container">
      <h1>ノミトク</h1>
      <h2>ログイン</h2>

      <div className="login-container">
        {/* エラーメッセージ。errorMsgが空のときは何も表示しない */}
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <label>メールアドレス:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>パスワード:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />
      <button onClick={handleLogin} className="button13">ログイン</button>
      <p><Link to="/">トップに戻る</Link></p>
    </div>
  )
}

export default LoginPage
