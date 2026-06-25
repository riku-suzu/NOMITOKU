export const pageVariants = {
  initial: (d) => ({ opacity: 0, x: 50 * d }),
  animate: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: -50 * d }),
}

export const pageTransition = { duration: 0.25 }

export const zoomFromBackVariants = {
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 1.04 },
}

export const zoomFromBackTransition = { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
