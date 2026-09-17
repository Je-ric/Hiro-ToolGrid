export function formatJson(input, compact = false) {
  if (!input.trim()) throw new Error('Enter JSON to format.')
  return JSON.stringify(JSON.parse(input), null, compact ? 0 : 2)
}

export function transformUrl(input, decode = false, wholeUrl = false) {
  try {
    return (decode ? (wholeUrl ? decodeURI : decodeURIComponent) : (wholeUrl ? encodeURI : encodeURIComponent))(input)
  } catch { throw new Error('Invalid encoding. Check percent escapes and Unicode characters.') }
}

export function generateUuids(count, uppercase = false) {
  if (!Number.isInteger(Number(count)) || Number(count) < 1 || Number(count) > 100) {
    throw new Error('Choose a whole number between 1 and 100.')
  }
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure random generation is unavailable in this browser.')
  return Array.from({ length: Number(count) }, () => {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 15) | 64
    bytes[8] = (bytes[8] & 63) | 128
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
    const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    return uppercase ? uuid.toUpperCase() : uuid
  }).join('\n')
}

export function timestampToDate(value, unit = 'seconds') {
  if (!['seconds', 'milliseconds'].includes(unit)) throw new Error('Choose seconds or milliseconds.')
  if (!/^-?\d+$/.test(String(value).trim())) throw new Error('Enter an integer timestamp.')
  const number = Number(value)
  const milliseconds = unit === 'seconds' ? number * 1000 : number
  if (!Number.isSafeInteger(milliseconds) || Math.abs(milliseconds) > 8640000000000000) throw new Error('Timestamp is outside the supported date range.')
  return new Date(milliseconds)
}

export function isoToTimestamp(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value.trim())
  if (!match) throw new Error('Use an ISO date with a timezone, e.g. 2026-01-01T12:00:00Z.')
  const [, year, month, day, hour, minute, second, , zone] = match
  const leap = Number(year) % 4 === 0 && (Number(year) % 100 !== 0 || Number(year) % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (+month < 1 || +month > 12 || +day < 1 || +day > days[+month - 1] || +hour > 23 || +minute > 59 || +second > 59 ||
      (zone !== 'Z' && (+zone.slice(1, 3) > 23 || +zone.slice(4) > 59))) throw new Error('Enter a valid calendar date and timezone.')
  const ms = Date.parse(value.trim())
  if (!Number.isFinite(ms)) throw new Error('Enter a valid date.')
  return { milliseconds: ms, seconds: Math.floor(ms / 1000), iso: new Date(ms).toISOString() }
}
