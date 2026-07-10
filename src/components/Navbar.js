// Navbar.js
// The top navigation bar. It shows different links depending on whether
// you're logged in or not, and has a mobile menu for small screens.

import { useEffect, useState } from 'react'
import { createElement as h } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { initials } from '../utils/helpers.js'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  // Add a shadow to the navbar when you scroll down
  useEffect(function () {
    function onScroll() { setScrolled(window.scrollY > 8) }
    window.addEventListener('scroll', onScroll)
    return function () { window.removeEventListener('scroll', onScroll) }
  }, [])

  function handleLogout() {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  // Links shown when logged in vs. logged out
  var links = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/markets', label: 'Markets' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/watchlist', label: 'Watchlist' },
        { to: '/leaderboard', label: 'Leaderboard' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/markets', label: 'Markets' },
      ]

  return h('div', null,
    // The navbar bar
    h('nav', { className: 'tv-nav ' + (scrolled ? 'scrolled' : '') },
      h('div', { className: 'tv-container tv-nav-inner' },
        // Logo
        h(Link, { to: '/', className: 'tv-brand', onClick: function () { setMobileOpen(false) } },
          h('span', { className: 'tv-brand-mark' }, h('i', { className: 'bi bi-graph-up-arrow' })),
          'TradeVerse'
        ),
        // Desktop links
        h('div', { className: 'tv-nav-links' },
          links.map(function (l) {
            return h(NavLink, { key: l.to, to: l.to, end: l.to === '/' }, l.label)
          })
        ),
        // Right side buttons
        h('div', { className: 'tv-nav-right' },
          user
            ? [
                h(Link, { key: 'avatar', to: '/profile', className: 'tv-nav-avatar', title: user.username },
                  initials(user.username)
                ),
                h('button', { key: 'logout', className: 'tv-btn tv-btn-ghost', onClick: handleLogout },
                  h('i', { className: 'bi bi-box-arrow-right' }), ' Logout'
                ),
              ]
            : [
                h(Link, { key: 'login', to: '/login', className: 'tv-btn tv-btn-ghost' }, 'Login'),
                h(Link, { key: 'register', to: '/register', className: 'tv-btn tv-btn-primary' }, 'Get Started'),
              ],
          // Hamburger menu button (only shows on mobile)
          h('button', {
            key: 'toggle', className: 'tv-nav-toggle',
            onClick: function () { setMobileOpen(function (o) { return !o }) },
            'aria-label': 'Menu'
          },
            h('i', { className: 'bi ' + (mobileOpen ? 'bi-x-lg' : 'bi-list') })
          )
        )
      )
    ),
    // Mobile menu (slides down when hamburger is clicked)
    h(AnimatePresence, null,
      mobileOpen && h(motion.div, {
        className: 'tv-mobile-menu',
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
      },
        links.map(function (l) {
          return h(NavLink, {
            key: l.to, to: l.to, end: l.to === '/',
            onClick: function () { setMobileOpen(false) }
          }, l.label)
        }),
        user
          ? h('button', { className: 'tv-btn tv-btn-ghost tv-btn-block', onClick: handleLogout }, 'Logout')
          : [
              h(Link, { key: 'm-login', to: '/login', className: 'tv-btn tv-btn-ghost tv-btn-block',
                onClick: function () { setMobileOpen(false) } }, 'Login'),
              h(Link, { key: 'm-reg', to: '/register', className: 'tv-btn tv-btn-primary tv-btn-block',
                onClick: function () { setMobileOpen(false) } }, 'Get Started'),
            ]
      )
    )
  )
}
