// StatCard.js
// A reusable card that shows a label, a big value, and an icon.
// Used on the Dashboard and Portfolio pages for things like
// "Wallet Balance", "Portfolio Value", etc.

import { createElement as h } from 'react'
import { motion } from 'framer-motion'

// Different background colors for the icon circle
const ICON_COLORS = {
  blue: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
  green: 'linear-gradient(135deg, #16a34a, #22c55e)',
  red: 'linear-gradient(135deg, #dc2626, #f87171)',
  amber: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  purple: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  slate: 'linear-gradient(135deg, #475569, #94a3b8)',
}

export default function StatCard({ icon, label, value, sub, accent, delay }) {
  const bg = ICON_COLORS[accent || 'blue']

  return h(motion.div, {
    className: 'tv-card hoverable tv-card-pad',
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: delay || 0 },
  },
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
      h('div', null,
        h('div', { className: 'tv-card-title' }, label),
        h('div', { className: 'tv-card-value' }, value),
        sub && h('div', { style: { marginTop: 8 } }, sub)
      ),
      // Icon circle
      h('div', {
        style: {
          width: '44px', height: '44px', borderRadius: '12px',
          display: 'grid', placeItems: 'center',
          background: bg, color: '#fff', fontSize: '1.2rem',
          boxShadow: '0 8px 18px rgba(15,23,42,0.12)'
        }
      },
        h('i', { className: 'bi ' + icon })
      )
    )
  )
}
