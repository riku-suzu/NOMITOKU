import { motion } from 'framer-motion'
import { useNavigation } from '../context/NavigationContext'

function PageTransition({ children }) {
  const { dirRef } = useNavigation()
  const d = dirRef.current  // 1 or -1

  const variants = {
    initial: { x: `${100 * d}%`,  opacity: 0 },
    animate: { x: 0,              opacity: 1 },
    exit:    { x: `${-100 * d}%`, opacity: 0 },
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
