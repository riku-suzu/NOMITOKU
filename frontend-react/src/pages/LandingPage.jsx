import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import Hero from '../components/Hero'
import StoreList from '../components/StoreList'
import Toast from '../components/Toast'
import { fetchFavoriteIds, fetchNearbyStores, getCurrentPosition } from '../utils/api'
import { fade } from '../utils/motion'

// 詳細から戻ったときに一覧をそのまま出すためのキャッシュ
const cache = { stores: null, scrollY: 0 }

const GEO_ERRORS = {
  denied: {
    icon: 'locate',
    title: '位置情報がオフになっています',
    body: (
      <>
        近くのお店を探すには位置情報の許可が必要です。<br />
        iPhone：設定 → プライバシーとセキュリティ → 位置情報サービス → Safari を「使用中のみ」に
      </>
    ),
  },
  position: { icon: 'locate', title: '現在地を取得できませんでした', body: '電波の良い場所で、もう一度お試しください。' },
  network: { icon: 'alert', title: 'お店の情報を取得できませんでした', body: '通信状況を確認して、もう一度お試しください。' },
}

function LandingPage() {
  const [view, setView] = useState(cache.stores ? 'list' : 'hero')
  const [status, setStatus] = useState(cache.stores ? 'ready' : 'idle')
  const [stores, setStores] = useState(cache.stores || [])
  const [error, setError] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) return
    fetchFavoriteIds().then(setFavoriteIds).catch(() => {})
  }, [isLoggedIn])

  // 一覧に戻ってきたら前のスクロール位置へ
  useEffect(() => {
    if (view === 'list' && cache.scrollY) {
      requestAnimationFrame(() => window.scrollTo(0, cache.scrollY))
    }
  }, [])

  const search = useCallback(() => {
    setView('list')
    setStatus('loading')
    setError(null)
    window.scrollTo(0, 0)

    getCurrentPosition()
      .catch(err => { throw { kind: err.code === 1 ? 'denied' : 'position' } })
      .then(({ lat, lng }) => fetchNearbyStores(lat, lng).catch(() => { throw { kind: 'network' } }))
      .then(data => {
        cache.stores = data
        cache.scrollY = 0
        setStores(data)
        setStatus('ready')
      })
      .catch(err => {
        setError(GEO_ERRORS[err.kind] || GEO_ERRORS.network)
        setStatus('error')
      })
  }, [])

  const handleAuth = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setFavoriteIds([])
    setToast('ログアウトしました')
  }

  return (
    <PageShell keepScroll>
      <AnimatePresence mode="wait">
        {view === 'hero' ? (
          <motion.div key="hero" variants={fade} initial="initial" animate="animate" exit="exit">
            <Hero isLoggedIn={isLoggedIn} onStart={search} onLogin={() => navigate('/login')} />
          </motion.div>
        ) : (
          <motion.div key="list" variants={fade} initial="initial" animate="animate">
            <StoreList
              status={status}
              stores={stores}
              error={error}
              favoriteIds={favoriteIds}
              isLoggedIn={isLoggedIn}
              onRetry={search}
              onAuth={handleAuth}
              onOpenStore={() => { cache.scrollY = window.scrollY }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Toast message={toast} onDone={() => setToast(null)} />
    </PageShell>
  )
}

export default LandingPage
