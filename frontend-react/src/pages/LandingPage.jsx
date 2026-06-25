import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function LandingPage() {
  const [isOpening, setIsOpening] = useState(false)
  const navigate = useNavigate()

  const handleEnter = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => navigate('/nearby', { state: { fromLanding: true } }), 1400)
  }

  return (
    <div className="landing-screen">
      <motion.div
        className="landing-bg"
        animate={isOpening ? { scale: 1.4 } : { scale: 1 }}
        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.div
        className="landing-content"
        animate={isOpening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="landing-title">ノミトク</h1>
        <p className="landing-tagline">今夜のお得、ここにある</p>
        <button className="landing-btn" onClick={handleEnter}>
          お得を探す 🍺
        </button>
      </motion.div>
    </div>
  )
}

export default LandingPage
