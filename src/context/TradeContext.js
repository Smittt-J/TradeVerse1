// TradeContext.js
// This file manages the LIVE STOCK PRICES.
// Every 4 seconds, it randomly updates the price of every stock
// (just like a real market where prices keep changing).
//
// Any component can read the latest prices using the useTrade() hook.

import { createContext, useContext, useEffect, useRef, useState, createElement as h } from 'react'
import { STOCKS } from '../data/stocks.js'
import { nextPrice } from '../utils/priceEngine.js'

const TradeContext = createContext(null)

export function useTrade() {
  return useContext(TradeContext)
}

// Remember the original price of each stock.
// The price engine uses this to pull prices back toward their starting point
// so they don't drift too far up or down.
const BASE_PRICES = {}
STOCKS.forEach(s => { BASE_PRICES[s.ticker] = s.price })

export function TradeProvider({ children }) {
  // livePrices is an object like:
  // { RELIANCE: { ticker, name, sector, price, prevClose, change, changePct, ... }, ... }
  const [livePrices, setLivePrices] = useState(() => {
    const obj = {}
    STOCKS.forEach(s => {
      const change = +(s.price - s.prevClose).toFixed(2)
      const changePct = +((change / s.prevClose) * 100).toFixed(2)
      obj[s.ticker] = { ...s, price: s.price, change: change, changePct: changePct }
    })
    return obj
  })

  // "tick" just counts how many times prices have updated.
  // Components use it to know when to re-read the prices.
  const [tick, setTick] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    // This function runs every 4 seconds to update all prices
    function updatePrices() {
      setLivePrices(prev => {
        const next = { ...prev }
        for (const ticker in next) {
          const cur = next[ticker].price
          const base = BASE_PRICES[ticker]
          const newPrice = +nextPrice(cur, base).toFixed(2)
          const change = +(newPrice - next[ticker].prevClose).toFixed(2)
          const changePct = +((change / next[ticker].prevClose) * 100).toFixed(2)
          next[ticker] = { ...next[ticker], price: newPrice, change: change, changePct: changePct }
        }
        return next
      })
      setTick(t => t + 1)
    }

    // Start the timer (runs every 4000 milliseconds = 4 seconds)
    timer.current = setInterval(updatePrices, 4000)

    // Clean up the timer when the app closes
    return () => clearInterval(timer.current)
  }, [])

  // Helper: get one stock by its ticker (e.g. "RELIANCE")
  function getStock(ticker) {
    return livePrices[ticker] || null
  }

  // Helper: get all stocks as an array
  function allStocks() {
    return Object.values(livePrices)
  }

  const value = { livePrices, getStock, allStocks, tick }

  return h(TradeContext.Provider, { value: value }, children)
}
