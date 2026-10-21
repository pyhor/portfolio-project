import { useEffect } from 'react'
import { pointerTilt } from '../lib/motion'

export function useCardTilt(pathname) {
  useEffect(() => {
    const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let current = null
    let frame = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      if (current) {
        current.style.removeProperty('--tilt-axis-x')
        current.style.removeProperty('--tilt-axis-y')
        current.style.removeProperty('--tilt-angle')
        current = null
      }
    }
    const move = (event) => {
      if (!preference.matches || event.pointerType === 'touch') return
      const card = event.target.closest('.panel-card, .featured-project, .featured-repo-card, .home-preview-card, .edu-card, .vol-card, .repo-card, .language-chip')
      if (current !== card) reset()
      if (!card) return
      current = card
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (current !== card) return
        const { x, y } = pointerTilt(event.clientX, event.clientY, card.getBoundingClientRect())
        card.style.setProperty('--tilt-axis-x', x)
        card.style.setProperty('--tilt-axis-y', y || 0.001)
        card.style.setProperty('--tilt-angle', `${Math.hypot(x, y)}deg`)
      })
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    preference.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      reset()
      document.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', reset)
      preference.removeEventListener('change', reset)
    }
  }, [pathname])
}
