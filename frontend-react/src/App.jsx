import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { DirectionCtx } from './context/DirectionCtx'
import LandingPage from './pages/LandingPage'
import IndexPage from './pages/IndexPage'
import SignupPage from './pages/SignupPage'
import ShopDetailPage from './pages/ShopDetailPage'

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
          <Route path="/shop/:storeId" element={<ShopDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </DirectionCtx.Provider>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
