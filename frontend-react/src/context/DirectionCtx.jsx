import { createContext, useContext } from 'react'

export const DirectionCtx = createContext({ dir: 1, setDir: () => {} })
export const useDir = () => useContext(DirectionCtx)
