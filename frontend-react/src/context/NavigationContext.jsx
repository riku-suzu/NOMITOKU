import { createContext, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const navigateRaw = useNavigate()
  const dirRef = useRef(1) // 1=前進, -1=後退

  // navigate('/home', { direction: -1 }) のように呼ぶ
  const navigate = (path, options = {}) => {
    dirRef.current = options.direction ?? 1
    navigateRaw(path, options)
  }

  return (
    <NavigationContext.Provider value={{ navigate, dirRef }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
