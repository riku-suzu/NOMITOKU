import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDir } from '../context/DirectionCtx'
import { pageVariants } from '../utils/motion'

// 各ページ共通のラッパー（ページ遷移アニメーション）
function PageShell({ children, className = '', keepScroll = false }) {
  const { dir } = useDir()

  useEffect(() => {
    if (!keepScroll) window.scrollTo(0, 0)
  }, [keepScroll])

  return (
    <motion.div
      className={`page ${className}`}
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default PageShell
