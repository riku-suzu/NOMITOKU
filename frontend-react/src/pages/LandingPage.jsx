import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function LandingPage() {
  const [isOpening, setIsOpening] = useState(false)
  const navigate = useNavigate()

  const handleEnter = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => navigate('/nearby'), 2000)
  }

  return (
    <div className="noren-screen">
      <motion.div
        className="noren-panel noren-panel--left"
        style={{ transformOrigin: 'left center' }}
        animate={isOpening ? { rotateY: -90 } : { rotateY: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.4, 0, 0.15, 1] }}
      />
      <motion.div
        className="noren-panel noren-panel--right"
        style={{ transformOrigin: 'right center' }}
        animate={isOpening ? { rotateY: 90 } : { rotateY: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.4, 0, 0.15, 1] }}
      />
      <motion.div
        className="noren-center"
        animate={isOpening ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="noren-title">ノミトク</h1>
        <p className="noren-tagline">今夜のお得、ここにある</p>
        <button className="noren-btn" onClick={handleEnter}>
          お得を探す 🍺
        </button>
      </motion.div>
    </div>
  )
}

export default LandingPage
