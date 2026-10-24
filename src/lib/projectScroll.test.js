import test from 'node:test'
import assert from 'node:assert/strict'
import { projectWheelStep } from './projectScroll.js'
const initial = index => ({ index, lastEventAt: -Infinity, direction: 0, handled: false })
test('one continuous wheel gesture advances exactly one card; another gesture advances again', () => {
  let state = initial(0)
  for (const time of [0, 20, 50, 110, 190, 300]) state = projectWheelStep(state, 80, time, 5)
  assert.equal(state.index, 1)
  assert.equal(state.consume, true)
  state = projectWheelStep(state, 80, 600, 5)
  assert.equal(state.index, 2)
})
test('fresh gestures at both ends release document scrolling; reversing steps back once', () => {
  assert.equal(projectWheelStep(initial(0), -80, 0, 5).consume, false)
  assert.equal(projectWheelStep(initial(4), 80, 0, 5).consume, false)
  const last = projectWheelStep(initial(3), 80, 0, 5)
  assert.equal(projectWheelStep(last, 80, 100, 5).consume, true)
  const back = projectWheelStep(last, -80, 100, 5)
  assert.equal(back.index, 3)
})
