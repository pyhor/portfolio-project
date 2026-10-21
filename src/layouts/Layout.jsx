import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition'
import { ProgressNavigation } from '../components/ProgressNavigation'
import { ScrollToTop } from '../components/ScrollToTop'
import { usePageScroll } from '../hooks/usePageScroll'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { CustomCursor } from '../components/CustomCursor'
import { PortfolioIntro, hasSeenIntro } from '../components/PortfolioIntro'

export function Layout() {
  const location = useLocation()
  const [introVisible, setIntroVisible] = useState(() => !hasSeenIntro())
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('pyhor-intro', 'seen') } catch { /* Storage may be unavailable. */ }
    setIntroVisible(false)
  }, [])
  const pageProgress = usePageScroll()
  useScrollReveal([location.pathname])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <>
    {introVisible && <PortfolioIntro onComplete={finishIntro} />}
    <CustomCursor enabled={!introVisible} />
    <div className="portfolio" inert={introVisible ? true : undefined}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ProgressNavigation pageProgress={pageProgress} />
      <main className="portfolio-main" id="main-content" tabIndex={-1}>
        <PageTransition><Outlet /></PageTransition>
      </main>
      <ScrollToTop />
    </div>
    </>
  )
}
