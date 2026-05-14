import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants, pageTransition } from '../utils/motion'

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

function IndexPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { dir } = useDir()

  const handleLogin = () => {
    if (!email || !password) { setErrorMsg('全ての項目を入力してください'); return }
    setSubmitting(true)
    setErrorMsg('')

    fetch(`${API_HOST}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    })
      .then((res) => { if (res.ok) return res.json(); throw new Error('メールアドレスまたはパスワードが間違っています') })
      .then((data) => { localStorage.setItem('token', data.access_token); navigate('/nearby') })
      .catch((error) => { setErrorMsg(error.message); setSubmitting(false) })
  }

  // ログイン済みなら一覧へ（トークンが有効な場合のみ）
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API_HOST}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) navigate('/nearby'); else localStorage.removeItem('token') })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="page-content">
        {submitting ? (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p className="loading-text">あなたに最適なお得を<br />頑張って探しています</p>
          </div>
        ) : (
          <div className="login-card">
            <h2>ログイン</h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <div className="form-group">
              <label>メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
            </div>
            <div className="form-group">
              <label>パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
            </div>
            <button onClick={handleLogin} className="btn-primary">ログイン</button>
            <p className="signup-link">
              アカウントをお持ちでない方は{' '}
              <button onClick={() => navigate('/signup')} className="btn-text">新規会員登録</button>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default IndexPage
