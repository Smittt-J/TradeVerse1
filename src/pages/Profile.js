// Profile.js
// Shows the user's account info (username, email, wallet, etc.)
// and has an "Edit Profile" button that opens a modal to change the username.

import { createElement as h } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.js'
import { useTrade } from '../context/TradeContext.js'
import { calcPortfolio } from '../utils/portfolioCalc.js'
import { formatINR, formatDate, initials } from '../utils/helpers.js'
import PageTransition from '../components/PageTransition.js'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { getStock } = useTrade()
  const pf = calcPortfolio(user, getStock)
  const navigate = useNavigate()

  // Modal state
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState(user.username)

  function save() {
    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }
    updateUser({ username: username.trim() })
    toast.success('Profile updated')
    setShow(false)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

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
          h('h1', null, 'Profile'),
          h('div', { className: 'sub' }, 'Manage your account details.')
        )
      ),
      h(
        'div',
        { className: 'profile-grid' },
        // Left: profile card with avatar
        h(
          motion.div,
          {
            className: 'tv-card profile-card',
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 }
          },
          h('div', { className: 'pa' }, initials(user.username)),
          h('div', { className: 'pn' }, user.username),
          h('div', { className: 'pe' }, user.email),
          h(
            'div',
            { style: { marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center' } },
            h(
              'button',
              { className: 'tv-btn tv-btn-primary', onClick: function () { setShow(true) } },
              h('i', { className: 'bi bi-pencil' }),
              ' Edit Profile'
            ),
            h(
              'button',
              { className: 'tv-btn tv-btn-red', onClick: handleLogout },
              h('i', { className: 'bi bi-box-arrow-right' }),
              ' Logout'
            )
          )
        ),
        // Right: account info table
        h(
          motion.div,
          {
            className: 'tv-card tv-card-pad',
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.05 }
          },
          h('div', { className: 'tv-card-title', style: { marginBottom: 8 } }, 'Account Overview'),
          h(Row, { k: 'Username', v: user.username }),
          h(Row, { k: 'Email', v: user.email }),
          h(Row, { k: 'Wallet Balance', v: formatINR(user.wallet) }),
          h(Row, { k: 'Portfolio Value', v: formatINR(pf.currentValue) }),
          h(Row, { k: 'Total Holdings', v: pf.count + ' stocks' }),
          h(Row, {
            k: 'Overall P/L',
            v: h('span', { className: pf.overallPL >= 0 ? 'positive' : 'negative' }, formatINR(pf.overallPL))
          }),
          h(Row, { k: 'Member Since', v: formatDate(user.createdAt) })
        )
      ),
      // Edit Profile modal
      h(
        Modal,
        { show: show, onHide: function () { setShow(false) }, centered: true },
        h(
          Modal.Header,
          { closeButton: true },
          h(Modal.Title, null, 'Edit Profile')
        ),
        h(
          Modal.Body,
          null,
          h(
            Form,
            null,
            h(
              Form.Group,
              { className: 'mb-3' },
              h(Form.Label, null, 'Username'),
              h(Form.Control, {
                value: username,
                onChange: function (e) { setUsername(e.target.value) }
              })
            ),
            h(
              Form.Group,
              { className: 'mb-3' },
              h(Form.Label, null, 'Email'),
              h(Form.Control, { value: user.email, disabled: true })
            )
          )
        ),
        h(
          Modal.Footer,
          null,
          h(Button, { variant: 'secondary', onClick: function () { setShow(false) } }, 'Cancel'),
          h(Button, { variant: 'primary', onClick: save }, 'Save Changes')
        )
      )
    )
  )
}

// Small helper component for an info row
function Row({ k, v }) {
  return h(
    'div',
    { className: 'profile-info-row' },
    h('span', { className: 'k' }, k),
    h('span', { className: 'v' }, v)
  )
}
