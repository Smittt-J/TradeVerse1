// AuthContext.js
// This file manages WHO is logged in and everything about their account:
//   - registering a new user
//   - logging in
//   - logging out
//   - buying and selling stocks
//   - adding/removing watchlist items
//   - editing the profile
//
// All data is saved in the browser's Local Storage, so it stays even
// after you refresh the page.
//
// "Context" is a React feature that lets any component read this data
// without having to pass it down through props manually.

import { createContext, useContext, useEffect, useState, createElement as h } from 'react'
import { lsGet, lsSet, uid } from '../utils/helpers.js'
import { STOCKS } from '../data/stocks.js'

// Create the context (a "box" that holds our shared data)
const AuthContext = createContext(null)

// This hook lets any component easily grab the auth data
export function useAuth() {
  return useContext(AuthContext)
}

// Keys we use in Local Storage
const USERS_KEY = 'tv_users'       // list of all registered users
const SESSION_KEY = 'tv_session'   // who is currently logged in

// Every new user starts with this much virtual money
const STARTING_CASH = 1000000

// A user object looks like this:
// {
//   id: "abc123",
//   username: "aarav",
//   email: "aarav@example.com",
//   password: "secret",
//   wallet: 1000000,
//   portfolio: { RELIANCE: { qty: 10, avgPrice: 2800 } },
//   watchlist: ["TCS", "INFY"],
//   transactions: [ { type: "BUY", ticker: "RELIANCE", ... } ],
//   createdAt: "2026-01-01T00:00:00Z"
// }

export function AuthProvider({ children }) {
  // user is null if nobody is logged in
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // When the app first loads, check if someone was already logged in
  useEffect(() => {
    const session = lsGet(SESSION_KEY, null)
    if (session) {
      const users = lsGet(USERS_KEY, [])
      const found = users.find(u => u.id === session.id)
      if (found) setUser(found)
    }
    setLoading(false)
  }, [])

  // Save the user to Local Storage and update the state
  function saveUser(updated) {
    const users = lsGet(USERS_KEY, [])
    const idx = users.findIndex(u => u.id === updated.id)
    if (idx >= 0) users[idx] = updated
    else users.push(updated)
    lsSet(USERS_KEY, users)
    lsSet(SESSION_KEY, { id: updated.id })
    setUser(updated)
  }

  // ---------- Register a new user ----------
  function register({ username, email, password }) {
    const users = lsGet(USERS_KEY, [])

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    // Create the new user with starting cash and empty portfolio
    const newUser = {
      id: uid(),
      username: username,
      email: email,
      password: password,
      wallet: STARTING_CASH,
      portfolio: {},       // empty — no stocks yet
      watchlist: [],       // empty watchlist
      transactions: [],    // no transactions yet
      createdAt: new Date().toISOString(),
    }

    saveUser(newUser)
    return { ok: true, user: newUser }
  }

  // ---------- Log in ----------
  function login({ email, password }) {
    const users = lsGet(USERS_KEY, [])
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Invalid email or password.' }

    lsSet(SESSION_KEY, { id: found.id })
    setUser(found)
    return { ok: true, user: found }
  }

  // ---------- Log out ----------
  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  // ---------- Update profile (e.g. change username) ----------
  function updateUser(partial) {
    if (!user) return
    saveUser({ ...user, ...partial })
  }

  // ---------- BUY a stock ----------
  // ticker: which stock (e.g. "RELIANCE")
  // qty: how many shares to buy
  // price: the current price of the stock
  function buyStock(ticker, qty, price) {
    if (!user) return { ok: false, error: 'Please sign in to trade.' }

    qty = parseInt(qty, 10)
    if (!qty || qty <= 0) return { ok: false, error: 'Enter a valid quantity.' }

    // Total cost = price × quantity
    const cost = +(price * qty).toFixed(2)

    // Check if the user has enough money
    if (cost > user.wallet) {
      return { ok: false, error: 'Not enough wallet balance.' }
    }

    // Make a copy of the portfolio so we don't mutate the original
    const portfolio = { ...user.portfolio }
    const existing = portfolio[ticker]

    if (existing) {
      // Already own some — calculate the new average price
      // avgPrice = (old qty × old avg + new qty × new price) / total qty
      const newQty = existing.qty + qty
      const newAvg = +((existing.qty * existing.avgPrice + qty * price) / newQty).toFixed(2)
      portfolio[ticker] = { qty: newQty, avgPrice: newAvg }
    } else {
      // First time buying this stock
      portfolio[ticker] = { qty: qty, avgPrice: price }
    }

    // Record the transaction
    const stock = STOCKS.find(s => s.ticker === ticker)
    const tx = {
      id: uid(),
      type: 'BUY',
      ticker: ticker,
      name: stock ? stock.name : ticker,
      qty: qty,
      price: price,
      total: cost,
      time: new Date().toISOString(),
    }

    // Update the user: subtract money from wallet, add to portfolio, save transaction
    saveUser({
      ...user,
      wallet: +(user.wallet - cost).toFixed(2),
      portfolio: portfolio,
      transactions: [tx, ...user.transactions].slice(0, 100),
    })

    return { ok: true, tx: tx }
  }

  // ---------- SELL a stock ----------
  function sellStock(ticker, qty, price) {
    if (!user) return { ok: false, error: 'Please sign in to trade.' }

    qty = parseInt(qty, 10)
    if (!qty || qty <= 0) return { ok: false, error: 'Enter a valid quantity.' }

    const holding = user.portfolio[ticker]
    if (!holding || holding.qty < qty) {
      return { ok: false, error: 'You do not own enough shares.' }
    }

    // Money from selling = price × quantity
    const proceeds = +(price * qty).toFixed(2)

    // Update the portfolio
    const portfolio = { ...user.portfolio }
    const newQty = holding.qty - qty
    if (newQty <= 0) {
      // Sold everything — remove this stock from portfolio
      delete portfolio[ticker]
    } else {
      // Keep the same average price, just reduce the quantity
      portfolio[ticker] = { qty: newQty, avgPrice: holding.avgPrice }
    }

    // Record the transaction
    const stock = STOCKS.find(s => s.ticker === ticker)
    const tx = {
      id: uid(),
      type: 'SELL',
      ticker: ticker,
      name: stock ? stock.name : ticker,
      qty: qty,
      price: price,
      total: proceeds,
      time: new Date().toISOString(),
    }

    // Update the user: add money to wallet, update portfolio, save transaction
    saveUser({
      ...user,
      wallet: +(user.wallet + proceeds).toFixed(2),
      portfolio: portfolio,
      transactions: [tx, ...user.transactions].slice(0, 100),
    })

    return { ok: true, tx: tx }
  }

  // ---------- Add or remove a stock from the watchlist ----------
  function toggleWatch(ticker) {
    if (!user) return { ok: false, error: 'Please sign in.' }

    const inList = user.watchlist.includes(ticker)
    let watchlist
    if (inList) {
      // Remove it
      watchlist = user.watchlist.filter(t => t !== ticker)
    } else {
      // Add it
      watchlist = [...user.watchlist, ticker]
    }

    saveUser({ ...user, watchlist: watchlist })
    return { ok: true, added: !inList }
  }

  // Everything above is bundled into this "value" object
  // so any component can use it via the useAuth() hook.
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    buyStock,
    sellStock,
    toggleWatch,
    STARTING_CASH,
  }

  return h(AuthContext.Provider, { value: value }, children)
}
