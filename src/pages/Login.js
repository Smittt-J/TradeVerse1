// Login.js
// The login page. It has a form with email and password fields.
// On submit, it calls the login() function from AuthContext.

import { useState, createElement as h } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { isValidEmail } from '../utils/helpers.js'
import PageTransition from '../components/PageTransition.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    setErr('')

    // Simple checks before calling login
    if (!isValidEmail(email)) { setErr('Enter a valid email address.'); return }
    if (!password) { setErr('Enter your password.'); return }

    setLoading(true)
    const res = login({ email: email, password: password })
    setLoading(false)

    if (!res.ok) {
      setErr(res.error)
      toast.error(res.error)
      return
    }

    // Success — show a toast and go to dashboard
    toast.success('Welcome back, ' + res.user.username + '!')
    navigate('/dashboard')
  }

  return h(PageTransition, null,
    h('div', { className: 'auth-wrap' },
      // Left side: dark panel with info
      h('aside', { className: 'auth-aside' },
        h(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
          h('h2', null, 'Welcome back, trader.'),
          h('p', null, 'Log in to continue practising the markets with your virtual portfolio.'),
          h('ul', { className: 'auth-points' },
            h('li', null, h('i', { className: 'bi bi-check-circle-fill' }), ' Your portfolio and watchlist are saved'),
            h('li', null, h('i', { className: 'bi bi-check-circle-fill' }), ' Live prices update every few seconds'),
            h('li', null, h('i', { className: 'bi bi-check-circle-fill' }), ' Zero risk — 100% virtual money')
          )
        )
      ),
      // Right side: the form
      h('main', { className: 'auth-main' },
        h(motion.div, { className: 'auth-card', initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
          h('h3', null, 'Log in to TradeVerse'),
          h('p', { className: 'sub' }, 'Enter your credentials to access your dashboard.'),
          h('form', { className: 'auth-form', onSubmit: submit, noValidate: true },
            // Email field
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Email address'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-envelope input-icon' }),
                h('input', { className: 'form-control', type: 'email', placeholder: 'you@example.com',
                  value: email, onChange: function (e) { setEmail(e.target.value) } })
              )
            ),
            // Password field
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Password'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-lock input-icon' }),
                h('input', { className: 'form-control', type: showPw ? 'text' : 'password', placeholder: '••••••',
                  value: password, onChange: function (e) { setPassword(e.target.value) } }),
                h('button', { type: 'button', className: 'toggle-eye', onClick: function () { setShowPw(function (s) { return !s }) } },
                  h('i', { className: 'bi ' + (showPw ? 'bi-eye-slash' : 'bi-eye') })
                )
              )
            ),
            // Error message
            h('div', { className: 'auth-err' }, err),
            // Submit button
            h('button', { className: 'tv-btn tv-btn-primary tv-btn-block', type: 'submit', disabled: loading },
              loading ? h('i', { className: 'bi bi-arrow-repeat' }) : h('i', { className: 'bi bi-box-arrow-in-right' }),
              ' Log In'
            )
          ),
          h('div', { className: 'auth-foot' },
            'New to TradeVerse? ', h(Link, { to: '/register' }, 'Create an account')
          )
        )
      )
    )
  )
}
