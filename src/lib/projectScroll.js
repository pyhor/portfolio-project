// One wheel gesture advances one project. At either end a fresh gesture can
// continue scrolling the document instead of trapping the visitor in the rail.
export function projectWheelStep(state, delta, now, count) {
  if (Math.abs(delta) < 4) return { ...state, consume: false }
  const direction = Math.sign(delta)
  const fresh = now - state.lastEventAt > 220 || direction !== state.direction
  const next = Math.max(0, Math.min(count - 1, state.index + direction))
  const handled = fresh ? next !== state.index : state.handled
  return {
    index: fresh && handled ? next : state.index,
    lastEventAt: now,
    direction,
    handled,
    consume: handled,
  }
}
