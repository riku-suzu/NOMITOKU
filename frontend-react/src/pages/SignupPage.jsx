import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_HOST = 'http://localhost:8000'

function SignupPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleRegister = () => {
    if (nickname === '' || email === '' || password === '') {
      setErrorMsg('全ての項目を入力してください')
      return
    }

    // 登録はJSONで送る（ログインとここが違う）
    fetch(`${API_HOST}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, email, password }),
    })
      .then((res) => {
        if (res.ok) return res.json()
        if (res.status === 400) throw new Error('このメールアドレスは既に登録されています')
        throw new Error('登録に失敗しました')
      })
      .then(() => {
        setSuccessMsg('登録成功！ログインページへどうぞ')
        setErrorMsg('')
      })
      .catch((error) => {
        setErrorMsg(error.message)
      })
  }

  return (
    <div className="container">
      <h1>ノミトク</h1>
      <h2>新規登録</h2>

      <div className="login-container">
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {successMsg && (
          <p style={{ color: 'green' }}>
            {successMsg} <Link to="/login">ログインページへ</Link>
          </p>
        )}

        <label>ニックネーム:</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <br />
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
      <button onClick={handleRegister} className="button13">新規登録</button>
      <p><Link to="/">トップに戻る</Link></p>
    </div>
  )
}

export default SignupPage
