import test from 'node:test'
import assert from 'node:assert/strict'
import { headerVisibility } from './headerVisibility.js'
test('navigation hides downward, returns upward, and stays visible near page top', () => {
  const down = headerVisibility({ anchorY: 0, visible: true }, 100)
  assert.equal(down.visible, false)
  assert.equal(headerVisibility(down, 80).visible, true)
  assert.equal(headerVisibility(down, 40).visible, true)
  assert.equal(headerVisibility(down, -10).anchorY, 0)
})
test('small scroll noise does not flicker the navigation', () => {
  const state = { anchorY: 100, visible: false }
  assert.equal(headerVisibility(state, 96), state)
  assert.equal(headerVisibility(state, 104), state)
  assert.equal(headerVisibility(state, 90).visible, true)
})
