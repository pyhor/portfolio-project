export function pointerTilt(clientX, clientY, rect) {
  if (!rect.width || !rect.height) return { x: 0, y: 0 }
  const clamp = (value) => Math.max(-5, Math.min(5, value))
  return {
    x: clamp((0.5 - (clientY - rect.top) / rect.height) * 10),
    y: clamp(((clientX - rect.left) / rect.width - 0.5) * 10),
  }
}
