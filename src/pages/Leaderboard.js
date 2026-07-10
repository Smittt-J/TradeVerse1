// Leaderboard.js
// Shows a ranking of traders by their returns.
// The current user is included along with some mock traders.

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { useTrade } from '../context/TradeContext.js'
import { calcPortfolio } from '../utils/portfolioCalc.js'
import { initials } from '../utils/helpers.js'
import PageTransition from '../components/PageTransition.js'

// Some mock traders for the leaderboard
const SEED = [
  { name: 'Aarav Sharma', returns: 42.6, trades: 128 },
  { name: 'Priya Iyer', returns: 31.2, trades: 96 },
  { name: 'Rohan Mehta', returns: 24.8, trades: 72 },
  { name: 'Ananya Rao', returns: 18.4, trades: 54 },
  { name: 'Karan Singh', returns: 12.1, trades: 41 },
  { name: 'Neha Gupta', returns: 6.7, trades: 23 },
  { name: 'Vikram Pillai', returns: -4.2, trades: 18 },
  { name: 'Sara Khan', returns: -8.9, trades: 12 },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const { getStock } = useTrade()
  const pf = calcPortfolio(user, getStock)

  // Calculate the user's return percentage
  const netWorth = user.wallet + pf.currentValue
  const userReturn = ((netWorth - 1000000) / 1000000) * 100

  // Combine mock traders with the real user, then sort by returns (highest first)
  const rows = [
    ...SEED.map(s => ({ ...s, isYou: false })),
    { name: user.username + ' (You)', returns: +userReturn.toFixed(2), trades: user.transactions.length, isYou: true },
  ].sort((a, b) => b.returns - a.returns)

  return h(
    PageTransition,
    null,
    h(
      'div',
      { className: 'page tv-container' },
      h(
        'div',
        { className: 'page-head' },
        h(
          'div',
          null,
          h('h1', null, 'Leaderboard'),
          h('div', { className: 'sub' }, 'See how your returns compare with other paper traders.')
        )
      ),

      h(
        'div',
        { className: 'tv-card tv-card-pad', style: { maxWidth: 760, margin: '0 auto' } },
        rows.map((r, i) =>
          h(
            motion.div,
            {
              key: r.name + i,
              className: 'lb-row',
              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.3, delay: i * 0.04 },
              style: r.isYou ? { background: 'var(--tv-blue-50)', borderRadius: 12, border: '1px solid var(--tv-blue-100)' } : {}
            },
            /* Rank number (gold for 1st, silver for 2nd, bronze for 3rd) */
            h(
              'div',
              { className: 'rank ' + (i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '') },
              i + 1
            ),

            /* Avatar circle */
            h('div', {
              style: {
                width: 40, height: 40, borderRadius: '50%',
                background: r.isYou ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : 'linear-gradient(135deg,#64748b,#94a3b8)',
                color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '.85rem'
              }
            }, initials(r.name)),

            /* Name and trade count */
            h(
              'div',
              { style: { flex: 1 } },
              h('div', { className: 'lb-name', style: { color: r.isYou ? 'var(--tv-blue)' : 'inherit' } }, r.name),
              h('div', { className: 'lb-meta' }, r.trades + ' trades')
            ),

            /* Return percentage */
            h(
              'div',
              { style: { textAlign: 'right' } },
              h(
                'div',
                { style: { fontWeight: 700, color: r.returns >= 0 ? 'var(--tv-green)' : 'var(--tv-red)' } },
                (r.returns >= 0 ? '+' : '') + r.returns + '%'
              ),
              h('div', { className: 'lb-meta' }, 'returns')
            )
          )
        )
      ),

      h(
        'div',
        { style: { textAlign: 'center', marginTop: 24 } },
        h(
          Link,
          { to: '/markets', className: 'tv-btn tv-btn-primary' },
          h('i', { className: 'bi bi-graph-up' }),
          ' Trade to climb the ranks'
        )
      )
    )
  )
}
