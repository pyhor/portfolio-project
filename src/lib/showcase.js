// Recycle only beyond the left edge; each real project has one DOM instance.
export function loopPosition(index, phase, stride, count, gutter = 0) {
  const total = stride * count
  const recycleEdge = stride + gutter
  return ((index * stride - phase + recycleEdge) % total + total) % total - recycleEdge
}

// One card may be entirely offscreen while recycling. The remaining cards
// must still reach the right edge, including the gap after the final card.
export function loopCardWidth(viewportWidth, count, gap = 24, minimum = 380) {
  return Math.ceil(Math.max(minimum, (viewportWidth + gap) / Math.max(1, count - 1) - gap))
}
