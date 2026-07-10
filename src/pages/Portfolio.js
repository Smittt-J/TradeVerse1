// Portfolio.js
// Shows all the stocks you own in a table, plus summary cards
// (total investment, current value, overall profit, today's profit).

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { useTrade } from '../context/TradeContext.js'
import { calcPortfolio } from '../utils/portfolioCalc.js'
import { formatINR, formatPct } from '../utils/helpers.js'
import StatCard from '../components/StatCard.js'
import ChangePill from '../components/ChangePill.js'
import PageTransition from '../components/PageTransition.js'

export default function Portfolio() {
  const { user } = useAuth()
  const { getStock } = useTrade()
  const pf = calcPortfolio(user, getStock)

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
          h('h1', null, 'Portfolio'),
          h('div', { className: 'sub' }, 'Your holdings and performance at a glance.')
        ),
        h(
          Link,
          { to: '/markets', className: 'tv-btn tv-btn-primary' },
          h('i', { className: 'bi bi-bag-plus' }),
          ' Buy Stocks'
        )
      ),

      /* Summary cards */
      h(
        'div',
        { className: 'portfolio-summary' },
        h(StatCard, { icon: 'bi-cash-coin', label: 'Total Investment', value: formatINR(pf.totalInvestment), accent: 'blue', delay: 0 }),
        h(StatCard, { icon: 'bi-bag-check', label: 'Current Value', value: formatINR(pf.currentValue), accent: 'purple', delay: 0.05 }),
        h(StatCard, {
          icon: 'bi-graph-up-arrow',
          label: 'Overall Profit',
          value: h('span', { className: pf.overallPL >= 0 ? 'positive' : 'negative' }, formatINR(pf.overallPL)),
          accent: pf.overallPL >= 0 ? 'green' : 'red',
          delay: 0.1,
          sub: h(ChangePill, { value: pf.overallPLPct })
        }),
        h(StatCard, {
          icon: 'bi-clock-history',
          label: "Today's Profit",
          value: h('span', { className: pf.todayPL >= 0 ? 'positive' : 'negative' }, formatINR(pf.todayPL)),
          accent: pf.todayPL >= 0 ? 'green' : 'red',
          delay: 0.15
        })
      ),

      /* Holdings table */
      h(
        'div',
        { className: 'tv-card tv-card-pad' },
        h(
          'div',
          { className: 'tv-card-title', style: { marginBottom: 16 } },
          'Your Holdings (' + pf.count + ')'
        ),

        pf.count
          ? h(
              'div',
              { className: 'portfolio-table-wrap' },
              h(
                'table',
                { className: 'tv-table' },
                h(
                  'thead',
                  null,
                  h(
                    'tr',
                    null,
                    h('th', null, 'Company'),
                    h('th', null, 'Ticker'),
                    h('th', null, 'Qty'),
                    h('th', null, 'Avg Buy'),
                    h('th', null, 'Current'),
                    h('th', null, 'Investment'),
                    h('th', null, 'Current Value'),
                    h('th', null, 'P/L'),
                    h('th')
                  )
                ),
                h(
                  'tbody',
                  null,
                  pf.holdings.map((h2, i) =>
                    h(
                      motion.tr,
                      {
                        key: h2.ticker,
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.25, delay: i * 0.03 }
                      },
                      h('td', null, h2.name),
                      h(
                        'td',
                        null,
                        h(Link, { to: '/stock/' + h2.ticker, className: 'tk', style: { color: 'var(--tv-blue)' } }, h2.ticker)
                      ),
                      h('td', null, h2.qty),
                      h('td', null, formatINR(h2.avgPrice)),
                      h('td', null, formatINR(h2.currentPrice)),
                      h('td', null, formatINR(h2.investment)),
                      h('td', null, formatINR(h2.currentValue)),
                      h(
                        'td',
                        null,
                        /* Profit in green, loss in red */
                        h(
                          'div',
                          { className: h2.pl >= 0 ? 'positive' : 'negative', style: { fontWeight: 700 } },
                          (h2.pl >= 0 ? '+' : '') + formatINR(h2.pl)
                        ),
                        h(
                          'div',
                          { className: h2.pl >= 0 ? 'positive' : 'negative', style: { fontSize: '.78rem' } },
                          formatPct(h2.plPct)
                        )
                      ),
                      h(
                        'td',
                        null,
                        h(
                          Link,
                          {
                            to: '/stock/' + h2.ticker,
                            className: 'tv-btn tv-btn-ghost',
                            style: { padding: '6px 12px', fontSize: '.82rem' }
                          },
                          'Trade'
                        )
                      )
                    )
                  )
                )
              )
            )
          : h(
              'div',
              { className: 'empty-state' },
              h('i', { className: 'bi bi-bag' }),
              h('h4', null, 'Your portfolio is empty'),
              h('p', null, 'Buy your first stock to start building your portfolio.'),
              h(Link, { to: '/markets', className: 'tv-btn tv-btn-primary' }, 'Explore Markets')
            )
      )
    )
  )
}
