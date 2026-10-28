import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { AuthLayout, Field, FormError, SubmitButton } from '../components/AuthForm'
import { clearToken, fetchMe, hasToken, login, toErrorMessage } from '../utils/api'

function LoginPage() {
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
    login(email, password)
      .then(ok => { if (!ok) throw new Error('メールアドレスまたはパスワードが違います'); navigate('/') })
      .catch(error => {
        setErrorMsg(toErrorMessage(error))
        setSubmitting(false)
      })
  }

  useEffect(() => {
    // ログイン済みならトップへ。トークンが切れていたら消しておく
    if (!hasToken()) return
    fetchMe()
      .then(r => { if (r.ok) navigate('/'); else clearToken() })
      .catch(() => {})
  // 画面を開いたときに1回だけ確認する
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default LoginPage
