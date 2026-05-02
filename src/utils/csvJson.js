export function getKeys(data) {
  const keys = []
  data.forEach(row => Object.keys(row).forEach(k => { if (!keys.includes(k)) keys.push(k) }))
  return keys
}

export function jsonToCSV(data) {
  const keys = getKeys(data)
  const rows = data.map(row =>
    keys.map(k => {
      const v = row[k] == null ? '' : String(row[k])
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v
    }).join(',')
  )
  return [keys.join(','), ...rows].join('\n') + '\n'
}

export function parseCSVLine(line) {
  const fields = []; let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') inQ = false
      else cur += ch
    } else {
      if (ch === '"') inQ = true
      else if (ch === ',') { fields.push(cur.trim()); cur = '' }
      else cur += ch
    }
  }
  fields.push(cur.trim())
  return fields
}

export function csvToJSON(csvStr) {
  const lines = csvStr.split('\n').filter(l => l.trim())
  if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row.')
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(line => {
    const vals = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
}

export function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: filename })
  a.click()
  URL.revokeObjectURL(a.href)
}
