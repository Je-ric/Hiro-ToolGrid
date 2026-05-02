export function toUpperCase(t)   { return t.toUpperCase() }
export function toLowerCase(t)   { return t.toLowerCase() }
export function toTitleCase(t)   { return t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()) }
export function toSentenceCase(t){ return t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) }
export function toCamelCase(t)   { return t.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) }
export function toPascalCase(t)  { const c = toCamelCase(t); return c ? c[0].toUpperCase() + c.slice(1) : '' }
export function toSnakeCase(t)   { return t.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') }
export function toKebabCase(t)   { return t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
export function toSlug(t)        { return t.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') }
export function removeSpaces(t)  { return t.replace(/\s+/g, '') }
export function removeExtraSpaces(t) { return t.trim().replace(/\s+/g, ' ') }
export function reverseText(t)   { return t.split('').reverse().join('') }
export function countWords(t)    { return t.trim() === '' ? 0 : t.trim().split(/\s+/).length }

export const TRANSFORMS = [
  { id: 'upper',       label: 'UPPERCASE',      fn: toUpperCase },
  { id: 'lower',       label: 'lowercase',      fn: toLowerCase },
  { id: 'title',       label: 'Title Case',     fn: toTitleCase },
  { id: 'sentence',    label: 'Sentence case',  fn: toSentenceCase },
  { id: 'camel',       label: 'camelCase',      fn: toCamelCase },
  { id: 'pascal',      label: 'PascalCase',     fn: toPascalCase },
  { id: 'snake',       label: 'snake_case',     fn: toSnakeCase },
  { id: 'kebab',       label: 'kebab-case',     fn: toKebabCase },
  { id: 'slug',        label: 'url-slug',       fn: toSlug },
  { id: 'nospaces',    label: 'RemoveSpaces',   fn: removeSpaces },
  { id: 'extraspaces', label: 'Trim Spaces',    fn: removeExtraSpaces },
  { id: 'reverse',     label: 'esreveR',        fn: reverseText },
]
