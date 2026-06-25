import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function LandingPage() {
  const [isOpening, setIsOpening] = useState(false)
  const navigate = useNavigate()

  const handleEnter = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => navigate('/nearby', { state: { fromLanding: true } }), 2000)
  }

  return (
    <div className="landing-screen">
      <motion.div
        className="landing-bg"
        animate={isOpening ? { scale: 1.35 } : { scale: 1 }}
        transition={{ duration: 2.2, ease: [0.25, 0.1, 0.1, 1] }}
      />
      <motion.div
        className="landing-content"
        animate={isOpening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
