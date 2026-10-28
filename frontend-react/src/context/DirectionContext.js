import { createContext, useContext } from 'react'

// ページ遷移の向き（1 = 進む / -1 = 戻る）。戻るボタン以外で「戻る」向きにしたいときは setDir(-1) する
export const DirectionContext = createContext({ dir: 1, setDir: () => {} })
export const useDirection = () => useContext(DirectionContext)
