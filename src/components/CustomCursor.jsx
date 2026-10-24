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
    const media = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const labels = { view: t('cursor_view', 'VIEW'), open: t('cursor_open', 'OPEN'), explore: t('cursor_explore', 'EXPLORE'), drag: t('cursor_drag', 'DRAG'), external: '↗' }
    labelRef.current.textContent = labels[root.dataset.state] || ''
    let frame = 0
    let x = 0
    let y = 0
    let followX = 0
    let followY = 0
    let visible = false
    let lastTime = 0
    let activeDialog = null

    const hide = () => {
      visible = false
      root.dataset.down = 'false'
      root.dataset.visible = 'false'
      document.documentElement.classList.remove('has-custom-cursor')
      if (root.matches(':popover-open')) root.hidePopover()
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
      activeDialog = null
    }
    const animate = (time) => {
      frame = 0
      if (!visible) return
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16.7
      lastTime = time
      const blend = 1 - Math.exp(-delta / 32)
      followX += (x - followX) * blend
      followY += (y - followY) * blend
      const distance = Math.hypot(x - followX, y - followY)
      root.style.setProperty('--droplet-stretch', String(1 + Math.min(distance / 180, .18)))
      root.style.setProperty('--droplet-squash', String(1 - Math.min(distance / 260, .12)))
      ringRef.current.style.transform = `translate3d(${followX}px, ${followY}px, 0)`
      if (Math.abs(x - followX) + Math.abs(y - followY) > 0.15) frame = requestAnimationFrame(animate)
      else lastTime = 0
    }
    const move = (event) => {
      if (!media.matches) { hide(); return }
      root.dataset.pointer = event.pointerType || 'mouse'
      // The bead never intercepts input; native text cursors remain available in forms.
      const target = event.target instanceof Element ? event.target : null
      if (!target || target.closest('iframe')) { hide(); return }
      x = event.clientX
      y = event.clientY
      if (!visible) { followX = x; followY = y }
      visible = true
      root.dataset.visible = 'true'
      const dialog = document.querySelector('dialog[open]')
      if (dialog !== activeDialog) {
        if (root.matches(':popover-open')) root.hidePopover()
        activeDialog = dialog
      }
      if (root.showPopover && !root.matches(':popover-open')) root.showPopover()
      document.documentElement.classList.toggle('has-custom-cursor', event.pointerType === 'mouse')
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
    const touch = (event) => {
      const point = event.touches[0]
      if (point) move({ clientX: point.clientX, clientY: point.clientY, pointerType: 'touch', target: event.target })
    }
    const down = () => { root.dataset.down = 'true' }
    const up = () => { root.dataset.down = 'false'; if (root.dataset.pointer !== 'mouse') hide() }
    const key = (event) => { if (event.key === 'Tab' || event.key === 'Escape') hide() }
    const visibility = () => { if (document.hidden) hide() }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('touchstart', touch, { passive: true })
    document.addEventListener('touchmove', touch, { passive: true })
    document.addEventListener('touchend', hide, { passive: true })
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
      document.removeEventListener('touchstart', touch)
      document.removeEventListener('touchmove', touch)
      document.removeEventListener('touchend', hide)
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

  return <div className="portfolio-cursor" popover="manual" ref={rootRef} data-visible="false" aria-hidden="true"><div className="cursor-point" ref={dotRef}><i /></div><div className="cursor-follower" ref={ringRef}><span ref={labelRef} /></div></div>
}
