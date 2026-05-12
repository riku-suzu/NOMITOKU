import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useDir } from '../context/DirectionCtx'

function Header() {
  const navigate = useNavigate()
  useLocation()
  const { setDir } = useDir()
  const token = localStorage.getItem('token')
  const nickname = localStorage.getItem('nickname') || ''

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
    setDir(-1)
    navigate('/')
  }

  return (
    <header className="app-header">
      <h1>ノミトク</h1>
      {token && (
        <div className="header-right">
          {nickname && <span className="header-nickname">{nickname}さん</span>}
          <button onClick={handleLogout} className="header-logout">ログアウト</button>
        </div>
      )}
    </header>
  )
}

export default Header
