// StockCard.js
// A card showing one stock's info (ticker, name, price, change, etc.)
// Used on the Markets page. Clicking it opens the Stock Details page.

import { createElement as h } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatINR, formatVolume } from '../utils/helpers.js'
import ChangePill from './ChangePill.js'

export default function StockCard({ stock, delay }) {
  const navigate = useNavigate()

  function go() { navigate('/stock/' + stock.ticker) }

  return h(motion.div, {
    className: 'stock-card',
    onClick: go,
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: delay || 0 },
    whileHover: { y: -4 },
  },
    // Top: ticker + name on the left, change pill on the right
    h('div', { className: 'sc-head' },
      h('div', null,
        h('div', { className: 'sc-ticker' }, stock.ticker),
        h('div', { className: 'sc-name' }, stock.name)
      ),
      h(ChangePill, { value: stock.changePct })
    ),
    h('span', { className: 'sc-sector' }, stock.sector),
    h('div', { className: 'sc-price' }, formatINR(stock.price)),
    // Bottom stats
    h('div', { className: 'sc-stats' },
      h('div', null, h('div', { className: 'k' }, 'Volume'), h('div', { className: 'v' }, formatVolume(stock.volume))),
      h('div', null, h('div', { className: 'k' }, 'Mkt Cap'), h('div', { className: 'v' }, formatINR(stock.marketCap, { compact: true }))),
      h('div', null, h('div', { className: 'k' }, '52W High'), h('div', { className: 'v' }, formatINR(stock.high52, { decimals: 0 }))),
      h('div', null, h('div', { className: 'k' }, '52W Low'), h('div', { className: 'v' }, formatINR(stock.low52, { decimals: 0 })))
    )
  )
}
