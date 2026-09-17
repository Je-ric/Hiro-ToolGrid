import test from 'node:test'
import assert from 'node:assert/strict'
import { formatJson, transformUrl, generateUuids, timestampToDate, isoToTimestamp } from '../src/utils/developerTools.js'

test('JSON formats objects and primitives, minifies, and rejects invalid input', () => {
  assert.equal(formatJson('{"a":1}'), '{\n  "a": 1\n}')
  assert.equal(formatJson(' { "a": [true, null] } ', true), '{"a":[true,null]}')
  assert.equal(formatJson('false'), 'false')
  assert.equal(formatJson('null'), 'null')
  assert.throws(() => formatJson(''))
  assert.throws(() => formatJson('{"a":1,}'))
})

test('URL components round-trip Unicode and reserved characters', () => {
  const input = 'Hello \u4e16\u754c & /?=+#'
  assert.equal(transformUrl(transformUrl(input), true), input)
  assert.equal(transformUrl('https://example.com/a b', false, true), 'https://example.com/a%20b')
  assert.equal(transformUrl('%2F', true, true), '%2F')
  assert.equal(transformUrl('a+b', true), 'a+b')
  assert.throws(() => transformUrl('%GG', true))
  assert.throws(() => transformUrl('%E0%A4', true))
})

test('UUID batches have the v4 version and variant bits with unique output', () => {
  const ids = generateUuids(100).split('\n')
  assert.equal(ids.length, 100)
  assert.equal(new Set(ids).size, 100)
  for (const id of ids) assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  const upper = generateUuids(1, true)
  assert.equal(upper, upper.toUpperCase())
  for (const count of [0, -1, 101, 1.5, '', 'abc']) assert.throws(() => generateUuids(count))
})

test('Timestamps support epoch, negative values and explicit units', () => {
  assert.equal(timestampToDate('0').toISOString(), '1970-01-01T00:00:00.000Z')
  assert.equal(timestampToDate('-1').toISOString(), '1969-12-31T23:59:59.000Z')
  assert.equal(timestampToDate('1000', 'milliseconds').getTime(), 1000)
  assert.equal(timestampToDate('1000').getTime(), 1000000)
  for (const input of ['', '1e3', '1.5', 'Infinity', '8640000000000001']) assert.throws(() => timestampToDate(input, 'milliseconds'))
})

test('ISO conversion validates calendar dates and handles offsets and fractions', () => {
  assert.equal(isoToTimestamp('1970-01-01T08:00:00+08:00').seconds, 0)
  assert.equal(isoToTimestamp('1969-12-31T23:59:59.999Z').seconds, -1)
  assert.equal(isoToTimestamp('2000-02-29T00:00:00Z').iso, '2000-02-29T00:00:00.000Z')
  for (const input of ['2025-02-29T00:00:00Z', '1900-02-29T00:00:00Z', '2026-04-31T00:00:00Z', '2026-01-01T24:00:00Z', '2026-01-01T00:00:00', '2026-01-01T00:00:00+24:00']) assert.throws(() => isoToTimestamp(input))
})
