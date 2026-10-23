import assert from 'node:assert/strict'
import test from 'node:test'
import { groupTimelineByYear } from './timeline.js'

test('groups by end year, newest first, preserving all entries and their order', () => {
  const items = [
    { id: 'old', startDate: '2019', endDate: '2020' },
    { id: 'internship', startDate: '2022-11', endDate: '2023-01' },
    { id: 'newest', endDate: '2024' },
    { id: 'other-2023', endDate: '2023-09' },
  ]
  const groups = groupTimelineByYear(items)
  assert.deepEqual(groups.map(group => group.year), ['2024', '2023', '2020'])
  assert.deepEqual(groups.map(group => group.items.map(item => item.id)), [['newest'], ['other-2023', 'internship'], ['old']])
  assert.equal(items[0].id, 'old')
})

test('empty timelines have no year groups', () => {
  assert.deepEqual(groupTimelineByYear([]), [])
})
