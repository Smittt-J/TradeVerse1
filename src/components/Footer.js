// Footer.js
// The footer at the bottom of every page with links and info.

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return h('footer', { className: 'tv-footer' },
    h('div', { className: 'tv-container' },
      h('div', { className: 'tv-footer-grid' },
        // Brand + description
        h('div', null,
          h('div', { className: 'tv-brand' },
            h('span', { className: 'tv-brand-mark' }, h('i', { className: 'bi bi-graph-up-arrow' })),
            'TradeVerse'
          ),
          h('p', null,
            'The modern paper trading platform to practise investing risk-free with ₹10,00,000 virtual cash. Learn, trade, and grow — without losing a single rupee.'
          )
        ),
        // Product links
        h('div', null,
          h('h5', null, 'Product'),
          h('ul', null,
            h('li', null, h(Link, { to: '/markets' }, 'Markets')),
            h('li', null, h(Link, { to: '/dashboard' }, 'Dashboard')),
            h('li', null, h(Link, { to: '/portfolio' }, 'Portfolio')),
            h('li', null, h(Link, { to: '/watchlist' }, 'Watchlist'))
          )
        ),
        // Company links
        h('div', null,
          h('h5', null, 'Company'),
          h('ul', null,
            h('li', null, h('a', { href: '#features' }, 'Features')),
            h('li', null, h('a', { href: '#how' }, 'How it works')),
            h('li', null, h('a', { href: '#testimonials' }, 'Reviews')),
            h('li', null, h(Link, { to: '/leaderboard' }, 'Leaderboard'))
          )
        ),
        // Legal links
        h('div', null,
          h('h5', null, 'Legal'),
          h('ul', null,
            h('li', null, h('a', { href: '#' }, 'Terms of Use')),
            h('li', null, h('a', { href: '#' }, 'Privacy Policy')),
            h('li', null, h('a', { href: '#' }, 'Disclaimer')),
            h('li', null, h('a', { href: '#' }, 'Support'))
          )
        )
      ),
      // Bottom bar
      h('div', { className: 'tv-footer-bottom' },
        h('span', null, '© ' + new Date().getFullYear() + ' TradeVerse. Virtual trading for educational purposes only.'),
        h('span', null, 'Built with React, TradingView Lightweight Charts & Framer Motion.')
      )
    )
  )
}
