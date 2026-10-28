import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import AppBar from './AppBar'
import Icon from './Icon'
import StoreCard from './StoreCard'
import EmptyState from './EmptyState'
import HotpepperCredit from './HotpepperCredit'
import { StoreCardSkeleton } from './Skeleton'
import { useCoupons } from '../hooks/useCoupons'
import { stagger, fade, tap } from '../utils/motion'

const EMPTY = []

function StoreList({ status, stores, error, favoriteIds, isLoggedIn, onRetry, onAuth, onOpenStore }) {
  const [filter, setFilter] = useState('all')
  const coupons = useCoupons(status === 'ready' ? stores : EMPTY)

  const hpStores = stores.filter(s => s.source === 'hotpepper')
  const checked = hpStores.filter(s => coupons[s.store_id] !== undefined).length
  const withCoupon = stores.filter(s => coupons[s.store_id]?.length)
  const checking = status === 'ready' && checked < hpStores.length

  const visible = filter === 'coupon' ? withCoupon : stores
  const favorites = visible.filter(s => favoriteIds.includes(s.store_id))
  const others = visible.filter(s => !favoriteIds.includes(s.store_id))
  const farthest = stores.at(-1)?.distance

  const renderList = (list) => (
    <motion.ul className="store-list" variants={stagger(0.04)} initial="initial" animate="animate">
      <AnimatePresence>
        {list.map(store => (
          <StoreCard
            key={store.store_id}
            store={store}
            coupons={store.source === 'hotpepper' ? coupons[store.store_id] : EMPTY}
            isFavorite={favoriteIds.includes(store.store_id)}
            onOpen={onOpenStore}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  )

  return (
    <div className="list-page">
      <AppBar
        left={<span className="brand">ノミトク</span>}
        right={
          <button className="btn btn-ghost btn-sm" onClick={onAuth}>
            <Icon name={isLoggedIn ? 'logout' : 'user'} size={16} />
            {isLoggedIn ? 'ログアウト' : 'ログイン'}
          </button>
        }
      />

      <main className="container">
        <div className="list-head">
          <div>
            <h1 className="list-title">近くの居酒屋</h1>
            <p className="list-sub">
              {status === 'loading' && '現在地の周辺を探しています…'}
              {status === 'ready' && `${stores.length}軒${farthest ? `・${farthest}圏内` : ''}`}
              {status === 'error' && '取得できませんでした'}
            </p>
          </div>
          <motion.button
            className="icon-btn"
            whileTap={tap}
            onClick={onRetry}
            disabled={status === 'loading'}
            aria-label="現在地で探し直す"
          >
            <Icon name="refresh" size={18} className={status === 'loading' ? 'spin' : ''} />
          </motion.button>
        </div>

        {status === 'ready' && stores.length > 0 && (
          <FilterBar
            filter={filter}
            onChange={setFilter}
            counts={{ all: stores.length, coupon: withCoupon.length }}
            progress={checking ? { done: checked, total: hpStores.length } : null}
          />
        )}

        {status === 'loading' && (
          <ul className="store-list" aria-busy="true">
            {Array.from({ length: 5 }, (_, i) => <li key={i}><StoreCardSkeleton /></li>)}
          </ul>
        )}

        {status === 'error' && (
          <EmptyState
            icon={error.icon}
            title={error.title}
            action={<button className="btn btn-primary" onClick={onRetry}>もう一度試す</button>}
          >
            {error.body}
          </EmptyState>
        )}

        {status === 'ready' && stores.length === 0 && (
          <EmptyState icon="beer" title="近くに居酒屋が見つかりませんでした">
            場所を変えて、もう一度探してみてください。
          </EmptyState>
        )}

        {status === 'ready' && stores.length > 0 && (
          <LayoutGroup>
            {favorites.length > 0 && (
              <section className="list-section">
                <h2 className="section-label"><Icon name="heart" size={14} filled />お気に入り</h2>
                {renderList(favorites)}
              </section>
            )}

            <section className="list-section">
              {favorites.length > 0 && <h2 className="section-label">近くのお店</h2>}
              {renderList(others)}
              {filter === 'coupon' && withCoupon.length === 0 && (
                <EmptyState icon="ticket" title={checking ? 'クーポンを確認しています' : 'クーポンのあるお店がありません'}>
                  {checking ? '見つかり次第ここに表示されます。' : '「すべて」に戻すと、ほかのお店も見られます。'}
                </EmptyState>
              )}
            </section>

            <HotpepperCredit />
          </LayoutGroup>
        )}
      </main>
    </div>
  )
}

// 「すべて / クーポンあり」の切り替えと、クーポン確認の進み具合
function FilterBar({ filter, onChange, counts, progress }) {
  return (
    <div className="filter-bar">
      <div className="segmented" role="tablist" aria-label="表示するお店">
        <button role="tab" aria-selected={filter === 'all'} onClick={() => onChange('all')}>
          すべて<span className="count">{counts.all}</span>
        </button>
        <button role="tab" aria-selected={filter === 'coupon'} onClick={() => onChange('coupon')}>
          クーポンあり<span className="count">{counts.coupon}</span>
        </button>
      </div>
      <AnimatePresence>
        {progress && (
          <motion.p className="checking" variants={fade} initial="initial" animate="animate" exit="exit">
            クーポン確認中 {progress.done}/{progress.total}
            <span className="progress"><span style={{ width: `${(progress.done / progress.total) * 100}%` }} /></span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StoreList
