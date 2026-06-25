import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { DirectionCtx } from './context/DirectionCtx'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import IndexPage from './pages/IndexPage'
import SignupPage from './pages/SignupPage'
import NearbyPage from './pages/NearbyPage'
import ShopDetailPage from './pages/ShopDetailPage'

const BG_ITEMS = [
  { emoji: '🏮', top:  2, left:  5, size: 4.2, rot: -15 },
  { emoji: '🍺', top:  5, left: 72, size: 3.4, rot:  20 },
  { emoji: '🍶', top:  8, left: 38, size: 3.6, rot:  -8 },
  { emoji: '🥃', top: 11, left: 88, size: 3.2, rot:  25 },
  { emoji: '🍜', top: 14, left: 20, size: 3.5, rot: -10 },
  { emoji: '🍻', top: 17, left: 55, size: 3.8, rot: -18 },
  { emoji: '🏮', top: 20, left:  3, size: 4.0, rot:  12 },
  { emoji: '🍣', top: 23, left: 70, size: 3.3, rot:  -5 },
  { emoji: '🍺', top: 26, left: 42, size: 3.4, rot: -22 },
  { emoji: '🍶', top: 29, left: 85, size: 3.6, rot:  10 },
  { emoji: '🥟', top: 32, left: 15, size: 3.2, rot:  30 },
  { emoji: '🥃', top: 35, left: 60, size: 3.2, rot: -30 },
  { emoji: '🏮', top: 38, left: 30, size: 4.2, rot:  18 },
  { emoji: '🍻', top: 41, left: 78, size: 3.8, rot:  -5 },
  { emoji: '🍱', top: 44, left:  8, size: 3.3, rot:  15 },
  { emoji: '🍺', top: 47, left: 50, size: 3.4, rot:  28 },
  { emoji: '🍶', top: 50, left: 92, size: 3.6, rot: -12 },
  { emoji: '🥃', top: 53, left: 25, size: 3.2, rot:  15 },
  { emoji: '🍜', top: 56, left: 65, size: 3.5, rot: -20 },
  { emoji: '🏮', top: 59, left:  2, size: 4.0, rot:   8 },
  { emoji: '🍣', top: 62, left: 45, size: 3.3, rot: -15 },
  { emoji: '🍻', top: 65, left: 80, size: 3.8, rot:  22 },
  { emoji: '🥟', top: 68, left: 18, size: 3.2, rot:  -8 },
  { emoji: '🍺', top: 71, left: 58, size: 3.4, rot:  12 },
  { emoji: '🏮', top: 74, left: 35, size: 4.2, rot: -25 },
  { emoji: '🍶', top: 77, left: 88, size: 3.6, rot:   5 },
  { emoji: '🍱', top: 80, left: 10, size: 3.3, rot:  18 },
  { emoji: '🥃', top: 83, left: 68, size: 3.2, rot: -10 },
  { emoji: '🍻', top: 86, left: 30, size: 3.8, rot:  28 },
  { emoji: '🍺', top: 89, left: 52, size: 3.4, rot: -18 },
  { emoji: '🏮', top: 92, left: 82, size: 4.0, rot:  15 },
  { emoji: '🍣', top: 95, left:  7, size: 3.3, rot:  -5 },
]

function PhotoBg() {
  const location = useLocation()
  if (location.pathname !== '/' && !location.pathname.startsWith('/shop/')) return null
  return <div className="app-photo-bg" />
}

function BgDecoration() {
  const location = useLocation()
  if (location.pathname === '/' || location.pathname.startsWith('/shop/')) return null
  return (
    <div className="bg-deco" aria-hidden="true">
      {BG_ITEMS.map((item, i) => (
        <span
          key={i}
          className="bg-deco-item"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}em`,
            transform: `rotate(${item.rot}deg)`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const navType = useNavigationType()
  const [manualDir, setManualDir] = useState(1)

  const dir = navType === 'POP' ? -1 : manualDir

  return (
    <DirectionCtx.Provider value={{ dir, setDir: setManualDir }}>
      <AnimatePresence mode="wait" custom={dir} onExitComplete={() => setManualDir(1)}>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<IndexPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/nearby" element={<NearbyPage />} />
          <Route path="/shop/:storeId" element={<ShopDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </DirectionCtx.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PhotoBg />
      <BgDecoration />
      <Header />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
