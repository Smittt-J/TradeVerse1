// Landing.js
// The home page of TradeVerse. It has:
//   - A hero section with a big headline and call-to-action buttons
//   - A stats band
//   - A features section
//   - A "how it works" section
//   - Testimonials
//   - A final call-to-action banner

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import PageTransition from '../components/PageTransition.js'

export default function Landing() {
  const { user } = useAuth()

  // If logged in, the button says "Go to Dashboard". If not, "Start Trading Free".
  const ctaTo = user ? '/dashboard' : '/register'
  const ctaLabel = user ? 'Go to Dashboard' : 'Start Trading Free'

  return h(
    PageTransition,
    null,
    /* ===== HERO SECTION ===== */
    h(
      'section',
      { className: 'landing-hero' },
      h(
        'div',
        { className: 'tv-container landing-hero-grid' },
        /* Left: text */
        h(
          motion.div,
          {
            initial: { opacity: 0, x: -24 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6 },
          },
          h(
            'h1',
            null,
            'Trade the markets. ',
            h('span', { className: 'grad' }, 'Risk nothing.'),
            h('br'),
            'Master everything.'
          ),
          h(
            'p',
            { className: 'lead' },
            'TradeVerse gives you ₹10,00,000 in virtual cash, live Indian stock prices, professional charts, and a full portfolio experience — so you can practise trading like the pros without risking a single rupee.'
          ),
          h(
            'div',
            { className: 'landing-hero-cta' },
            h(
              Link,
              { to: ctaTo, className: 'tv-btn tv-btn-primary' },
              ctaLabel,
              ' ',
              h('i', { className: 'bi bi-arrow-right' })
            ),
            h(
              Link,
              { to: '/markets', className: 'tv-btn tv-btn-ghost' },
              h('i', { className: 'bi bi-graph-up' }),
              ' Explore Markets'
            )
          ),

          /* Small stats under the buttons */
          h(
            'div',
            { className: 'landing-hero-stats' },
            h('div', null, h('div', { className: 'hs-num' }, '20+'), h('div', { className: 'hs-label' }, 'Indian Stocks')),
            h('div', null, h('div', { className: 'hs-num' }, '₹10L'), h('div', { className: 'hs-label' }, 'Virtual Capital')),
            h('div', null, h('div', { className: 'hs-num' }, 'Real-time'), h('div', { className: 'hs-label' }, 'Price Engine')),
            h('div', null, h('div', { className: 'hs-num' }, '100%'), h('div', { className: 'hs-label' }, 'Risk-free'))
          )
        ),

        /* Right: dark visual card with a mini chart */
        h(
          motion.div,
          {
            className: 'hero-visual',
            initial: { opacity: 0, x: 24 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6, delay: 0.1 },
          },
          h(
            'div',
            { className: 'hero-ticker-row' },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              h('span', { style: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' } }),
              'NIFTY 50'
            ),
            h('span', null, '24,180.50 ', h('span', { style: { color: '#22c55e' } }, '+0.62%'))
          ),
          h(
            'div',
            { className: 'hero-chart-wrap' },
            h(HeroMiniChart)
          ),
          h(
            'div',
            { className: 'hero-mini-cards' },
            h(
              'div',
              { className: 'hero-mini-card' },
              h('div', { className: 'hmc-name' }, 'RELIANCE'),
              h('div', { className: 'hmc-val' }, '₹2,845.60 ', h('span', { style: { color: '#22c55e', fontSize: '.75rem' } }, '+1.18%'))
            ),
            h(
              'div',
              { className: 'hero-mini-card' },
              h('div', { className: 'hmc-name' }, 'TCS'),
              h('div', { className: 'hmc-val' }, '₹3,892.40 ', h('span', { style: { color: '#22c55e', fontSize: '.75rem' } }, '+0.83%'))
            ),
            h(
              'div',
              { className: 'hero-mini-card' },
              h('div', { className: 'hmc-name' }, 'HDFCBANK'),
              h('div', { className: 'hmc-val' }, '₹1,648.90 ', h('span', { style: { color: '#ef4444', fontSize: '.75rem' } }, '-0.68%'))
            ),
            h(
              'div',
              { className: 'hero-mini-card' },
              h('div', { className: 'hmc-name' }, 'INFY'),
              h('div', { className: 'hmc-val' }, '₹1,564.30 ', h('span', { style: { color: '#22c55e', fontSize: '.75rem' } }, '+0.36%'))
            )
          )
        )
      )
    ),

    /* ===== STATS BAND ===== */
    h(
      'section',
      { className: 'tv-container' },
      h(
        'div',
        { className: 'landing-stats' },
        STATS.map((s, i) =>
          h(
            motion.div,
            {
              className: 'stat',
              key: i,
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.08 },
            },
            h('div', { className: 'num' }, s.num),
            h('div', { className: 'lbl' }, s.lbl)
          )
        )
      )
    ),

    /* ===== FEATURES ===== */
    h(
      'section',
      { id: 'features', className: 'tv-container', style: { padding: '60px 20px' } },
      h(
        'div',
        { className: 'section-head' },
        h('div', { className: 'eyebrow' }, 'Features'),
        h('h2', null, 'Everything a trader needs'),
        h('p', null, 'TradeVerse brings the look and feel of Zerodha Kite, Groww, and TradingView into one beautiful, beginner-friendly platform.')
      ),
      h(
        'div',
        { className: 'features-grid' },
        FEATURES.map((f, i) =>
          h(
            motion.div,
            {
              className: 'feature-card',
              key: f.title,
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.08 },
            },
            h('div', { className: 'fc-icon', style: { background: f.bg } }, h('i', { className: `bi ${f.icon}` })),
            h('h3', null, f.title),
            h('p', null, f.desc)
          )
        )
      )
    ),

    /* ===== HOW IT WORKS ===== */
    h(
      'section',
      { id: 'how', className: 'tv-container', style: { padding: '40px 20px 60px' } },
      h(
        'div',
        { className: 'section-head' },
        h('div', { className: 'eyebrow' }, 'How it works'),
        h('h2', null, 'Start trading in 4 steps'),
        h('p', null, 'No deposits, no KYC, no risk. Just sign up and start practising.')
      ),
      h(
        'div',
        { className: 'how-steps' },
        STEPS.map((s, i) =>
          h(
            motion.div,
            {
              className: 'how-step',
              key: s.title,
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.08 },
            },
            h('div', { className: 'step-num' }, i + 1),
            h('h4', null, s.title),
            h('p', null, s.desc)
          )
        )
      )
    ),

    /* ===== TESTIMONIALS ===== */
    h(
      'section',
      { id: 'testimonials', className: 'tv-container', style: { padding: '40px 20px 60px' } },
      h(
        'div',
        { className: 'section-head' },
        h('div', { className: 'eyebrow' }, 'Testimonials'),
        h('h2', null, 'Loved by new traders'),
        h('p', null, 'Thousands of beginners use TradeVerse to learn the markets before risking real money.')
      ),
      h(
        'div',
        { className: 'testi-grid' },
        TESTIMONIALS.map((t, i) =>
          h(
            motion.div,
            {
              className: 'testi-card',
              key: i,
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.08 },
            },
            h(
              'div',
              { className: 'stars' },
              [...Array(5)].map((_, k) => h('i', { key: k, className: 'bi bi-star-fill' }))
            ),
            h('p', null, `"${t.quote}"`),
            h(
              'div',
              { className: 'who' },
              h('div', { className: 'av' }, t.name[0]),
              h(
                'div',
                null,
                h('div', { className: 'nm' }, t.name),
                h('div', { className: 'rl' }, t.role)
              )
            )
          )
        )
      )
    ),

    /* ===== CALL TO ACTION ===== */
    h(
      'section',
      { className: 'tv-container', style: { padding: '40px 20px 80px' } },
      h(
        motion.div,
        {
          className: 'cta-band',
          initial: { opacity: 0, scale: 0.96 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { duration: 0.4 },
        },
        h('h2', null, 'Ready to start your trading journey?'),
        h('p', null, 'Join TradeVerse today, get ₹10,00,000 virtual cash, and trade the Indian markets risk-free.'),
        h(
          Link,
          { to: ctaTo, className: 'tv-btn' },
          ctaLabel,
          ' ',
          h('i', { className: 'bi bi-arrow-right' })
        )
      )
    )
  )
}

