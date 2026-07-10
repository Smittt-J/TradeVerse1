// portfolioCalc.js
// A simple helper that calculates the user's portfolio numbers.
// It takes the user's portfolio and the live stock prices, and returns
// all the useful numbers: total invested, current value, profit/loss, etc.
//
// This is just a plain function (not a hook), so it's easy to understand.

import { STOCKS } from '../data/stocks.js'

export function calcPortfolio(user, getStock) {
  // If nobody is logged in, return all zeros
  if (!user) {
    return {
      holdings: [],
      totalInvestment: 0,
      currentValue: 0,
      overallPL: 0,
      overallPLPct: 0,
      todayPL: 0,
      count: 0,
    }
  }

  // Build a list of holdings from the user's portfolio
  const holdings = []
  let totalInvestment = 0
  let currentValue = 0
  let todayPL = 0

  for (const ticker in user.portfolio) {
    const pos = user.portfolio[ticker]
    const stock = getStock(ticker)
    const currentPrice = stock ? stock.price : pos.avgPrice
    const prevPrice = stock ? stock.prevClose : pos.avgPrice
    const stockInfo = STOCKS.find(s => s.ticker === ticker)

    // investment = quantity × average buy price
    const investment = pos.qty * pos.avgPrice
    // currentValue = quantity × current price
    const curValue = pos.qty * currentPrice
    // profit/loss = current value - investment
    const pl = curValue - investment
    // profit/loss percentage
    const plPct = investment ? (pl / investment) * 100 : 0
    // today's P/L = quantity × (current price - yesterday's close)
    const dayPL = pos.qty * (currentPrice - prevPrice)

    holdings.push({
      ticker: ticker,
      name: stockInfo ? stockInfo.name : ticker,
      sector: stockInfo ? stockInfo.sector : '-',
      qty: pos.qty,
      avgPrice: pos.avgPrice,
      currentPrice: currentPrice,
      investment: investment,
      currentValue: curValue,
      pl: pl,
      plPct: plPct,
      todayPL: dayPL,
    })

    totalInvestment += investment
    currentValue += curValue
    todayPL += dayPL
  }

  const overallPL = currentValue - totalInvestment
  const overallPLPct = totalInvestment ? (overallPL / totalInvestment) * 100 : 0

  return {
    holdings: holdings,
    totalInvestment: totalInvestment,
    currentValue: currentValue,
    overallPL: overallPL,
    overallPLPct: overallPLPct,
    todayPL: todayPL,
    count: holdings.length,
  }
}
