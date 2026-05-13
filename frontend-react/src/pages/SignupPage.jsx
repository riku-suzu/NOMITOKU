import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants, pageTransition } from '../utils/motion'

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000'

function SignupPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { dir, setDir } = useDir()

  const handleRegister = () => {
    if (!nickname || !email || !password) { setErrorMsg('全ての項目を入力してください'); return }
    setSubmitting(true)
    setErrorMsg('')

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
      .then(() =>
        fetch(`${API_HOST}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        })
      )
      .then((res) => { if (res.ok) return res.json(); throw new Error('自動ログインに失敗しました') })
      .then((data) => { localStorage.setItem('token', data.access_token); navigate('/nearby') })
      .catch((error) => { setErrorMsg(error.message); setSubmitting(false) })
  }

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
            <h2>新規会員登録</h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <div className="form-group">
              <label>ニックネーム</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="ニックネーム" />
            </div>
            <div className="form-group">
              <label>メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
            </div>
            <div className="form-group">
              <label>パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
            </div>
            <button onClick={handleRegister} className="btn-primary">登録してはじめる</button>
            <p className="signup-link">
              すでにアカウントをお持ちの方は{' '}
              <button onClick={() => { setDir(-1); navigate('/') }} className="btn-text">ログイン</button>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SignupPage
