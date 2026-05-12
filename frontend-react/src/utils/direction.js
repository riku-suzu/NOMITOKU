let direction = 'forward'

export const setDirection = (d) => { direction = d }

// 読み取ったら自動でforwardにリセットする
export const getDirection = () => {
  const d = direction
  direction = 'forward'
  return d
}
