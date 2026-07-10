// App.js — the main file that holds everything together.
// It sets up routing, the Auth context, the Trade context,
// the Navbar, Footer, and Toast notifications.
//
// We use React.createElement (shortened to "h") instead of JSX.
// This is plain JavaScript — no special syntax, no plugins needed.

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import { createElement as h, Fragment } from 'react'

import { AuthProvider } from './context/AuthContext.js'
import { TradeProvider } from './context/TradeContext.js'

import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import ProtectedRoute from './components/ProtectedRoute.js'

import Landing from './pages/Landing.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'
import Dashboard from './pages/Dashboard.js'
import Markets from './pages/Markets.js'
import StockDetails from './pages/StockDetails.js'
import Portfolio from './pages/Portfolio.js'
import Watchlist from './pages/Watchlist.js'
import Profile from './pages/Profile.js'
import Leaderboard from './pages/Leaderboard.js'
import NotFound from './pages/NotFound.js'

import './App.css'

// AnimatedRoutes handles page transitions.
// When the URL changes, the old page fades out and the new page fades in.
function AnimatedRoutes() {
  var location = useLocation()
  return h(AnimatePresence, { mode: 'wait' },
    h(Routes, { location: location, key: location.pathname },
      // Public pages (anyone can see)
      h(Route, { path: '/', element: h(Landing) }),
      h(Route, { path: '/login', element: h(Login) }),
      h(Route, { path: '/register', element: h(Register) }),
      h(Route, { path: '/markets', element: h(Markets) }),
      h(Route, { path: '/stock/:ticker', element: h(StockDetails) }),
      // Protected pages (must be logged in)
      h(Route, { path: '/dashboard', element: h(ProtectedRoute, null, h(Dashboard)) }),
      h(Route, { path: '/portfolio', element: h(ProtectedRoute, null, h(Portfolio)) }),
      h(Route, { path: '/watchlist', element: h(ProtectedRoute, null, h(Watchlist)) }),
      h(Route, { path: '/profile', element: h(ProtectedRoute, null, h(Profile)) }),
      h(Route, { path: '/leaderboard', element: h(ProtectedRoute, null, h(Leaderboard)) }),
      // 404 page (if URL doesn't match anything above)
      h(Route, { path: '*', element: h(NotFound) })
    )
  )
}

export default function App() {
  return h(BrowserRouter, null,
    h(AuthProvider, null,
      h(TradeProvider, null,
        h(Fragment, null,
          // The page layout: navbar on top, content in middle, footer at bottom
          h('div', { style: { display: 'flex', flexDirection: 'column', minHeight: '100vh' } },
            h(Navbar),
            h('main', { style: { flex: 1 } },
              h(AnimatedRoutes)
            ),
            h(Footer)
          ),
          // Toast notification popups
          h(ToastContainer, { position: 'bottom-right', autoClose: 3000, theme: 'light' })
        )
      )
    )
  )
}
