import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { ROUTES } from '../routes'
import { LangSwitcher } from './LangSwitcher'
import { ThemeToggle } from './ThemeToggle'

const PRIMARY_ROUTES = ['home', 'about', 'projects', 'trajectory']

export function ProgressNavigation({ pageProgress = 0 }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = Math.min(1, Math.max(0, pageProgress))

  const openMenu = () => {
    dialogRef.current?.showModal()
    setMenuOpen(true)
  }

  const closeMenu = () => {
    dialogRef.current?.close()
    setMenuOpen(false)
  }

  useEffect(() => {
    dialogRef.current?.close()
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" end className="site-brand" aria-label={`pyhor — ${t('nav_home', 'Home')}`}>
            <span className="site-brand__mark" aria-hidden="true">p.</span>
            <span className="site-brand__name">pyhor</span>
          </NavLink>

          <nav className="desktop-nav" aria-label={t('nav_explore', 'Explore')}>
            {PRIMARY_ROUTES.map((id) => {
              const route = ROUTES.find((item) => item.id === id)
              return (
                <NavLink
                  key={route.id}
                  to={route.path}
                  end={route.id === 'home'}
                  className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}
                >
                  {t(route.labelKey, route.id)}
                </NavLink>
              )
            })}
          </nav>

          <div className="site-header__tools">
            <LangSwitcher compact />
            <ThemeToggle compact />
            <button
              ref={triggerRef}
              type="button"
              className="site-menu-trigger"
              aria-haspopup="dialog"
              aria-controls="site-navigation-dialog"
              aria-expanded={menuOpen}
              aria-label={t('nav_open', 'Open navigation')}
              onClick={openMenu}
            >
              <span>{t('nav_explore', 'Explore')}</span>
              <Menu size={19} aria-hidden="true" />
            </button>
            <NavLink to="/contact" className="header-contact">
              {t('nav_contact', 'Contact')} <ArrowUpRight size={17} aria-hidden="true" />
            </NavLink>
          </div>
        </div>
        <div className="site-header__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <dialog
        id="site-navigation-dialog"
        ref={dialogRef}
        className="nav-dialog"
        aria-labelledby="site-navigation-title"
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
        onClose={() => {
          setMenuOpen(false)
          triggerRef.current?.focus({ preventScroll: true })
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu()
        }}
      >
        <div className="nav-dialog__panel">
          <div className="nav-dialog__heading">
            <p id="site-navigation-title">{t('nav_explore', 'Explore')} <span>pyhor.</span></p>
            <button
              type="button"
              className="nav-dialog__close"
              aria-label={t('nav_close', 'Close')}
              onClick={closeMenu}
              autoFocus
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <nav aria-labelledby="site-navigation-title">
            <ol className="nav-dialog__links">
              {ROUTES.map((route, index) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    end={route.id === 'home'}
                    className={({ isActive }) => isActive ? 'is-active' : undefined}
                    onClick={closeMenu}
                  >
                    <span className="nav-dialog__number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{t(route.labelKey, route.id)}</span>
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className="nav-dialog__preferences">
            <LangSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </>
  )
}
