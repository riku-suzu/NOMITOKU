import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { AuthLayout, Field, FormError, SubmitButton } from '../components/AuthForm'
import { API_HOST, authHeader, fetchToken } from '../utils/api'

function IndexPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) { setErrorMsg('メールアドレスとパスワードを入力してください'); return }
    setSubmitting(true)
    setErrorMsg('')
    fetchToken(email, password)
      .then(res => { if (res.ok) return res.json(); throw new Error('メールアドレスまたはパスワードが違います') })
      .then(data => { localStorage.setItem('token', data.access_token); navigate('/') })
      .catch(error => {
        setErrorMsg(error instanceof TypeError ? '通信に失敗しました。時間をおいてお試しください' : error.message)
        setSubmitting(false)
      })
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    fetch(`${API_HOST}/me`, { headers: authHeader() })
      .then(r => { if (r.ok) navigate('/'); else localStorage.removeItem('token') })
      .catch(() => {})
  }, [])

  return (
    <PageShell>
      <AuthLayout
        title="ログイン"
        lead="お気に入りのお店を保存して、いつでも見返せます。"
        onBack={() => navigate(-1)}
      >
        <form className="form" onSubmit={handleLogin} noValidate>
          <FormError message={errorMsg} />
          <Field label="メールアドレス" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com" autoComplete="email" inputMode="email" />
          <Field label="パスワード" type="password" value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" />
          <SubmitButton busy={submitting} busyText="ログイン中…">ログイン</SubmitButton>
        </form>
        <p className="auth-switch">
          はじめての方は
          <button className="link-btn" onClick={() => navigate('/signup')}>新規登録</button>
        </p>
      </AuthLayout>
    </PageShell>
  )
}

export default IndexPage
