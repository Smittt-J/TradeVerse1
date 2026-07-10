// ChangePill.js
// A small colored badge that shows the price change.
// Green with an up arrow if positive, red with a down arrow if negative.

import { createElement as h } from 'react'

export default function ChangePill({ value, suffix }) {
  suffix = suffix || '%'
  const up = value >= 0

  return h('span', { className: 'tv-pill ' + (up ? 'tv-pill-up' : 'tv-pill-down') },
    h('i', { className: 'bi ' + (up ? 'bi-arrow-up-right' : 'bi-arrow-down-right') }),
    (up ? '+' : '') + Number(value).toFixed(2) + suffix
  )
}
