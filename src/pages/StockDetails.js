// StockDetails.js
// The detailed page for one stock. It shows:
//   - The live price and today's change
//   - A candlestick chart with different timeframes
//   - Key statistics (open, high, low, volume, 52W high/low, etc.)
//   - A buy/sell trading panel
//   - An investment calculator
//   - A company description

import { createElement as h, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useTrade } from '../context/TradeContext.js'
import { useAuth } from '../context/AuthContext.js'
import { formatINR, formatVolume } from '../utils/helpers.js'
import CandlestickChart from '../components/CandlestickChart.js'
import ChangePill from '../components/ChangePill.js'
import PageTransition from '../components/PageTransition.js'

const TIMEFRAMES = ['1m', '5m', '15m', '1H', '1D']

export default function StockDetails() {
  // Get the ticker from the URL (e.g. /stock/RELIANCE -> ticker = "RELIANCE")
  const { ticker } = useParams()
  const navigate = useNavigate()
  const { getStock } = useTrade()
  const { user, buyStock, sellStock, toggleWatch } = useAuth()
  const stock = getStock(ticker)

  // Local state for the chart and trading panel
  const [tf, setTf] = useState('1D')        // selected timeframe
  const [tab, setTab] = useState('BUY')     // BUY or SELL tab
  const [qty, setQty] = useState(1)         // quantity to trade

  // If the stock doesn't exist, show a "not found" message
  if (!stock) {
    return h(
      PageTransition,
      null,
      h(
        'div',
        { className: 'page tv-container' },
        h(
          'div',
          { className: 'empty-state' },
          h('i', { className: 'bi bi-exclamation-circle' }),
          h('h4', null, 'Stock not found'),
          h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Back to Markets')
        )
      )
    )
  }

  // How many shares does the user currently own?
  const owned = (user.portfolio && user.portfolio[ticker]) ? user.portfolio[ticker].qty : 0
  // Total cost/proceeds for this order
  const orderTotal = +(stock.price * qty).toFixed(2)
  // Is this stock in the watchlist?
  const inWatch = user.watchlist.includes(ticker)

  // Handle the Buy or Sell button click
  function handleTrade() {
    if (!user) { navigate('/login'); return }
    const res = tab === 'BUY'
      ? buyStock(ticker, qty, stock.price)
      : sellStock(ticker, qty, stock.price)

    if (!res.ok) { toast.error(res.error); return }

    toast.success(`${tab} order: ${qty} ${ticker} @ ${formatINR(stock.price)}`)
    setQty(1)
  }

  // Add or remove from watchlist
  function handleWatch() {
    const res = toggleWatch(ticker)
    if (!res.ok) return
    toast.success(res.added ? 'Added to watchlist' : 'Removed from watchlist')
  }

  return h(
    PageTransition,
    null,
    h(
      'div',
      { className: 'page tv-container' },
      /* Back link */
      h(
        'div',
        { style: { marginBottom: 16 } },
        h(
          Link,
          { to: '/markets', style: { color: 'var(--tv-muted)', fontSize: '.9rem' } },
          h('i', { className: 'bi bi-arrow-left' }),
          ' Back to Markets'
        )
      ),
      h(
        'div',
        { className: 'sd-grid' },
        /* ===== LEFT: chart + stats + description ===== */
        h(
          'div',
          null,
          h(
            'div',
            { className: 'tv-card tv-card-pad' },
            /* Header: ticker, name, price, change */
            h(
              'div',
              { className: 'sd-head' },
              h(
                'div',
                null,
                h('div', { className: 'sd-ticker' }, stock.ticker),
                h('div', { className: 'sd-name' }, stock.name)
              ),
              h(
                'div',
                { style: { textAlign: 'right' } },
                h('div', { className: 'sd-price' }, formatINR(stock.price)),
                h(
                  'div',
                  { style: { marginTop: 4 } },
                  h(ChangePill, { value: stock.changePct }),
                  ' ',
                  h(
                    'span',
                    { className: 'text-muted', style: { fontSize: '.85rem' } },
                    stock.change >= 0 ? '+' : '',
                    formatINR(stock.change, { decimals: 2 })
                  )
                )
              )
            ),
            /* Timeframe buttons + watchlist button */
            h(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 10 } },
              h(
                'div',
                { className: 'sd-tf-row' },
                TIMEFRAMES.map(t =>
                  h('button', { key: t, className: `sd-tf ${tf === t ? 'active' : ''}`, onClick: () => setTf(t) }, t)
                )
              ),
              h(
                'button',
                { className: 'tv-btn tv-btn-ghost', onClick: handleWatch, style: { padding: '6px 14px', fontSize: '.85rem' } },
                h('i', {
                  className: `bi ${inWatch ? 'bi-star-fill' : 'bi-star'}`,
                  style: { color: inWatch ? 'var(--tv-amber)' : 'var(--tv-muted)' }
                }),
                inWatch ? 'In Watchlist' : 'Add to Watchlist'
              )
            ),
            /* The candlestick chart */
            h(
              'div',
              { className: 'sd-chart-wrap', style: { marginTop: 16 } },
              h(CandlestickChart, { ticker: ticker, price: stock.price, timeframe: tf, height: 380 })
            )
          ),
          /* Company description */
          h(
            'div',
            { className: 'tv-card tv-card-pad', style: { marginTop: 18 } },
            h('div', { className: 'tv-card-title' }, 'Company Description'),
            h('p', { style: { marginTop: 12, color: 'var(--tv-text-2)', lineHeight: 1.7 } }, stock.description)
          )
        ),
        /* ===== RIGHT: stats + trade panel + calculator ===== */
        h(
          'div',
          null,
          /* Key statistics */
          h(
            'div',
            { className: 'tv-card tv-card-pad' },
            h('div', { className: 'tv-card-title' }, 'Key Statistics'),
            h(
              'div',
              { className: 'sd-stats-grid' },
              h(Stat, { k: 'Open', v: formatINR(stock.open) }),
              h(Stat, { k: 'Prev Close', v: formatINR(stock.prevClose) }),
              h(Stat, { k: 'Day High', v: formatINR(Math.max(stock.price, stock.open)) }),
              h(Stat, { k: 'Day Low', v: formatINR(Math.min(stock.price, stock.open)) }),
              h(Stat, { k: 'Volume', v: formatVolume(stock.volume) }),
              h(Stat, { k: 'Sector', v: stock.sector }),
              h(Stat, { k: '52W High', v: formatINR(stock.high52, { decimals: 0 }) }),
              h(Stat, { k: '52W Low', v: formatINR(stock.low52, { decimals: 0 }) })
            ),
            h(
              'div',
              { style: { marginTop: 14 } },
              h(Stat, { k: 'Market Cap', v: formatINR(stock.marketCap, { compact: true }) })
            )
          ),
          /* Trade panel (Buy/Sell) */
          h(
            'div',
            { className: 'tv-card trade-panel', style: { marginTop: 18 } },
            /* Buy / Sell tabs */
            h(
              'div',
              { className: 'trade-tabs' },
              h('div', { className: `trade-tab buy ${tab === 'BUY' ? 'active' : ''}`, onClick: () => setTab('BUY') }, 'BUY'),
              h('div', { className: `trade-tab sell ${tab === 'SELL' ? 'active' : ''}`, onClick: () => setTab('SELL') }, 'SELL')
            ),
            /* Quantity input with + and - buttons */
            h(
              'div',
              { className: 'trade-field' },
              h('label', null, 'Quantity'),
              h(
                'div',
                { style: { display: 'flex', gap: 8 } },
                h('button', { className: 'tv-btn tv-btn-ghost', onClick: () => setQty(q => Math.max(1, q - 1)), style: { width: 44 } }, '-'),
                h('input', {
                  type: 'number',
                  min: '1',
                  value: qty,
                  onChange: e => setQty(Math.max(1, parseInt(e.target.value) || 1))
                }),
                h('button', { className: 'tv-btn tv-btn-ghost', onClick: () => setQty(q => q + 1), style: { width: 44 } }, '+')
              )
            ),
            /* Quick quantity buttons */
            h(
              'div',
              { className: 'trade-field' },
              h('label', null, 'Quick quantity'),
              h(
                'div',
                { style: { display: 'flex', gap: 6 } },
                [10, 25, 50, 100].map(n =>
                  h('button', { key: n, className: 'tv-btn tv-btn-ghost', style: { flex: 1, padding: '6px 0' }, onClick: () => setQty(n) }, n)
                )
              )
            ),
            /* Order summary */
            h(
              'div',
              { className: 'trade-summary' },
              h('div', { className: 'ts-row' }, h('span', null, 'Price'), h('span', { className: 'v' }, formatINR(stock.price))),
              h('div', { className: 'ts-row' }, h('span', null, 'Quantity'), h('span', { className: 'v' }, qty)),
              h(
                'div',
                { className: 'ts-row', style: { borderTop: '1px dashed var(--tv-border)', marginTop: 6, paddingTop: 10 } },
                h('span', null, tab === 'BUY' ? 'Total Cost' : 'Total Proceeds'),
                h('span', { className: 'v' }, formatINR(orderTotal))
              )
            ),
            /* Show how many shares owned (for sell) or wallet (for buy) */
            tab === 'SELL' &&
              h(
                'div',
                { style: { fontSize: '.82rem', color: 'var(--tv-muted)', marginBottom: 12 } },
                'You own ',
                h('b', null, owned),
                ` shares of ${ticker}.`
              ),
            tab === 'BUY' &&
              h(
                'div',
                { style: { fontSize: '.82rem', color: 'var(--tv-muted)', marginBottom: 12 } },
                'Wallet: ',
                h('b', null, formatINR(user.wallet))
              ),
            /* The big Buy/Sell button */
            h(
              motion.button,
              {
                className: `tv-btn tv-btn-block ${tab === 'BUY' ? 'tv-btn-green' : 'tv-btn-red'}`,
                onClick: handleTrade,
                whileTap: { scale: 0.97 }
              },
              h('i', { className: `bi ${tab === 'BUY' ? 'bi-bag-plus' : 'bi-bag-dash'}` }),
              `${tab === 'BUY' ? 'Buy' : 'Sell'} ${qty} ${ticker}`
            )
          ),
          /* Investment calculator */
          h(
            'div',
            { className: 'tv-card tv-card-pad', style: { marginTop: 18 } },
            h('div', { className: 'tv-card-title' }, 'Investment Calculator'),
            h(InvestCalc, { price: stock.price })
          )
        )
      )
    )
  )
}

// Small helper component for a stat box
function Stat({ k, v }) {
  return h(
    'div',
    { className: 'sd-stat' },
    h('div', { className: 'k' }, k),
    h('div', { className: 'v' }, v)
  )
}

// Investment calculator: enter an amount, see how many shares you'd get
function InvestCalc({ price }) {
  const [amount, setAmount] = useState(10000)
  const shares = Math.floor(amount / price)

  return h(
    'div',
    { style: { marginTop: 14 } },
    h(
      'div',
      { className: 'trade-field' },
      h('label', null, 'Investment amount (₹)'),
      h('input', {
        type: 'number',
        min: '100',
        value: amount,
        onChange: e => setAmount(Math.max(0, parseInt(e.target.value) || 0))
      })
    ),
    h(
      'div',
      { className: 'trade-summary' },
      h('div', { className: 'ts-row' }, h('span', null, 'Current Price'), h('span', { className: 'v' }, formatINR(price))),
      h('div', { className: 'ts-row' }, h('span', null, 'Estimated Shares'), h('span', { className: 'v' }, shares)),
      h('div', { className: 'ts-row' }, h('span', null, 'Remaining'), h('span', { className: 'v' }, formatINR(amount - shares * price)))
    )
  )
}
