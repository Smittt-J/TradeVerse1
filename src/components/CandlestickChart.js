// CandlestickChart.js
// This component draws the candlestick chart using TradingView's
// Lightweight Charts library.
//
// Props:
//   ticker    - which stock (e.g. "RELIANCE")
//   price     - the current live price (updates the last candle)
//   timeframe - "1m", "5m", "15m", "1H", or "1D"
//   height    - chart height in pixels

import { useEffect, useRef } from 'react'
import { createElement as h } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'
import { generateCandles, tickCandles } from '../utils/priceEngine.js'

export default function CandlestickChart({ ticker, price, timeframe, height }) {
  timeframe = timeframe || '1D'
  height = height || 380

  const containerRef = useRef(null)   // the div the chart goes inside
  const chartRef = useRef(null)        // the chart object
  const seriesRef = useRef(null)       // the candlestick series
  const candlesRef = useRef([])        // the candle data

  // Create (or recreate) the chart when ticker or timeframe changes
  useEffect(function () {
    if (!containerRef.current) return
    const basePrice = price || 1000

    // Create the chart with dark theme colors
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.08)', timeVisible: true },
    })
    chartRef.current = chart

    // Add the candlestick series (green for up, red for down)
    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })
    seriesRef.current = series

    // Generate candle data and show it
    const candles = generateCandles(basePrice, timeframe, 120)
    candlesRef.current = candles
    series.setData(candles)
    chart.timeScale().fitContent()

    // Make the chart resize when the window changes
    const ro = new ResizeObserver(function (entries) {
      for (const e of entries) { chart.applyOptions({ width: e.contentRect.width }) }
    })
    ro.observe(containerRef.current)

    // Cleanup: remove chart and observer when component unmounts
    return function () {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [ticker, timeframe, height]) // eslint-disable-line react-hooks/exhaustive-deps

  // When the live price changes, update the last candle
  useEffect(function () {
    if (!seriesRef.current || !price) return
    candlesRef.current = tickCandles(candlesRef.current, price, timeframe)
    seriesRef.current.update(candlesRef.current[candlesRef.current.length - 1])
  }, [price]) // eslint-disable-line react-hooks/exhaustive-deps

  return h('div', { ref: containerRef, style: { width: '100%', height: height } })
}
