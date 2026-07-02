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
      .then(res => { if (res.ok) return res.json(); throw new Error('メールアドレスまたはパスワードが間違っています') })
      .then(data => { localStorage.setItem('token', data.access_token); navigate('/') })
      .catch(error => { setErrorMsg(error.message); setSubmitting(false) })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API_HOST}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.ok) navigate('/'); else localStorage.removeItem('token') })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      className="photo-page"
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {submitting ? (
        <div className="landing-loading">
          <div className="loading-spinner--light" />
          <p className="loading-text--light">ログイン中…</p>
        </div>
      ) : (
        <div className="auth-card">
          <h2 className="auth-card-title">ログイン</h2>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <div className="form-group">
            <label>メールアドレス</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワード" />
          </div>
          <button onClick={handleLogin} className="btn-primary">ログイン</button>
          <p className="signup-link">
            アカウントをお持ちでない方は{' '}
            <button onClick={() => navigate('/signup')} className="btn-text">新規会員登録</button>
          </p>
          <button onClick={() => navigate(-1)} className="btn-back-login">← 戻る</button>
        </div>
      )}
    </motion.div>
  )
}

export default IndexPage
