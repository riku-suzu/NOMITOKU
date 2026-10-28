// ===== モーショントークン =====
export const ease = {
  out: [0.22, 1, 0.36, 1],     // 入場（素早く出て、ゆっくり止まる）
  in: [0.64, 0, 0.78, 0],      // 退場
}

const duration = {
  fast: 0.2,
  base: 0.35,
  slow: 0.7,
}

// ===== ページ遷移（dir: 1 = 進む / -1 = 戻る） =====
export const pageVariants = {
  initial: (d) => ({ opacity: 0, x: 24 * d }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: (d) => ({
    opacity: 0,
    x: -24 * d,
    transition: { duration: duration.fast, ease: ease.in },
  }),
}

// ===== 汎用 =====
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
}

// 子要素を順番に出すコンテナ
export const stagger = (step = 0.06, delay = 0) => ({
  initial: {},
  animate: { transition: { staggerChildren: step, delayChildren: delay } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
})

// 下からふわっと
export const rise = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.in } },
}

// ===== ランディング =====
// タイトルは字間が締まりながら現れる
export const heroTitle = {
  initial: { opacity: 0, letterSpacing: '0.3em', filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    letterSpacing: '0.04em',
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: ease.out },
  },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
}

// ===== ボタン =====
// 押したときに少し縮む
export const tap = { scale: 0.98 }
