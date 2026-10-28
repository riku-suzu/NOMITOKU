import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppBar from './AppBar'
import Icon from './Icon'
import { stagger, rise, tap } from '../utils/motion'

// ログイン・会員登録で共通のレイアウト
export function AuthLayout({ title, lead, onBack, children }) {
  return (
    <div className="auth-page">
      <AppBar
        left={
          <button className="icon-btn" onClick={onBack} aria-label="戻る">
            <Icon name="back" size={20} />
          </button>
        }
        right={<span className="brand brand--sm">ノミトク</span>}
      />
      <motion.main className="container auth-body" variants={stagger(0.06, 0.05)} initial="initial" animate="animate">
        <motion.h1 className="auth-title" variants={rise}>{title}</motion.h1>
        <motion.p className="auth-lead" variants={rise}>{lead}</motion.p>
        <motion.div variants={rise}>{children}</motion.div>
      </motion.main>
    </div>
  )
}

export function Field({ label, type = 'text', ...inputProps }) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-control">
        <input type={isPassword && reveal ? 'text' : type} {...inputProps} />
        {isPassword && (
          <button
            type="button"
            className="field-toggle"
            onClick={() => setReveal(r => !r)}
            aria-label={reveal ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            <Icon name={reveal ? 'eyeOff' : 'eye'} size={18} />
          </button>
        )}
      </span>
    </label>
  )
}

export function FormError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="form-error"
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Icon name="alert" size={16} />{message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function SubmitButton({ busy, children, busyText }) {
  return (
    <motion.button type="submit" className="btn btn-primary btn-lg btn-block" whileTap={tap} disabled={busy}>
      {busy && <span className="btn-spinner" aria-hidden="true" />}
      {busy ? busyText : children}
    </motion.button>
  )
}