// A simple SVG line chart drawn inside the hero visual.
// It's just a static decoration — not real data.
function HeroMiniChart() {
  const points = [40, 52, 48, 60, 55, 68, 64, 78, 72, 88, 84, 96]
  const max = Math.max(...points)
  const w = 100, ht = 100

  // Build the SVG path string
  let path = ''
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = ht - (p / max) * ht
    path += (i === 0 ? 'M' : 'L') + x + ',' + y + ' '
  })
  const area = path + ' L' + w + ',' + ht + ' L0,' + ht + ' Z'

  return h(
    'svg',
    { viewBox: `0 0 ${w} ${ht}`, preserveAspectRatio: 'none', style: { width: '100%', height: '100%' } },
    h(
      'defs',
      null,
      h(
        'linearGradient',
        { id: 'hg', x1: '0', y1: '0', x2: '0', y2: '1' },
        h('stop', { offset: '0%', stopColor: '#3b82f6', stopOpacity: '0.45' }),
        h('stop', { offset: '100%', stopColor: '#3b82f6', stopOpacity: '0' })
      )
    ),
    h('path', { d: area, fill: 'url(#hg)' }),
    h('path', { d: path, fill: 'none', stroke: '#60a5fa', strokeWidth: '1.5', vectorEffect: 'non-scaling-stroke' })
  )
}

