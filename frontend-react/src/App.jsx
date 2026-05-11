import { BrowserRouter, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import NearbyPage from './pages/NearbyPage'
import ShopDetailPage from './pages/ShopDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/shop/:storeId" element={<ShopDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
