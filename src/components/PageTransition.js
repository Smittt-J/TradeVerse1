// PageTransition.js
// Wraps a page so it fades and slides in when it appears,
// and fades out when you navigate away.

import { createElement as h } from 'react'
import { motion } from 'framer-motion'

export default function PageTransition({ children }) {
  return h(motion.div, {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: 'easeOut' },
  }, children)
}
