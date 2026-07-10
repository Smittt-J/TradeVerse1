// Skeleton.js
// A shimmering gray box shown while data is loading.
// It uses the CSS animation "skeleton-shimmer" from index.css.

import { createElement as h } from 'react'

export default function Skeleton({ width, height, radius, className }) {
  return h('div', {
    className: 'skeleton ' + (className || ''),
    style: {
      width: width || '100%',
      height: height || 120,
      borderRadius: radius || 16,
    }
  })
}
