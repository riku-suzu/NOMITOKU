// 画面上部に固定されるバー（左・右の2枠）
function AppBar({ left, right }) {
  return (
    <header className="appbar">
      <div className="appbar-slot">{left}</div>
      <div className="appbar-slot appbar-slot--right">{right}</div>
    </header>
  )
}

export default AppBar
