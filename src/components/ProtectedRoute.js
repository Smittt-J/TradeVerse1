// ProtectedRoute.js
// If you're not logged in, this sends you to the Login page.
// If you are logged in, it shows the page you wanted.

import { Navigate } from 'react-router-dom'
import { createElement as h } from 'react'
import { useAuth } from '../context/AuthContext.js'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Still loading from Local Storage — show nothing for a moment
  if (loading) return null

  // Not logged in — go to login page
  if (!user) return h(Navigate, { to: '/login', replace: true })

  // Logged in — show the page
  return children
}
