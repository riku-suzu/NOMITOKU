import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { DirectionCtx } from './context/DirectionCtx'
import Header from './components/Header'
import IndexPage from './pages/IndexPage'
import SignupPage from './pages/SignupPage'
import NearbyPage from './pages/NearbyPage'
import ShopDetailPage from './pages/ShopDetailPage'

const BG_ITEMS = [
  { emoji: '🏮', top:  3, left:  5, size: 4.2, rot: -15 },
  { emoji: '🍺', top:  8, left: 72, size: 3.4, rot:  20 },
  { emoji: '🍶', top: 14, left: 38, size: 3.6, rot:  -8 },
  { emoji: '🥃', top: 20, left: 88, size: 3.2, rot:  25 },
  { emoji: '🍻', top: 27, left: 15, size: 3.8, rot: -18 },
  { emoji: '🏮', top: 33, left: 58, size: 4.0, rot:  12 },
  { emoji: '🍺', top: 40, left:  3, size: 3.4, rot: -22 },
  { emoji: '🍶', top: 46, left: 80, size: 3.6, rot:  10 },
  { emoji: '🥃', top: 53, left: 45, size: 3.2, rot: -30 },
  { emoji: '🏮', top: 59, left: 22, size: 4.2, rot:  18 },
  { emoji: '🍻', top: 65, left: 68, size: 3.8, rot:  -5 },
  { emoji: '🍺', top: 71, left:  8, size: 3.4, rot:  28 },
  { emoji: '🍶', top: 77, left: 85, size: 3.6, rot: -12 },
  { emoji: '🥃', top: 83, left: 32, size: 3.2, rot:  15 },
  { emoji: '🏮', top: 89, left: 55, size: 4.0, rot: -20 },
  { emoji: '🍻', top: 95, left: 12, size: 3.8, rot:   8 },
]

function BgDecoration() {
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

function AnimatedRoutes({ dir, setDir }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" custom={dir} onExitComplete={() => setDir(1)}>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/shop/:storeId" element={<ShopDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [dir, setDir] = useState(1)

  return (
    <BrowserRouter>
      <DirectionCtx.Provider value={{ dir, setDir }}>
        <BgDecoration />
        <Header />
        <AnimatedRoutes dir={dir} setDir={setDir} />
      </DirectionCtx.Provider>
    </BrowserRouter>
  )
}

export default App
