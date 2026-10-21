import assert from 'node:assert/strict'
import test from 'node:test'
import { sortTimelineNewestFirst } from './timeline.js'

const ids = (items) => sortTimelineNewestFirst(items).map(({ id }) => id)

test('sorts mixed date precision by latest end date, independently of translated periods', () => {
  assert.deepEqual(ids([
    { id: 'year', endDate: '2022', period: '最新' },
    { id: 'range', startDate: '2020', endDate: '2023-01', period: 'Oldest' },
    { id: 'day', endDate: '2024-02-01' },
    { id: 'latest', endDate: '2024' },
  ]), ['latest', 'day', 'range', 'year'])
})

test('uses the end rather than the start of a range', () => {
  assert.deepEqual(ids([
    { id: 'short', startDate: '2022', endDate: '2022' },
    { id: 'long', startDate: '2019', endDate: '2023' },
  ]), ['long', 'short'])
})

test('places valid ongoing entries first and keeps ties stable without mutating input', () => {
  const items = [
    { id: 'first', endDate: '2024' },
    { id: 'ongoing', startDate: '2023-09', ongoing: true },
    { id: 'second', endDate: '2024' },
  ]
  assert.deepEqual(ids(items), ['ongoing', 'first', 'second'])
  assert.deepEqual(items.map(({ id }) => id), ['first', 'ongoing', 'second'])
})

test('sorts invalid or absent dates last, without accepting calendar rollovers or display text', () => {
  assert.deepEqual(ids([
    { id: 'invalid-day', endDate: '2024-02-30' },
    { id: 'missing' },
    { id: 'valid', endDate: '2020' },
    { id: 'translated', endDate: 'Present' },
    { id: 'invalid-current', startDate: 'not-a-date', ongoing: true },
    { id: 'invalid-month', endDate: '2025-13' },
  ]), ['valid', 'invalid-day', 'missing', 'translated', 'invalid-current', 'invalid-month'])
})

test('accepts leap days and orders year/month precision at their period end', () => {
  assert.deepEqual(ids([
    { id: 'february', endDate: '2024-02' },
    { id: 'leap-day', endDate: '2024-02-29' },
    { id: 'march', endDate: '2024-03' },
    { id: 'year', endDate: '2024' },
  ]), ['year', 'march', 'february', 'leap-day'])
})
