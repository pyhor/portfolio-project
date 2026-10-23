// One deterministic step; the component owns and cleans up its timer.
export function nextTypewriterFrame(frame, phrases) {
  const size = Array.from(phrases[frame.index]).length
  if (frame.deleting) {
    if (frame.length === 0) return { index: (frame.index + 1) % phrases.length, length: 0, deleting: false, delay: 250 }
    return { ...frame, length: frame.length - 1, delay: 35 }
  }
  const length = Math.min(size, frame.length + 1)
  return { ...frame, length, deleting: length === size, delay: length === size ? 1400 : 70 }
}
