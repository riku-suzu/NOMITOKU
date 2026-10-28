import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ease } from '../utils/motion'

function Toast({ message, onDone, duration = 2200 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [message, onDone, duration])

  return (
    <div className="toast-region" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            className="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: ease.out } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Toast
