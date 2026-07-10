// Register.js
// The sign-up page. It has a form with username, email, password, and
// confirm password fields. On submit, it calls register() from AuthContext.

import { useState, createElement as h } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { isValidEmail, isValidPassword } from '../utils/helpers.js'
import PageTransition from '../components/PageTransition.js'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // Form fields (one object to keep it tidy)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  // Helper to update one field at a time
  function setField(key) {
    return function (e) { setForm(function (f) { return { ...f, [key]: e.target.value } }) }
  }

  function submit(e) {
    e.preventDefault()
    setErr('')

    // ---- Validation checks ----
    if (!form.username.trim() || form.username.trim().length < 3) { setErr('Username must be at least 3 characters.'); return }
    if (!isValidEmail(form.email)) { setErr('Enter a valid email address.'); return }
    if (!isValidPassword(form.password)) { setErr('Password must be at least 6 characters with a letter and a number.'); return }
    if (form.password !== form.confirm) { setErr('Passwords do not match.'); return }

    setLoading(true)
    const res = register({ username: form.username.trim(), email: form.email.trim(), password: form.password })
    setLoading(false)

    if (!res.ok) { setErr(res.error); toast.error(res.error); return }

    toast.success('Account created! ₹10,00,000 virtual cash added.')
    navigate('/dashboard')
  }

  return h(PageTransition, null,
    h('div', { className: 'auth-wrap' },
      // Left side: dark panel with benefits
      h('aside', { className: 'auth-aside' },
        h(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
          h('h2', null, 'Start your trading journey.'),
          h('p', null, 'Create a free account and get ₹10,00,000 in virtual cash to practise trading the Indian markets.'),
          h('ul', { className: 'auth-points' },
            h('li', null, h('i', { className: 'bi bi-gift-fill' }), ' ₹10,00,000 virtual cash on signup'),
            h('li', null, h('i', { className: 'bi bi-graph-up-arrow' }), ' Trade 20+ real Indian stocks'),
            h('li', null, h('i', { className: 'bi bi-shield-check' }), ' No real money, no risk, no KYC'),
            h('li', null, h('i', { className: 'bi bi-cloud-arrow-up' }), ' Portfolio saved in your browser')
          )
        )
      ),
      // Right side: the form
      h('main', { className: 'auth-main' },
        h(motion.div, { className: 'auth-card', initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
          h('h3', null, 'Create your account'),
          h('p', { className: 'sub' }, 'It takes less than a minute. No card required.'),
          h('form', { className: 'auth-form', onSubmit: submit, noValidate: true },
            // Username
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Username'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-person input-icon' }),
                h('input', { className: 'form-control', placeholder: 'trader123', value: form.username, onChange: setField('username') })
              )
            ),
            // Email
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Email address'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-envelope input-icon' }),
                h('input', { className: 'form-control', type: 'email', placeholder: 'you@example.com', value: form.email, onChange: setField('email') })
              )
            ),
            // Password
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Password'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-lock input-icon' }),
                h('input', { className: 'form-control', type: showPw ? 'text' : 'password', placeholder: 'Min 6 chars, 1 number', value: form.password, onChange: setField('password') }),
                h('button', { type: 'button', className: 'toggle-eye', onClick: function () { setShowPw(function (s) { return !s }) } },
                  h('i', { className: 'bi ' + (showPw ? 'bi-eye-slash' : 'bi-eye') })
                )
              )
            ),
            // Confirm Password
            h('div', { className: 'mb-3' },
              h('label', { className: 'form-label' }, 'Confirm Password'),
              h('div', { className: 'input-grp' },
                h('i', { className: 'bi bi-lock-fill input-icon' }),
                h('input', { className: 'form-control', type: showPw ? 'text' : 'password', placeholder: 'Re-enter password', value: form.confirm, onChange: setField('confirm') })
              )
            ),
            h('div', { className: 'auth-err' }, err),
            h('button', { className: 'tv-btn tv-btn-primary tv-btn-block', type: 'submit', disabled: loading },
              loading ? h('i', { className: 'bi bi-arrow-repeat' }) : h('i', { className: 'bi bi-person-plus' }),
              ' Create Account'
            )
          ),
          h('div', { className: 'auth-foot' },
            'Already have an account? ', h(Link, { to: '/login' }, 'Log in')
          )
        )
      )
    )
  )
}
