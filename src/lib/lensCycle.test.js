import test from 'node:test'
import assert from 'node:assert/strict'
import { createLensCycle } from './lensCycle.js'

function setup() {
  let time = 0, next = 0
  const timers = new Map(), updates = []
  const clock = createLensCycle({ duration: 4500, onChange: state => updates.push(state), now: () => time,
    schedule: (fn, delay) => { timers.set(++next, { fn, at: time + delay }); return next },
    cancel: id => timers.delete(id) })
  const advance = ms => {
    const end = time + ms
    while (true) {
      const due = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0]
      if (!due) break
      time = due[1].at; timers.delete(due[0]); due[1].fn()
    }
    time = end
  }
  return { clock, advance, updates, timers }
}
test('stays idle until visible/resumed and cycles business, build, quality', () => {
  const { clock, advance, updates } = setup()
  advance(10000); assert.equal(updates.length, 0)
  clock.resume(); advance(4500); assert.equal(updates.at(-1).index, 1)
  advance(4500); assert.equal(updates.at(-1).index, 2)
  advance(4500); assert.equal(updates.at(-1).index, 0)
})
test('reading pauses retain remaining time and resume gives a grace period', () => {
  const { clock, advance, updates } = setup()
  clock.resume(); advance(4300); clock.pause(); advance(20000)
  assert.equal(updates.at(-1).index, 0)
  clock.resume(1500); advance(1499); assert.equal(updates.at(-1).index, 0)
  advance(1); assert.equal(updates.at(-1).index, 1)
})
test('manual selection cancels the previous timer and gives a full reading interval', () => {
  const { clock, advance, updates, timers } = setup()
  clock.resume(); advance(4400); clock.select(2); advance(100)
  assert.equal(updates.at(-1).index, 2)
  advance(4400); assert.equal(updates.at(-1).index, 0)
  clock.pause(); clock.select(1); advance(20000); assert.equal(updates.at(-1).index, 1)
  clock.destroy(); assert.equal(timers.size, 0)
})
