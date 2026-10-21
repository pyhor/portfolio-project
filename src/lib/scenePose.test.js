import test from 'node:test'
import assert from 'node:assert/strict'
import { scenePose } from './scenePose.js'

test('the opening sculpture aligns with its responsive layout anchor', () => {
  const pose = scenePose({ progress: 0, section: 0, mobile: false, anchor: { x: 0.6, y: 0.2 } })
  assert.equal(pose.x, 0.6)
  assert.equal(pose.y, 0.2)
  assert.equal(pose.opacity, 1)
})

test('the sculpture moves to alternate margins and softens behind content', () => {
  const first = scenePose({ progress: 0.4, section: 1, mobile: false })
  const second = scenePose({ progress: 0.6, section: 2, mobile: false })
  assert.ok(first.x < 0 && second.x > 0)
  assert.ok(first.opacity <= 0.3)
  assert.notEqual(first.rotation, second.rotation)
})

test('mobile scenes use less space and lower opacity', () => {
  const desktop = scenePose({ progress: 0.5, section: 2, mobile: false })
  const mobile = scenePose({ progress: 0.5, section: 2, mobile: true })
  assert.ok(mobile.scale < desktop.scale)
  assert.ok(mobile.opacity < desktop.opacity)
})
