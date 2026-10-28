// 読み込み中の仮表示
export function Skeleton({ width = '100%', height = 14, radius = 6, style }) {
  return <span className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
}

export function StoreCardSkeleton() {
  return (
    <div className="store-card store-card--skeleton" aria-hidden="true">
      <Skeleton width={84} height={84} radius={12} />
      <div className="store-card-body">
        <Skeleton width="70%" height={18} />
        <Skeleton width="50%" height={12} style={{ marginTop: 10 }} />
        <Skeleton width="85%" height={12} style={{ marginTop: 8 }} />
      </div>
    </div>
  )
}
