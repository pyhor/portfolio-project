import { useEffect, useRef, useState } from 'react'

export function usePageScroll() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const commit = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setProgress(next)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(commit)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    commit()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}
