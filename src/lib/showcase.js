// Recycle only beyond the left edge; each real project has one DOM instance.
export function loopPosition(index, phase, stride, count, gutter = 0) {
  const total = stride * count
  const recycleEdge = stride + gutter
  return ((index * stride - phase + recycleEdge) % total + total) % total - recycleEdge
}
