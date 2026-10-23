import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { PageTransition } from '../components/PageTransition'
import { ProgressNavigation } from '../components/ProgressNavigation'
import { ScrollToTop } from '../components/ScrollToTop'
import { usePageScroll } from '../hooks/usePageScroll'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { CustomCursor } from '../components/CustomCursor'
import { PortfolioIntro, hasSeenIntro } from '../components/PortfolioIntro'

export function Layout() {
  const { t, lang } = useI18n()
  const location = useLocation()
  const [introVisible, setIntroVisible] = useState(() => !hasSeenIntro() && location.pathname !== '/projects/jomgo')
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem('pyhor-intro', 'seen') } catch { /* Storage may be unavailable. */ }
    setIntroVisible(false)
  }, [])
  const pageProgress = usePageScroll()
  useScrollReveal([location.pathname, lang])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <>
    {introVisible && <PortfolioIntro onComplete={finishIntro} />}
    <CustomCursor enabled={!introVisible} />
    <div className="portfolio" inert={introVisible ? true : undefined}>
      <a className="skip-link" href="#main-content">{t('skip_content', 'Skip to content')}</a>
      <ProgressNavigation pageProgress={pageProgress} />
      <main className="portfolio-main" id="main-content" tabIndex={-1}>
        <PageTransition><Outlet /></PageTransition>
      </main>
      <ScrollToTop />
    </div>
    </>
  )
}
