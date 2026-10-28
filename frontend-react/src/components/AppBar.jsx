// 画面上部に固定されるバー（左・中央・右の3枠）
function AppBar({ left, title, right, transparent = false }) {
  return (
    <header className={`appbar${transparent ? ' appbar--transparent' : ''}`}>
      <div className="appbar-slot">{left}</div>
      {title && <div className="appbar-title">{title}</div>}
      <div className="appbar-slot appbar-slot--right">{right}</div>
    </header>
  )
}

export default AppBar
