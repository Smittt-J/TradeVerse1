// helpers.js
// Small helper functions used all over the app.
// Each one is kept simple on purpose — easy to read and understand.

// Turn a number like 2845.6 into "₹2,845.60"
export function formatINR(n, opts) {
  if (n === null || n === undefined || Number.isNaN(n)) return '₹0.00'
  const compact = opts && opts.compact
  const decimals = opts && opts.decimals !== undefined ? opts.decimals : 2
  const num = Number(n)

  // Compact mode shows big numbers in Crores / Lakhs / Thousands
  if (compact) {
    if (Math.abs(num) >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr'
    if (Math.abs(num) >= 100000) return '₹' + (num / 100000).toFixed(2) + ' L'
    if (Math.abs(num) >= 1000) return '₹' + (num / 1000).toFixed(2) + ' K'
  }

  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// Turn a number into a string with commas, e.g. 24180.5 -> "24,180.50"
export function formatNum(n, decimals) {
  if (n === null || n === undefined) return '0'
  const d = decimals !== undefined ? decimals : 2
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })
}

// Show a percentage with a + or - sign, e.g. 1.2 -> "+1.20%"
export function formatPct(n) {
  return (n >= 0 ? '+' : '') + Number(n).toFixed(2) + '%'
}

// Make big volumes easier to read, e.g. 5240000 -> "5.24L"
export function formatVolume(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(2) + 'Cr'
  if (n >= 100000) return (n / 100000).toFixed(2) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(2) + 'K'
  return String(n)
}

// Format a date like "10 Jul, 2026"
export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ---------- Local Storage helpers ----------
// Local Storage only stores strings, so we use JSON to save/load objects.

export function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore errors (e.g. if storage is full)
  }
}

// Make a random ID string (used for transactions and users)
export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// Get the first letters of a name for the avatar circle, e.g. "Aarav Sharma" -> "AS"
export function initials(name) {
  const words = (name || '').trim().split(/\s+/)
  const letters = words.map(w => w[0]).slice(0, 2).join('')
  return letters.toUpperCase() || 'U'
}

// Check if an email looks valid (simple check)
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Check if a password is strong enough:
// at least 6 characters, with at least one letter and one number
export function isValidPassword(pw) {
  return pw.length >= 6 && /[a-zA-Z]/.test(pw) && /\d/.test(pw)
}
