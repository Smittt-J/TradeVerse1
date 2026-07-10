// Markets.js
// Shows all 20 Indian stocks as cards. You can search, filter by sector,
// and sort by price, change %, or alphabetically.

import { createElement as h } from 'react'
import { useState } from 'react'
import { useTrade } from '../context/TradeContext.js'
import { STOCKS } from '../data/stocks.js'
import StockCard from '../components/StockCard.js'
import IndexTicker from '../components/IndexTicker.js'
import PageTransition from '../components/PageTransition.js'

// Sorting options for the dropdown
const SORTS = [
  { key: 'changePct', label: 'Change %' },
  { key: 'price', label: 'Price' },
  { key: 'name', label: 'Alphabetical' },
]

export default function Markets() {
  const { allStocks } = useTrade()

  // Filters and sorting state
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All')
  const [sort, setSort] = useState('changePct')
  const [desc, setDesc] = useState(true)

  // Build the list of sectors for the dropdown
  const sectors = ['All', ...new Set(STOCKS.map(s => s.sector))]

  // Get the stocks and apply filters + sorting
  const stocks = allStocks()
  let list = stocks

  // Filter by search text
  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter(s =>
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
    )
  }

  // Filter by sector
  if (sector !== 'All') {
    list = list.filter(s => s.sector === sector)
  }

  // Sort the list
  list = [...list].sort((a, b) => {
    let cmp = 0
    if (sort === 'name') cmp = a.name.localeCompare(b.name)
    else cmp = a[sort] - b[sort]
    return desc ? -cmp : cmp
  })

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
          h('h1', null, 'Markets'),
          h('div', { className: 'sub' }, STOCKS.length + ' Indian stocks with live prices. Click any card to trade.')
        )
      ),
      h(IndexTicker, null),
      // Search + filter controls
      h(
        'div',
        { className: 'markets-controls' },
        h(
          'div',
          { className: 'tv-search', style: { maxWidth: 320 } },
          h('i', { className: 'bi bi-search tv-search-icon' }),
          h('input', {
            className: 'form-control',
            placeholder: 'Search by ticker or company...',
            value: query,
            onChange: e => setQuery(e.target.value)
          })
        ),
        h(
          'select',
          {
            className: 'form-control',
            style: { width: 'auto', borderRadius: 12, padding: '10px 14px' },
            value: sector,
            onChange: e => setSector(e.target.value)
          },
          sectors.map(s => h('option', { key: s, value: s }, s))
        ),
        h(
          'select',
          {
            className: 'form-control',
            style: { width: 'auto', borderRadius: 12, padding: '10px 14px' },
            value: sort,
            onChange: e => setSort(e.target.value)
          },
          SORTS.map(s => h('option', { key: s.key, value: s.key }, 'Sort: ' + s.label))
        ),
        h(
          'button',
          { className: 'tv-btn tv-btn-ghost', onClick: () => setDesc(d => !d) },
          h('i', { className: 'bi ' + (desc ? 'bi-sort-down' : 'bi-sort-up') }),
          ' ',
          desc ? 'Desc' : 'Asc'
        )
      ),
      // Stock cards grid
      list.length
        ? h(
            'div',
            { className: 'markets-grid' },
            list.map((s, i) => h(StockCard, { key: s.ticker, stock: s, delay: i * 0.03 }))
          )
        : h(
            'div',
            { className: 'empty-state' },
            h('i', { className: 'bi bi-search' }),
            h('h4', null, 'No stocks found'),
            h('p', null, 'Try a different search or filter.')
          )
    )
  )
}
