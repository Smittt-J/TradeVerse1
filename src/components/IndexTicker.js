// IndexTicker.js
// Shows the market indices (NIFTY 50, SENSEX, etc.) in a horizontal row.

import { createElement as h } from 'react'
import { INDICES } from '../data/stocks.js'
import { formatNum } from '../utils/helpers.js'
import ChangePill from './ChangePill.js'

export default function IndexTicker() {
  return h('div', { className: 'tv-card tv-card-pad', style: { marginBottom: '18px' } },
    h('div', { className: 'index-ticker' },
      INDICES.map(function (idx) {
        return h('div', { className: 'it-item', key: idx.name },
          h('span', { className: 'it-name' }, idx.name),
          h('span', { className: 'it-val' }, formatNum(idx.value)),
          h(ChangePill, { value: idx.change })
        )
      })
    )
  )
}
