import { useEffect, useRef, useState } from 'react'
import { createLensCycle } from '../lib/lensCycle'

export function useLensCycle(ref) {
  const clock = useRef(null)
  const [state, setState] = useState({ index: 0, remaining: 4500, duration: 4500, running: false })
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const syncRef = useRef(null)

  useEffect(() => {
    const root = ref.current
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false, hovering = false, focused = root.contains(document.activeElement), pointerInput = false
    const cycle = createLensCycle({ duration: matchMedia('(pointer: coarse)').matches ? 6500 : 4500, onChange: setState })
    clock.current = cycle
    const sync = (grace = 0) => {
      if (visible && !hovering && !focused && !document.hidden && !media.matches && !pausedRef.current) cycle.resume(grace)
      else cycle.pause()
    }
    syncRef.current = sync
    const enter = event => { if (event.pointerType === 'mouse') { hovering = true; sync() } }
    const leave = event => { if (event.pointerType === 'mouse') { hovering = false; sync(1500) } }
    const pointer = () => { pointerInput = true; focused = false; sync() }
    const key = () => { pointerInput = false; if (root.contains(document.activeElement)) { focused = true; sync() } }
    const focus = () => { focused = !pointerInput; sync() }
    const blur = event => { focused = !pointerInput && root.contains(event.relatedTarget); sync(1500) }
    const motion = () => { setReduced(media.matches); sync() }
    const visibility = () => sync(1500)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(1500) }, { threshold: .35 })
    observer.observe(root)
    root.addEventListener('pointerenter', enter); root.addEventListener('pointerleave', leave)
    root.addEventListener('pointerdown', pointer); document.addEventListener('keydown', key)
    root.addEventListener('focusin', focus); root.addEventListener('focusout', blur)
    media.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility)
    return () => {
      cycle.destroy(); clock.current = null; syncRef.current = null; observer.disconnect()
      root.removeEventListener('pointerenter', enter); root.removeEventListener('pointerleave', leave)
      root.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key)
      root.removeEventListener('focusin', focus); root.removeEventListener('focusout', blur)
      media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility)
    }
  }, [ref])
  useEffect(() => { syncRef.current?.(1500) }, [paused])
  return { ...state, reduced, paused, toggle: () => setPaused(value => !value), select: index => clock.current?.select(index) }
}
