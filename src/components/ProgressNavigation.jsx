import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { HOME_SECTIONS, ROUTES, isHomePath, routeIdFromPath } from '../routes'
import { useHomeSectionSpy } from '../hooks/useHomeSectionSpy'
import { LangSwitcher } from './LangSwitcher'
import { ThemeToggle } from './ThemeToggle'

const Box = 'd' + 'iv'

export function ProgressNavigation({ pageProgress }) {
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = isHomePath(location.pathname)
  const homeSpy = useHomeSectionSpy(onHome)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const dialogRef = useRef(null)
  const menuRef = useRef(null)

  const items = onHome ? HOME_SECTIONS : ROUTES.map((r) => ({ id: r.id, labelKey: r.labelKey, path: r.path }))
  const activeId = onHome ? homeSpy.activeId : routeIdFromPath(location.pathname)
  const progress = onHome ? homeSpy.progress : pageProgress

  const activeIndex = useMemo(
    () => Math.max(0, items.findIndex((item) => item.id === activeId)),
    [items, activeId],
  )

  const fillPercent = useMemo(() => {
    const steps = Math.max(1, items.length - 1)
    return Math.min(100, Math.max(0, ((activeIndex + progress) / steps) * 100))
  }, [activeIndex, progress, items.length])

  useEffect(() => {
    document.body.classList.toggle('nav-overlay-open', overlayOpen)
    return () => document.body.classList.remove('nav-overlay-open')
  }, [overlayOpen])

  useEffect(() => {
    if (!overlayOpen) return
    const dialog = dialogRef.current
    const focusables = () => [...dialog.querySelectorAll('button, a[href], summary')].filter((element) => element.getClientRects().length > 0)
    focusables()[0]?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOverlayOpen(false)
      if (event.key !== 'Tab') return
      const elements = focusables()
      const first = elements[0]
      const last = elements.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); menuRef.current?.focus() }
  }, [overlayOpen])

  useEffect(() => { setOverlayOpen(false) }, [location.pathname])

  const displayLabel = (item) => t(item.labelKey, item.id)

  const handleSelect = (item) => {
    setOverlayOpen(false)
    if (onHome) {
      homeSpy.scrollToSection(item.id)
      return
    }
    if (item.path) navigate(item.path)
  }

  return (
    <>
      <header className="nav-dock" aria-label="Site controls">
        <NavLink to="/" className="brand-chip" onClick={() => setOverlayOpen(false)}>
          <span className="brand-chip__mark">P</span>
          <span>pyhor</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          {ROUTES.filter((route) => ['about', 'projects', 'contact'].includes(route.id)).map((route) => (
            <NavLink key={route.id} to={route.path}>{displayLabel(route)}</NavLink>
          ))}
        </nav>
        <Box className="nav-dock__tools">
          <LangSwitcher compact />
          <ThemeToggle compact />
          <button
            type="button"
            ref={menuRef}
            className="nav-menu-btn"
            onClick={() => setOverlayOpen((open) => !open)}
            aria-expanded={overlayOpen}
            aria-controls="site-navigation"
            aria-label={t('nav_open', 'Open navigation')}
          >
            {overlayOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </Box>
      </header>

      <nav className="progress-rail" aria-label={onHome ? 'Home sections' : 'Page navigation'}>
        <Box className="progress-rail__track" aria-hidden="true">
          <span className="progress-rail__track-bg" />
          <span className="progress-rail__track-fill" style={{ height: `${fillPercent}%` }} />
        </Box>
        <ol className="progress-rail__steps">
          {items.map((item, index) => {
            const isActive = activeId === item.id
            const isPast = index < activeIndex || (index === activeIndex && progress > 0.12)
            const Tag = onHome ? 'button' : NavLink
            const linkProps = onHome
              ? { type: 'button', onClick: () => handleSelect(item) }
              : { to: item.path, onClick: () => setOverlayOpen(false) }

            return (
              <li key={item.id} className="progress-rail__step">
                <Tag
                  {...linkProps}
                  className={`progress-rail__node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                  aria-current={isActive ? (onHome ? 'true' : 'page') : undefined}
                >
                  <span className="progress-rail__dot" />
                  <span className="progress-rail__label">{displayLabel(item)}</span>
                </Tag>
              </li>
            )
          })}
        </ol>
      </nav>

      <Box
        className={`nav-overlay ${overlayOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="navigation-title"
        id="site-navigation"
        hidden={!overlayOpen}
      >
        <button
          type="button"
          className="nav-overlay__backdrop"
          onClick={() => setOverlayOpen(false)}
          aria-label={t('nav_close', 'Close')}
        />
        <Box className="nav-overlay__panel" ref={dialogRef}>
          <Box className="nav-overlay__heading">
            <p className="nav-overlay__title" id="navigation-title">{t('nav_explore', 'Explore')}</p>
            <button type="button" className="nav-overlay__close" onClick={() => setOverlayOpen(false)} aria-label={t('nav_close', 'Close')}><X size={18} /></button>
          </Box>
          <ul className="nav-overlay__sections">
            {ROUTES.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={routeIdFromPath(location.pathname) === item.id ? 'is-active' : ''}
                  onClick={() => { setOverlayOpen(false); navigate(item.path) }}
                >
                  <span>0{index + 1}</span>
                  <strong>{displayLabel(item)}</strong>
                </button>
              </li>
            ))}
          </ul>
          {onHome && (
            <details className="nav-overlay__home">
              <summary>{t('home_sections', 'On this page')}</summary>
              <ul className="nav-overlay__sections">
                {HOME_SECTIONS.map((item) => (
                  <li key={item.id}>
                    <button type="button" className={activeId === item.id ? 'is-active' : ''} onClick={() => handleSelect(item)}>
                      {displayLabel(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </Box>
      </Box>
    </>
  )
}
