import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { AuthLayout, Field, FormError, SubmitButton } from '../components/AuthForm'
import { useDir } from '../context/DirectionCtx'
import { createUser, login, toErrorMessage } from '../utils/api'

function SignupPage() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setDir } = useDir()

  const handleRegister = (e) => {
    e.preventDefault()
    if (!nickname || !email || !password) { setErrorMsg('すべての項目を入力してください'); return }
    setSubmitting(true)
    setErrorMsg('')
    createUser({ nickname, email, password })
      .then(res => {
        if (res.ok) return login(email, password)
        if (res.status === 400) throw new Error('このメールアドレスはすでに登録されています')
        throw new Error('登録に失敗しました')
      })
      .then(ok => { if (!ok) throw new Error('自動ログインに失敗しました'); navigate('/') })
      .catch(error => {
        setErrorMsg(toErrorMessage(error))
        setSubmitting(false)
      })
  }

  return (
    <PageShell>
      <AuthLayout
        title="新規登録"
        lead="無料で登録できます。お気に入りのお店を保存できるようになります。"
        onBack={() => navigate(-1)}
      >
        <form className="form" onSubmit={handleRegister} noValidate>
          <FormError message={errorMsg} />
          <Field label="ニックネーム" value={nickname} onChange={e => setNickname(e.target.value)}
            placeholder="のみたろう" autoComplete="nickname" />
          <Field label="メールアドレス" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com" autoComplete="email" inputMode="email" />
          <Field label="パスワード" type="password" value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="new-password" />
          <SubmitButton busy={submitting} busyText="登録中…">登録してはじめる</SubmitButton>
        </form>
        <p className="auth-switch">
          アカウントをお持ちの方は
          <button className="link-btn" onClick={() => { setDir(-1); navigate('/login') }}>ログイン</button>
        </p>
      </AuthLayout>
    </PageShell>
  )
}

export default SignupPage
