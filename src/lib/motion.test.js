import test from 'node:test'
import assert from 'node:assert/strict'
import { pointerTilt } from './motion.js'

test('card tilt stays level at the center and within five degrees at the edges', () => {
  assert.deepEqual(pointerTilt(50, 50, { left: 0, top: 0, width: 100, height: 100 }), { x: 0, y: 0 })
  assert.deepEqual(pointerTilt(100, 0, { left: 0, top: 0, width: 100, height: 100 }), { x: 5, y: 5 })
  assert.deepEqual(pointerTilt(400, -100, { left: 0, top: 0, width: 100, height: 100 }), { x: 5, y: 5 })
})

test('empty card dimensions do not produce invalid transforms', () => {
  assert.deepEqual(pointerTilt(10, 10, { left: 0, top: 0, width: 0, height: 0 }), { x: 0, y: 0 })
})
