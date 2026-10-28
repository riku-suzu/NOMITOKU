import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'

// 詳細ページのお気に入りボタン（ハートが弾むように切り替わる）
function FavoriteButton({ isFavorite, onClick }) {
  return (
    <motion.button
      className={`fav-btn${isFavorite ? ' fav-btn--on' : ''}`}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに追加'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isFavorite ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 18 } }}
          exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.1 } }}
          style={{ display: 'flex' }}
        >
          <Icon name="heart" size={22} filled={isFavorite} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default FavoriteButton