// ---- Data for the sections ----

const STATS = [
  { num: '₹10L', lbl: 'Virtual cash on signup' },
  { num: '20+', lbl: 'Real Indian stocks' },
  { num: '5s', lbl: 'Live price refresh' },
  { num: '0', lbl: 'Real money at risk' },
]

const FEATURES = [
  { icon: 'bi-wallet2', title: '₹10L Virtual Cash', desc: 'Every account starts with ₹10,00,000 in virtual capital. No top-ups needed — practise freely.', bg: 'linear-gradient(135deg,#2563eb,#0ea5e9)' },
  { icon: 'bi-graph-up-arrow', title: 'Live Price Engine', desc: 'Prices update every few seconds with realistic random-walk movement across all stocks.', bg: 'linear-gradient(135deg,#16a34a,#22c55e)' },
  { icon: 'bi-candle', title: 'Candlestick Charts', desc: 'Professional TradingView Lightweight Charts with 1m, 5m, 15m, 1H and 1D timeframes.', bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
  { icon: 'bi-bag-check', title: 'Real Buy & Sell', desc: 'Place trades, merge holdings, track average price, and build a real portfolio over time.', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { icon: 'bi-pie-chart', title: 'Portfolio Analytics', desc: 'Allocation pie charts, growth curves, and P/L trends give you a complete picture.', bg: 'linear-gradient(135deg,#dc2626,#f87171)' },
  { icon: 'bi-shield-check', title: '100% Risk-free', desc: 'No real money, no KYC. Just pure learning and practice in a safe environment.', bg: 'linear-gradient(135deg,#475569,#94a3b8)' },
]

const STEPS = [
  { title: 'Create an account', desc: 'Sign up in seconds with just a username, email, and password.' },
  { title: 'Get ₹10L virtual cash', desc: 'Your wallet is instantly credited with ₹10,00,000 to start trading.' },
  { title: 'Buy & sell stocks', desc: 'Explore 20+ Indian stocks, place trades, and build your portfolio.' },
  { title: 'Track & improve', desc: 'Monitor your P/L, review transactions, and refine your strategy.' },
]

const TESTIMONIALS = [
  { name: 'Aarav Sharma', role: 'B.Tech Student', quote: 'TradeVerse is exactly what I needed to understand the stock market before investing my real money. The charts are beautiful.' },
  { name: 'Priya Iyer', role: 'Working Professional', quote: 'It feels just like Zerodha Kite but without the risk. I practise my trades here first, then execute them on my real broker.' },
  { name: 'Rohan Mehta', role: 'Beginner Investor', quote: 'The portfolio analytics are fantastic. I finally understand how P/L works and how diversification helps. Highly recommend!' },
]
