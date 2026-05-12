export const pageVariants = {
  initial: (d) => ({ opacity: 0, x: 50 * d }),
  animate: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: -50 * d }),
}

export const pageTransition = { duration: 0.25 }
