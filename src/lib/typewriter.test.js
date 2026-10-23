import test from 'node:test'
import assert from 'node:assert/strict'
import { nextTypewriterFrame } from './typewriter.js'

test('types, holds, deletes, and cycles every description indefinitely', () => {
  const phrases = ['Frontend', 'Systems', 'Testing']
  let frame = { index: 0, length: 0, deleting: false }
  const completed = []
  for (let tick = 0; tick < 100; tick++) {
    frame = nextTypewriterFrame(frame, phrases)
    if (frame.deleting && frame.length === Array.from(phrases[frame.index]).length) {
      completed.push(phrases[frame.index])
      assert.ok(frame.delay >= 1000)
    }
  }
  assert.deepEqual(completed.slice(0, 6), [...phrases, ...phrases])
})

test('handles Chinese and supplementary characters without splitting them', () => {
  const phrases = ['开发🧑']
  let frame = { index: 0, length: 0, deleting: false }
  const rendered = []
  for (let i = 0; i < 3; i++) {
    frame = nextTypewriterFrame(frame, phrases)
    rendered.push(Array.from(phrases[frame.index]).slice(0, frame.length).join(''))
  }
  assert.deepEqual(rendered, ['开', '开发', '开发🧑'])
})
