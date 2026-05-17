import { useCallback, useEffect, useRef, useState } from 'react'
import { HOME_SECTIONS } from '../routes'

export function useHomeSectionSpy(enabled) {
  const [activeId, setActiveId] = useState(HOME_SECTIONS[0].id)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const elements = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!elements.length) return undefined

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateProgress)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.15, 0.4, 0.65] },
    )

    elements.forEach((el) => observer.observe(el))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateProgress()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  const activeIndex = HOME_SECTIONS.findIndex((s) => s.id === activeId)

  return { activeId, activeIndex, progress, scrollToSection }
}
