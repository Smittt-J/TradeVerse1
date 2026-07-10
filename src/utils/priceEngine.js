// priceEngine.js
// This file makes the stock prices move like a real market.
// It also builds the candlestick (Japanese candle) data for the charts.

// How many seconds each timeframe candle covers
export const TF_SECONDS = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1H': 3600,
  '1D': 86400,
}

// Round to 2 decimal places (money doesn't need more than that)
function round(n) {
  return Math.round(n * 100) / 100
}

// Given the current price and the "base" (original) price,
// calculate the next price using a simple random walk.
// The price wanders up and down but slowly pulls back toward the base
// so it never drifts too far away.
export function nextPrice(current, basePrice) {
  // How big each step is (bigger for expensive stocks)
  const step = basePrice * 0.01

  // Random change: somewhere between -step and +step
  const change = (Math.random() - 0.5) * 2 * step

  // Pull the price slightly back toward the base (like a rubber band)
  const pullBack = (basePrice - current) * 0.004

  let next = current + change + pullBack

  // Never let the price fall below 40% of the base price
  if (next < basePrice * 0.4) next = basePrice * 0.4

  return next
}

// Build a list of candles (OHLC) for the chart.
// Each candle has: time, open, high, low, close
export function generateCandles(basePrice, timeframe, count) {
  count = count || 120
  const stepSec = TF_SECONDS[timeframe] || 60
  const now = Math.floor(Date.now() / 1000)

  const candles = []
  let price = basePrice * 0.92 // start a bit below the base for an upward trend

  for (let i = count; i > 0; i--) {
    const t = now - i * stepSec
    const open = price

    // Random move for this candle
    const move = (Math.random() - 0.48) * basePrice * 0.012
    let close = open + move
    if (close < basePrice * 0.4) close = basePrice * 0.4

    // High and low extend a bit beyond open/close
    const high = Math.max(open, close) + Math.random() * basePrice * 0.006
    let low = Math.min(open, close) - Math.random() * basePrice * 0.006
    if (low < basePrice * 0.4) low = basePrice * 0.4

    candles.push({
      time: t,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
    })
    price = close
  }

  // Make the last candle close at the current live price
  if (candles.length > 0) {
    candles[candles.length - 1].close = round(basePrice)
  }

  return candles
}

// When a new live price comes in, update the last candle
// (or start a new one if enough time has passed).
export function tickCandles(candles, price, timeframe) {
  if (!candles || candles.length === 0) return candles

  const stepSec = TF_SECONDS[timeframe] || 60
  const now = Math.floor(Date.now() / 1000)
  const last = candles[candles.length - 1]

  if (now - last.time >= stepSec) {
    // Time for a new candle
    candles.push({
      time: last.time + stepSec,
      open: last.close,
      high: price,
      low: price,
      close: price,
    })
    // Keep only the last 200 candles so memory doesn't grow forever
    if (candles.length > 200) candles.shift()
  } else {
    // Update the existing last candle
    last.close = price
    if (price > last.high) last.high = price
    if (price < last.low) last.low = price
  }

  // Return a new array so React notices the change
  return [...candles]
}
