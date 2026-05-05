const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function descField(val, unit, names) {
  if (val === '*') return `every ${unit}`
  if (val.startsWith('*/')) return `every ${val.slice(2)} ${unit}s`
  if (val.includes('-')) {
    const [a, b] = val.split('-')
    const na = names ? names[+a] : a
    const nb = names ? names[+b] : b
    return `${unit} ${na} through ${nb}`
  }
  if (val.includes(',')) {
    const parts = val.split(',').map(v => names ? names[+v] ?? v : v)
    return `${unit}s ${parts.join(', ')}`
  }
  return `${unit} ${names ? names[+val] ?? val : val}`
}

export function parseCron(expr) {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return { valid: false, description: 'Invalid cron expression (need 5 fields)' }

  const [min, hour, dom, month, dow] = parts

  // Common shortcuts
  if (min==='*'&&hour==='*'&&dom==='*'&&month==='*'&&dow==='*') return { valid: true, description: 'Every minute, every day' }
  if (min==='0'&&hour==='0'&&dom==='*'&&month==='*'&&dow==='*') return { valid: true, description: 'Every day at midnight (12:00 AM)' }
  if (min==='0'&&hour==='12'&&dom==='*'&&month==='*'&&dow==='*') return { valid: true, description: 'Every day at noon (12:00 PM)' }
  if (min==='0'&&hour==='0'&&dom==='1'&&month==='*'&&dow==='*') return { valid: true, description: 'At midnight on the 1st of every month' }
  if (min==='0'&&hour==='0'&&dom==='*'&&month==='*'&&dow==='0') return { valid: true, description: 'Every Sunday at midnight' }

  const parts2 = []

  // Minute
  if (min === '*') parts2.push('every minute')
  else if (min.startsWith('*/')) parts2.push(`every ${min.slice(2)} minutes`)
  else parts2.push(`at minute ${min}`)

  // Hour
  if (hour === '*') parts2.push('of every hour')
  else if (hour.startsWith('*/')) parts2.push(`every ${hour.slice(2)} hours`)
  else {
    const h = +hour, ampm = h < 12 ? 'AM' : 'PM', h12 = h % 12 || 12
    parts2.push(`at ${h12}:${min.padStart(2,'0')} ${ampm}`)
  }

  // Day of month
  if (dom !== '*') parts2.push(`on day ${dom} of the month`)

  // Month
  if (month !== '*') parts2.push(descField(month, 'month', MONTHS))

  // Day of week
  if (dow !== '*') parts2.push(`on ${descField(dow, 'weekday', DAYS)}`)

  return { valid: true, description: parts2.join(', ') }
}

export const CRON_EXAMPLES = [
  { expr: '* * * * *',     label: 'Every minute' },
  { expr: '0 * * * *',     label: 'Every hour' },
  { expr: '0 0 * * *',     label: 'Every day at midnight' },
  { expr: '0 12 * * *',    label: 'Every day at noon' },
  { expr: '0 0 * * 0',     label: 'Every Sunday midnight' },
  { expr: '0 0 1 * *',     label: '1st of every month' },
  { expr: '*/5 * * * *',   label: 'Every 5 minutes' },
  { expr: '0 9-17 * * 1-5',label: 'Hourly, Mon–Fri 9–5' },
  { expr: '0 0 1 1 *',     label: 'New Year midnight' },
]
