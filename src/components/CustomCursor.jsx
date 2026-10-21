import { useEffect, useRef } from 'react'
import { useI18n } from '../context/I18nProvider'

// Pointer animation stays outside React's render loop. No position state.
export function CustomCursor({ enabled }) {
  const { t } = useI18n()
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const labels = { view: t('cursor_view', 'VIEW'), open: t('cursor_open', 'OPEN'), explore: t('cursor_explore', 'EXPLORE'), drag: t('cursor_drag', 'DRAG'), external: '↗' }
    labelRef.current.textContent = labels[root.dataset.state] || ''
    let frame = 0
    let x = 0
    let y = 0
    let followX = 0
    let followY = 0
    let visible = false
    let lastTime = 0

    const hide = () => {
      visible = false
      root.dataset.down = 'false'
      root.dataset.visible = 'false'
      document.documentElement.classList.remove('has-custom-cursor')
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
    }
    const animate = (time) => {
      frame = 0
      if (!visible) return
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16.7
      lastTime = time
      const blend = 1 - Math.exp(-delta / 32)
      followX += (x - followX) * blend
      followY += (y - followY) * blend
      ringRef.current.style.transform = `translate3d(${followX}px, ${followY}px, 0)`
      if (Math.abs(x - followX) + Math.abs(y - followY) > 0.15) frame = requestAnimationFrame(animate)
      else lastTime = 0
    }
    const move = (event) => {
      if (!media.matches || event.pointerType !== 'mouse') { hide(); return }
      // Native cursors remain available in forms and browser top-layer dialogs.
      const target = event.target instanceof Element ? event.target : null
      if (!target || target.closest('input, textarea, select, option, [contenteditable="true"], dialog[open], iframe')) { hide(); return }
      x = event.clientX
      y = event.clientY
      if (!visible) { followX = x; followY = y }
      visible = true
      root.dataset.visible = 'true'
      document.documentElement.classList.add('has-custom-cursor')
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const context = target.closest('[data-cursor]')
      const interactive = target.closest('a, button, [role="button"]')
      const state = context?.dataset.cursor || (interactive ? (interactive.matches('a[target="_blank"]') ? 'external' : 'button') : 'normal')
      if (root.dataset.state !== state) {
        root.dataset.state = state
        labelRef.current.textContent = labels[state] || ''
      }
      if (!frame) frame = requestAnimationFrame(animate)
    }
    const down = () => { root.dataset.down = 'true' }
    const up = () => { root.dataset.down = 'false' }
    const key = (event) => { if (event.key === 'Tab' || event.key === 'Escape') hide() }
    const visibility = () => { if (document.hidden) hide() }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointerup', up, { passive: true })
    document.addEventListener('pointercancel', up, { passive: true })
    document.addEventListener('pointerleave', hide)
    document.addEventListener('keydown', key)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('blur', hide)
    media.addEventListener('change', hide)
    return () => {
      hide()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', up)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('keydown', key)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('blur', hide)
      media.removeEventListener('change', hide)
    }
  }, [enabled, t])

  return <div className="portfolio-cursor" ref={rootRef} data-visible="false" aria-hidden="true"><div className="cursor-point" ref={dotRef}><i /></div><div className="cursor-follower" ref={ringRef}><span ref={labelRef} /></div></div>
}
