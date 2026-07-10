// Watchlist.js
// Shows the stocks you've added to your watchlist.
// You can remove stocks by clicking the trash icon.

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.js'
import { useTrade } from '../context/TradeContext.js'
import { formatINR } from '../utils/helpers.js'
import ChangePill from '../components/ChangePill.js'
import PageTransition from '../components/PageTransition.js'

export default function Watchlist() {
  const { user, toggleWatch } = useAuth()
  const { allStocks } = useTrade()
  const stocks = allStocks()

  // Find the full stock info for each ticker in the watchlist
  const items = user.watchlist
    .map(t => stocks.find(s => s.ticker === t))
    .filter(Boolean) // remove any that weren't found

  function remove(ticker) {
    toggleWatch(ticker)
    toast.success('Removed from watchlist')
  }

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
          h('h1', null, 'Watchlist'),
          h('div', { className: 'sub' }, items.length + " stocks you're tracking." )
        ),
        h(
          Link,
          { to: '/markets', className: 'tv-btn tv-btn-primary' },
          h('i', { className: 'bi bi-plus-lg' }),
          ' Add Stocks'
        )
      ),

      items.length
        ? h(
            'div',
            { className: 'wl-grid' },
            h(
              AnimatePresence,
              null,
              items.map((s, i) =>
                h(
                  motion.div,
                  {
                    key: s.ticker,
                    className: 'wl-item',
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.9 },
                    transition: { duration: 0.25, delay: i * 0.03 }
                  },
                  h(
                    Link,
                    { to: '/stock/' + s.ticker, className: 'wl-left', style: { textDecoration: 'none' } },
                    h('div', { className: 'tk' }, s.ticker),
                    h('div', { className: 'nm' }, s.name),
                    h(
                      'div',
                      { style: { marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 } },
                      h('span', { style: { fontWeight: 700 } }, formatINR(s.price)),
                      h(ChangePill, { value: s.changePct })
                    )
                  ),
                  h(
                    'button',
                    { className: 'wl-remove', onClick: () => remove(s.ticker), title: 'Remove' },
                    h('i', { className: 'bi bi-trash3' })
                  )
                )
              )
            )
          )
        : h(
            'div',
            { className: 'empty-state' },
            h('i', { className: 'bi bi-star' }),
            h('h4', null, 'Your watchlist is empty'),
            h('p', null, 'Track your favourite stocks by adding them to your watchlist.'),
            h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Browse Markets')
          )
    )
  )
}
