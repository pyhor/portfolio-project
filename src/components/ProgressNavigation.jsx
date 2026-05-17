import { useEffect, useMemo, useState } from 'react'
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
  const [hoverId, setHoverId] = useState(null)

  const items = onHome ? HOME_SECTIONS : ROUTES.map((r) => ({ id: r.id, labelKey: r.labelKey, path: r.path }))
  const activeId = onHome ? homeSpy.activeId : routeIdFromPath(location.pathname)
  const labelId = hoverId || activeId
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
        <p className="nav-dock__section" aria-live="polite">
          {/* {displayLabel(items.find((i) => i.id === labelId) || items[0])} */}
        </p>
        <Box className="nav-dock__tools">
          <LangSwitcher compact />
          <ThemeToggle compact />
          <button
            type="button"
            className="nav-menu-btn"
            onClick={() => setOverlayOpen((open) => !open)}
            aria-expanded={overlayOpen}
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
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
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
        hidden={!overlayOpen}
      >
        <button
          type="button"
          className="nav-overlay__backdrop"
          onClick={() => setOverlayOpen(false)}
          aria-label={t('nav_close', 'Close')}
        />
        <Box className="nav-overlay__panel">
          <p className="nav-overlay__title">{t('nav_explore', 'Explore')}</p>
          <ul className="nav-overlay__sections">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={activeId === item.id ? 'is-active' : ''}
                  onClick={() => handleSelect(item)}
                >
                  <span>0{index + 1}</span>
                  <strong>{displayLabel(item)}</strong>
                </button>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </>
  )
}
