// Dashboard.js
// The main page after you log in. It shows:
//   - Stat cards (wallet, portfolio value, P/L, etc.)
//   - Market index ticker
//   - Charts (portfolio growth, allocation pie, P/L trend)
//   - Top gainers and losers
//   - Watchlist preview
//   - Recent transactions

import { useState, createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext.js'
import { useTrade } from '../context/TradeContext.js'
import { calcPortfolio } from '../utils/portfolioCalc.js'
import { formatINR, formatDate } from '../utils/helpers.js'
import StatCard from '../components/StatCard.js'
import IndexTicker from '../components/IndexTicker.js'
import ChangePill from '../components/ChangePill.js'
import PageTransition from '../components/PageTransition.js'

// Colors for the pie chart slices
const PIE_COLORS = ['#2563eb', '#0ea5e9', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#475569', '#22c55e', '#f97316', '#06b6d4']

// Style for chart tooltips
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #e6eaf2',
  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
  fontSize: '.85rem',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { allStocks, getStock, tick } = useTrade()
  const [query, setQuery] = useState('')

  // Calculate portfolio numbers using our helper function
  const pf = calcPortfolio(user, getStock)
  const stocks = allStocks()

  // Net worth = wallet + portfolio value
  const netWorth = user.wallet + pf.currentValue
  // Total P/L = portfolio P/L + (wallet - starting cash)
  const totalPL = pf.overallPL + (user.wallet - 1000000)

  // Top gainers = 4 stocks with highest changePct
  // Top losers = 4 stocks with lowest changePct
  const sorted = [...stocks].sort((a, b) => b.changePct - a.changePct)
  const gainers = sorted.slice(0, 4)
  const losers = sorted.slice(-4).reverse()

  // Pie chart data: each holding's current value
  const pieData = pf.holdings.map(item => ({
    name: item.ticker,
    value: +item.currentValue.toFixed(2),
  }))

  // Growth chart data: a simple upward line ending at current value
  const growthData = []
  const base = pf.totalInvestment || 100000
  for (let i = 0; i < 12; i++) {
    const progress = i / 11
    const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.02
    const val = base + (pf.currentValue - base) * progress + base * noise * (1 - progress)
    growthData.push({ name: 'W' + (i + 1), value: +val.toFixed(2) })
  }
  growthData[growthData.length - 1].value = +pf.currentValue.toFixed(2)

  // P/L trend: cumulative money from recent transactions
  const plTrend = []
  const txs = [...user.transactions].reverse().slice(0, 10)
  let cum = 0
  txs.forEach((t, i) => {
    const sign = t.type === 'BUY' ? -1 : 1
    cum += sign * t.total
    plTrend.push({ name: 'T' + (i + 1), value: +cum.toFixed(2) })
  })
  plTrend.reverse()

  // Filter transactions by search
  const filteredTx = user.transactions.filter(t =>
    t.ticker.toLowerCase().includes(query.toLowerCase()) ||
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  return h(
    PageTransition,
    null,
    h('div', { className: 'page tv-container' },
      // Page heading
      h('div', { className: 'page-head' },
        h('div', null,
          h('h1', null, 'Welcome back, ', user.username),
          h('div', { className: 'sub' }, "Here's your market snapshot for today.")
        ),
        h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' },
          h('i', { className: 'bi bi-graph-up' }),
          ' Trade Now'
        )
      ),

      h(IndexTicker),

      // Row 1 of stat cards
      h('div', { className: 'dash-grid' },
        h(StatCard, { icon: 'bi-wallet2', label: 'Wallet Balance', value: formatINR(user.wallet), accent: 'blue', delay: 0 }),
        h(StatCard, { icon: 'bi-bag-check', label: 'Portfolio Value', value: formatINR(pf.currentValue), accent: 'purple', delay: 0.05,
          sub: h(ChangePill, { value: pf.overallPLPct }) }),
        h(StatCard, { icon: 'bi-graph-up-arrow', label: "Today's P/L",
          value: h('span', { className: pf.todayPL >= 0 ? 'positive' : 'negative' }, formatINR(pf.todayPL)),
          accent: pf.todayPL >= 0 ? 'green' : 'red', delay: 0.1 }),
        h(StatCard, { icon: 'bi-cash-stack', label: 'Overall P/L',
          value: h('span', { className: totalPL >= 0 ? 'positive' : 'negative' }, formatINR(totalPL)),
          accent: totalPL >= 0 ? 'green' : 'red', delay: 0.15 })
      ),

      // Row 2 of stat cards
      h('div', { className: 'dash-grid', style: { marginTop: 18 } },
        h(StatCard, { icon: 'bi-bag', label: 'Total Holdings', value: `${pf.count}`, accent: 'amber', delay: 0,
          sub: h('span', { className: 'text-muted' }, pf.count, ' stocks in portfolio') }),
        h(StatCard, { icon: 'bi-currency-rupee', label: 'Net Worth', value: formatINR(netWorth), accent: 'blue', delay: 0.05 }),
        h(StatCard, { icon: 'bi-arrow-down-up', label: 'Investment', value: formatINR(pf.totalInvestment), accent: 'slate', delay: 0.1 }),
        h(StatCard, { icon: 'bi-eye', label: 'Watchlist', value: `${user.watchlist.length}`, accent: 'green', delay: 0.15,
          sub: h(Link, { to: '/watchlist', style: { fontSize: '.82rem' } }, 'View watchlist →') })
      ),

      // Charts: growth + allocation
      h('div', { className: 'dash-grid-2' },
        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { className: 'tv-card-title' }, 'Portfolio Growth'),
          h('div', { style: { height: 280, marginTop: 16 } },
            h(ResponsiveContainer, { width: '100%', height: '100%' },
              h(AreaChart, { data: growthData },
                h('defs', null,
                  h('linearGradient', { id: 'pg', x1: '0', y1: '0', x2: '0', y2: '1' },
                    h('stop', { offset: '0%', stopColor: '#2563eb', stopOpacity: 0.35 }),
                    h('stop', { offset: '100%', stopColor: '#2563eb', stopOpacity: 0 })
                  )
                ),
                h(CartesianGrid, { strokeDasharray: '3 3', stroke: '#eef1f6' }),
                h(XAxis, { dataKey: 'name', tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false }),
                h(YAxis, { tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false,
                  tickFormatter: (v) => '₹' + (v / 100000).toFixed(1) + 'L' }),
                h(Tooltip, { formatter: (v) => formatINR(v), contentStyle: TOOLTIP_STYLE }),
                h(Area, { type: 'monotone', dataKey: 'value', stroke: '#2563eb', strokeWidth: 2.5, fill: 'url(#pg)' })
              )
            )
          )
        ),

        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { className: 'tv-card-title' }, 'Portfolio Allocation'),
          h('div', { style: { height: 280, marginTop: 16 } },
            pieData.length
              ? h(ResponsiveContainer, { width: '100%', height: '100%' },
                  h(PieChart, null,
                    h(Pie, { data: pieData, dataKey: 'value', nameKey: 'name', cx: '50%', cy: '50%',
                      innerRadius: 55, outerRadius: 95, paddingAngle: 2 },
                      pieData.map((_, i) => h(Cell, { key: i, fill: PIE_COLORS[i % PIE_COLORS.length] }))
                    ),
                    h(Tooltip, { formatter: (v) => formatINR(v), contentStyle: TOOLTIP_STYLE }),
                    h(Legend, { wrapperStyle: { fontSize: '.78rem' } })
                  )
                )
              : h('div', { className: 'empty-state', style: { padding: 40 } },
                  h('i', { className: 'bi bi-pie-chart' }),
                  h('p', null, 'Buy stocks to see your allocation.'),
                  h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Explore Markets')
                )
          )
        )
      ),

      // P/L trend + top gainers
      h('div', { className: 'dash-grid-2' },
        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { className: 'tv-card-title' }, 'P/L Trend (recent trades)'),
          h('div', { style: { height: 240, marginTop: 16 } },
            plTrend.length
              ? h(ResponsiveContainer, { width: '100%', height: '100%' },
                  h(LineChart, { data: plTrend },
                    h(CartesianGrid, { strokeDasharray: '3 3', stroke: '#eef1f6' }),
                    h(XAxis, { dataKey: 'name', tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false }),
                    h(YAxis, { tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false,
                      tickFormatter: (v) => '₹' + (Math.abs(v) / 1000).toFixed(0) + 'K' }),
                    h(Tooltip, { formatter: (v) => formatINR(v), contentStyle: TOOLTIP_STYLE }),
                    h(Line, { type: 'monotone', dataKey: 'value', stroke: '#0ea5e9', strokeWidth: 2.5, dot: { r: 3 } })
                  )
                )
              : h('div', { className: 'empty-state', style: { padding: 30 } },
                  h('p', null, 'No trades yet. Start trading to see your P/L trend.')
                )
          )
        ),

        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { className: 'tv-card-title' }, 'Top Gainers'),
          gainers.map(s =>
            h(Link, { to: `/stock/${s.ticker}`, key: s.ticker, className: 'mini-row', style: { textDecoration: 'none' } },
              h('div', { className: 'mr-left' },
                h('div', null,
                  h('div', { className: 'mr-ticker' }, s.ticker),
                  h('div', { className: 'mr-name' }, s.name)
                )
              ),
              h('div', { style: { textAlign: 'right' } },
                h('div', { style: { fontWeight: 700 } }, formatINR(s.price)),
                h(ChangePill, { value: s.changePct })
              )
            )
          )
        )
      ),

      // Top losers + watchlist preview
      h('div', { className: 'dash-grid-2', style: { marginBottom: 18 } },
        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { className: 'tv-card-title' }, 'Top Losers'),
          losers.map(s =>
            h(Link, { to: `/stock/${s.ticker}`, key: s.ticker, className: 'mini-row', style: { textDecoration: 'none' } },
              h('div', { className: 'mr-left' },
                h('div', null,
                  h('div', { className: 'mr-ticker' }, s.ticker),
                  h('div', { className: 'mr-name' }, s.name)
                )
              ),
              h('div', { style: { textAlign: 'right' } },
                h('div', { style: { fontWeight: 700 } }, formatINR(s.price)),
                h(ChangePill, { value: s.changePct })
              )
            )
          )
        ),

        h('div', { className: 'tv-card tv-card-pad' },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            h('div', { className: 'tv-card-title' }, 'Watchlist Preview'),
            h(Link, { to: '/watchlist', style: { fontSize: '.82rem', color: 'var(--tv-blue)' } }, 'View all →')
          ),
          user.watchlist.length
            ? user.watchlist.slice(0, 4).map(t => {
                const s = stocks.find(x => x.ticker === t)
                if (!s) return null
                return h(Link, { to: `/stock/${s.ticker}`, key: s.ticker, className: 'mini-row', style: { textDecoration: 'none' } },
                  h('div', { className: 'mr-left' },
                    h('div', null,
                      h('div', { className: 'mr-ticker' }, s.ticker),
                      h('div', { className: 'mr-name' }, s.name)
                    )
                  ),
                  h('div', { style: { textAlign: 'right' } },
                    h('div', { style: { fontWeight: 700 } }, formatINR(s.price)),
                    h(ChangePill, { value: s.changePct })
                  )
                )
              })
            : h('div', { className: 'empty-state', style: { padding: 30 } },
                h('p', null, 'Your watchlist is empty.'),
                h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Add Stocks')
              )
        )
      ),

      // Recent transactions
      h('div', { className: 'tv-card tv-card-pad' },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 } },
          h('div', { className: 'tv-card-title', style: { margin: 0 } }, 'Recent Transactions'),
          h('div', { className: 'tv-search' },
            h('i', { className: 'bi bi-search tv-search-icon' }),
            h('input', { className: 'form-control', placeholder: 'Search transactions...',
              value: query, onChange: e => setQuery(e.target.value) })
          )
        ),

        filteredTx.length
          ? h('div', { className: 'portfolio-table-wrap' },
              h('table', { className: 'tv-table' },
                h('thead', null,
                  h('tr', null,
                    h('th', null, 'Type'), h('th', null, 'Stock'), h('th', null, 'Qty'), h('th', null, 'Price'), h('th', null, 'Total'), h('th', null, 'Date')
                  )
                ),
                h('tbody', null,
                  filteredTx.slice(0, 10).map(t =>
                    h('tr', { key: t.id },
                      h('td', null,
                        h('span', { className: `tv-pill ${t.type === 'BUY' ? 'tv-pill-up' : 'tv-pill-down'}` }, t.type)
                      ),
                      h('td', null, h('span', { className: 'tk' }, t.ticker), h('div', { className: 'mr-name' }, t.name)),
                      h('td', null, t.qty),
                      h('td', null, formatINR(t.price)),
                      h('td', null, formatINR(t.total)),
                      h('td', null, formatDate(t.time))
                    )
                  )
                )
              )
            )
          : h('div', { className: 'empty-state', style: { padding: 40 } },
              h('i', { className: 'bi bi-receipt' }),
              h('h4', null, 'No transactions yet'),
              h('p', null, 'Start trading to build your transaction history.'),
              h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Start Trading')
            )
      )
    )
  )
}
