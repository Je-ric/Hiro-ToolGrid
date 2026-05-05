const KEYWORDS = [
  'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
  'FULL JOIN','CROSS JOIN','ON','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE',
  'IS NULL','IS NOT NULL','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET',
  'INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','ALTER TABLE',
  'DROP TABLE','TRUNCATE TABLE','UNION','UNION ALL','DISTINCT','AS','CASE','WHEN',
  'THEN','ELSE','END','WITH','RETURNING','PRIMARY KEY','FOREIGN KEY','REFERENCES',
  'DEFAULT','NOT NULL','UNIQUE','INDEX','CONSTRAINT',
]

export function formatSQL(sql) {
  if (!sql.trim()) return ''

  // Normalize whitespace
  let s = sql.replace(/\s+/g, ' ').trim()

  // Uppercase keywords
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length)
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw}\\b`, 'gi')
    s = s.replace(re, kw)
  }

  // Break before major clauses
  const BREAK_BEFORE = [
    'SELECT','FROM','WHERE','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
    'FULL JOIN','CROSS JOIN','JOIN','ON','AND','OR','ORDER BY','GROUP BY',
    'HAVING','LIMIT','OFFSET','UNION ALL','UNION','INSERT INTO','VALUES',
    'UPDATE','SET','DELETE FROM','RETURNING',
  ]
  for (const kw of BREAK_BEFORE) {
    const re = new RegExp(`\\s+${kw}\\b`, 'g')
    s = s.replace(re, `\n${kw}`)
  }

  // Indent continuation lines
  const lines = s.split('\n')
  const result = lines.map((line, i) => {
    const trimmed = line.trim()
    if (i === 0) return trimmed
    const isTopLevel = BREAK_BEFORE.some(kw => trimmed.startsWith(kw))
    return isTopLevel ? trimmed : '  ' + trimmed
  })

  return result.join('\n')
}
