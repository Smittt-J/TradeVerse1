// NotFound.js
// The 404 page. Shows when the URL doesn't match any route.

import { createElement as h } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition.js'

export default function NotFound() {
  return h(PageTransition, null,
    h('div', { className: 'notfound tv-container' },
      h('div', { className: 'nf-code' }, '404'),
      h('h1', { style: { marginTop: '10px' } }, 'Page not found'),
      h('p', { className: 'text-muted', style: { marginTop: '8px', marginBottom: '24px' } },
        'The page you\'re looking for doesn\'t exist or has been moved.'
      ),
      h(Link, { to: '/', className: 'tv-btn tv-btn-primary' },
        h('i', { className: 'bi bi-house' }), ' Back to Home'
      )
    )
  )
}
