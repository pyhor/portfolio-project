import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'
import { ProgressNavigation } from '../components/ProgressNavigation'
import { ScrollToTop } from '../components/ScrollToTop'
import { isHomePath } from '../routes'
import { usePageScroll } from '../hooks/usePageScroll'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCardTilt } from '../hooks/useCardTilt'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'
const HeroScene = lazy(() => import('../components/HeroScene').then((module) => ({ default: module.HeroScene })))

export function Layout() {
  const location = useLocation()
  const pageProgress = usePageScroll()
  const { ready, lang } = useI18n()

  useScrollReveal([location.pathname, ready, lang])
  useCardTilt(location.pathname)

  useEffect(() => {
    if (!isHomePath(location.pathname)) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  useEffect(() => {
    const redirect = sessionStorage.getItem('gh-pages-redirect')
    if (redirect) {
      sessionStorage.removeItem('gh-pages-redirect')
      const base = import.meta.env.BASE_URL
      const path = redirect.startsWith(base) ? redirect : `${base.replace(/\/$/, '')}${redirect.replace(/^\//, '/')}`
      window.history.replaceState(null, '', path)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('theme-animate')
  }, [])

  return (
    <Box className="portfolio">
      <Box className="ambient-grid" aria-hidden="true" />
      <Suspense fallback={null}><HeroScene /></Suspense>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Box className="reading-progress" style={{ transform: `scaleX(${pageProgress})` }} aria-hidden="true" />
      <ProgressNavigation pageProgress={pageProgress} />
      <ScrollToTop />
      <main className="portfolio-main" id="main-content" tabIndex={-1}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </Box>
  )
}
