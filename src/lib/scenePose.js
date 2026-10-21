export function scenePose({ progress, section, mobile, anchor }) {
  const rotation = Math.max(0, Math.min(1, progress)) * Math.PI * 2 + section * 0.55
  if (anchor) return { x: anchor.x, y: anchor.y, scale: 1, opacity: 1, rotation }
  return {
    x: section % 2 ? -0.78 : 0.78,
    y: Math.sin(section * 1.4) * 0.22,
    scale: mobile ? 0.72 : 1.05,
    opacity: mobile ? 0.16 : 0.27,
    rotation,
  }
}
