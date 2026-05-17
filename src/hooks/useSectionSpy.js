import { useCallback, useEffect, useRef, useState } from 'react'

export function useSectionSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] || 'home')
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef(0)

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 12
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const computeProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }

    const commitProgress = () => {
      const next = computeProgress()
      if (Math.abs(next - progressRef.current) < 0.0005) return
      progressRef.current = next
      setProgress(next)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(commitProgress)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.12, 0.35, 0.6] },
    )

    elements.forEach((element) => observer.observe(element))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    commitProgress()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [sectionIds])

  return { activeId, progress, scrollToSection, setActiveId }
}
