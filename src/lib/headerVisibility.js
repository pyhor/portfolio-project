export function headerVisibility(state, y) {
  const position = Math.max(0, y)
  if (position < 64) return { anchorY: position, visible: true }
  if (Math.abs(position - state.anchorY) < 8) return state
  return { anchorY: position, visible: position < state.anchorY }
}
