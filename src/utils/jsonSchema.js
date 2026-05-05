export function inferSchema(value) {
  if (value === null) return { type: 'null' }
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} }
    // Merge all item schemas
    const itemSchemas = value.map(inferSchema)
    const merged = mergeSchemas(itemSchemas)
    return { type: 'array', items: merged }
  }
  if (typeof value === 'object') {
    const props = {}
    const required = []
    for (const [k, v] of Object.entries(value)) {
      props[k] = inferSchema(v)
      required.push(k)
    }
    return { type: 'object', properties: props, required }
  }
  if (typeof value === 'boolean') return { type: 'boolean', example: value }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { type: 'integer', example: value }
      : { type: 'number', example: value }
  }
  if (typeof value === 'string') {
    const schema = { type: 'string', example: value }
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) schema.format = 'date-time'
    if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) schema.format = 'email'
    if (/^https?:\/\//.test(value)) schema.format = 'uri'
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) schema.format = 'uuid'
    return schema
  }
  return {}
}

function mergeSchemas(schemas) {
  const types = [...new Set(schemas.map(s => s.type))]
  if (types.length === 1) return schemas[0]
  return { oneOf: schemas }
}
