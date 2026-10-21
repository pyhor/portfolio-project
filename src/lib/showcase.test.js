import test from 'node:test'
import assert from 'node:assert/strict'
import { loopPosition } from './showcase.js'

test('project recycling wraps only after a complete card has left the viewport', () => {
  const stride = 600
  assert.equal(loopPosition(0, 0, stride, 4), 0)
  assert.equal(loopPosition(1, 80, stride, 4), 520)
  assert.equal(loopPosition(0, 599, stride, 4), -599)
  assert.equal(loopPosition(0, 600, stride, 4), -600)
  assert.equal(loopPosition(0, 601, stride, 4), 1799)
  assert.equal(loopPosition(0, 2400, stride, 4), 0)
})
test('backward browsing and multiple cycles retain a unique, evenly spaced set', () => {
  for (const phase of [-2500, -1, 0, 601, 9601]) {
    const positions = Array.from({ length: 4 }, (_, i) => loopPosition(i, phase, 600, 4)).sort((a,b)=>a-b)
    assert.equal(new Set(positions).size, 4)
    for(let i=1;i<positions.length;i++) assert.equal(positions[i]-positions[i-1],600)
  }
})
test('full-width gutters do not make a partially visible card recycle early', () => {
  assert.equal(loopPosition(0, 601, 600, 4, 75), -601)
  assert.equal(loopPosition(0, 675, 600, 4, 75), -675)
  assert.equal(loopPosition(0, 676, 600, 4, 75), 1724)
})
