import { Link } from 'react-router-dom'

function IndexPage() {
  return (
    <div className="container">
      <h1>ノミトク</h1>

      <div className="buttons">
        <Link to="/login" className="button12">ログイン</Link>
        <Link to="/signup" className="button12">新規会員登録</Link>
      </div>
    </div>
  )
}

export default IndexPage
