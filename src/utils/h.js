// h.js — a tiny helper that makes React.createElement shorter to type.
//
// Instead of writing React.createElement('div', null, 'hello'),
// you can write h('div', null, 'hello').
//
// For components, pass the function: h(MyComponent, { prop: 1 }).
// For fragments (a list of children with no wrapper), use h(Fragment, null, ...kids).

import { createElement, Fragment } from 'react'

export { createElement, Fragment }

// Default export: a short alias for createElement
export default function h(type, props) {
  // Collect children (everything after type and props)
  const children = []
  for (let i = 2; i < arguments.length; i++) {
    children.push(arguments[i])
  }
  return createElement(type, props || null, ...children)
}
