// 飲み放題・食べ放題・個室のタグ
function StoreTags({ store, className = '' }) {
  const tags = [
    store.free_drink && '飲み放題',
    store.free_food && '食べ放題',
    store.private_room && '個室',
  ].filter(Boolean)
  if (!tags.length) return null
  return (
    <ul className={`tags ${className}`}>
      {tags.map(t => <li key={t} className="tag">{t}</li>)}
    </ul>
  )
}

export default StoreTags
