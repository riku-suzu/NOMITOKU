import { motion } from 'framer-motion'
import Icon from './Icon'
import { stagger, rise, heroTitle, tap } from '../utils/motion'

function Hero({ isLoggedIn, onStart, onLogin }) {
  return (
    <div className="hero">
      <div className="hero-bg" aria-hidden="true" />

      {!isLoggedIn && (
        <button className="hero-login" onClick={onLogin}>ログイン</button>
      )}

      <motion.div
        className="hero-content"
        variants={stagger(0.16, 0.1)}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.p className="hero-eyebrow" variants={rise}>近くの居酒屋クーポン</motion.p>
        <motion.h1 className="hero-title" variants={heroTitle}>ノミトク</motion.h1>
        <motion.p className="hero-tagline" variants={rise}>今夜のお得、ここにある。</motion.p>

        <motion.div className="hero-actions" variants={rise}>
          <motion.button className="btn btn-primary btn-lg btn-block" whileTap={tap} onClick={onStart}>
            <Icon name="locate" size={18} />
            現在地から探す
          </motion.button>
          <p className="hero-note">位置情報は、近くのお店を探すためだけに使います</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
