import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { DirectionContext } from './context/DirectionContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ShopDetailPage from './pages/ShopDetailPage'

function AnimatedRoutes() {
  const location = useLocation()
  const navType = useNavigationType()
  const [manualDir, setManualDir] = useState(1)

  const dir = navType === 'POP' ? -1 : manualDir

  return (
    <DirectionContext.Provider value={{ dir, setDir: setManualDir }}>
      <AnimatePresence mode="wait" custom={dir} onExitComplete={() => setManualDir(1)}>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/shop/:storeId" element={<ShopDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </DirectionContext.Provider>
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
