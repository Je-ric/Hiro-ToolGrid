export function weightedPick(entries) {
  const total = entries.reduce((s, e) => s + (e.weight || 1), 0)
  let r = Math.random() * total
  for (const e of entries) {
    r -= (e.weight || 1)
    if (r <= 0) return e
  }
  return entries[entries.length - 1]
}

export function buildSegments(entries) {
  const total = entries.reduce((s, e) => s + (e.weight || 1), 0)
  const segments = []
  let start = 0
  for (const e of entries) {
    const sweep = ((e.weight || 1) / total) * 360
    segments.push({ ...e, start, sweep })
    start += sweep
  }
  return segments
}

const PALETTE = [
  '#ef4444','#f97316','#eab308','#22c55e','#14b8a6',
  '#3b82f6','#8b5cf6','#ec4899','#06b6d4','#84cc16',
]
export function getColor(i) { return PALETTE[i % PALETTE.length] }
