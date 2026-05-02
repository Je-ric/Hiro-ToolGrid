const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER   = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?'

export function generatePassword({ length, useUpper, useLower, useNumbers, useSymbols }) {
  let chars = ''
  if (useUpper)   chars += UPPER
  if (useLower)   chars += LOWER
  if (useNumbers) chars += NUMBERS
  if (useSymbols) chars += SYMBOLS
  if (!chars) return null
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function generatePin(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function checkStrength(pw) {
  const count = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*()_+\[\]{}|;:,.<>?]/].filter(r => r.test(pw)).length
  if (pw.length >= 12 && count >= 3) return { label: 'Strong', color: '#22c55e', width: '100%' }
  if (pw.length >= 8  && count >= 2) return { label: 'Medium', color: '#eab308', width: '60%' }
  return { label: 'Weak', color: '#ef4444', width: '30%' }
}
