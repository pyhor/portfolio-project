import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'
import { ProgressNavigation } from '../components/ProgressNavigation'
import { isHomePath } from '../routes'
import { usePageScroll } from '../hooks/usePageScroll'
import { useScrollReveal } from '../hooks/useScrollReveal'

const Box = 'd' + 'iv'

export function Layout() {
  const location = useLocation()
  const pageProgress = usePageScroll()

  useScrollReveal([location.pathname])

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
      <Box className="dopa-orbs" aria-hidden="true">
        <span className="dopa-orb dopa-orb--1" />
        <span className="dopa-orb dopa-orb--2" />
        <span className="dopa-orb dopa-orb--3" />
      </Box>
      <ProgressNavigation pageProgress={pageProgress} />
      <main className="portfolio-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </Box>
  )
}
