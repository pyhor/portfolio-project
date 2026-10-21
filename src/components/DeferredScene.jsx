import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useI18n } from '../context/I18nProvider'

const HeroScene = lazy(() => import('./HeroScene').then(module => ({ default: module.HeroScene })))

export function DeferredScene() {
  const { t } = useI18n()
  const ref = useRef(null)
  const [nearby, setNearby] = useState(false)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setNearby(true); return undefined }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '250px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  const placeholder = <div className="scene-placeholder" role="status"><span /><p>{t('studio_loading', 'Interactive 3D study · preparing when in view')}</p></div>
  return <div className="lab-exhibit" ref={ref}>{nearby ? <Suspense fallback={placeholder}><HeroScene /></Suspense> : placeholder}</div>
}
