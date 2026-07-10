// main.js — the entry point of the app.
// It loads the CSS libraries we need and renders the App into the page.

// All imports must come first — JavaScript processes them before running any code.
import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

// CSS from npm packages
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'

import App from './App.js'
import './index.css'

// Find the <div id="root"> in index.html and put our React app inside it.
// createElement(StrictMode, null, createElement(App)) is the same as:
//   <StrictMode><App /></StrictMode>
createRoot(document.getElementById('root')).render(
  createElement(StrictMode, null, createElement(App))
)
