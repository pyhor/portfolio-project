import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { ROUTES } from '../routes'
import { LangSwitcher } from './LangSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { headerVisibility } from '../lib/headerVisibility'

const NAV_ROUTES = ['home', 'about', 'projects', 'trajectory', 'education', 'volunteering', 'contact']

export function ProgressNavigation({ pageProgress = 0 }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrollHidden, setScrollHidden] = useState(false)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const progress = Math.min(1, Math.max(0, pageProgress))

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    let state = { anchorY: window.scrollY, visible: true }
    let frame = 0
    setScrollHidden(false)
    const update = () => {
      frame = 0
      state = headerVisibility(state, window.scrollY)
      setScrollHidden(!state.visible)
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll) }
  }, [pathname])
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    const desktop = matchMedia('(min-width: 1281px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', resize)
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      desktop.removeEventListener('change', resize)
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const links = (mobile = false) => NAV_ROUTES.map((id, index) => {
    const route = ROUTES.find(item => item.id === id)
    const link = <NavLink to={route.path} end={id === 'home'} onClick={mobile ? () => setOpen(false) : undefined} className={({ isActive }) => mobile ? (isActive ? 'is-active' : '') : `desktop-nav__link${id === 'contact' ? ' header-contact' : ''}${isActive ? ' is-active' : ''}`}>
      {mobile && <span className="nav-dialog__number">{String(index + 1).padStart(2, '0')}</span>}
      {t(route.labelKey, id)}{(mobile || id === 'contact') && <ArrowUpRight size={16} aria-hidden="true" />}
    </NavLink>
    return mobile ? <li key={id}>{link}</li> : <span key={id} className="desktop-nav__item">{link}</span>
  })

  return <>
    <header className={`site-header${progress > .005 ? ' is-scrolled' : ''}${scrollHidden && !open ? ' is-scroll-hidden' : ''}`} onFocusCapture={() => setScrollHidden(false)}>
      <div className="site-header__inner">
        <NavLink to="/" end className="site-brand" aria-label={`pyhor — ${t('nav_home', 'Home')}`}>
          <span className="site-brand__mark" aria-hidden="true">p.</span>
          <span className="site-brand__name">pyhor</span>
        </NavLink>
        <nav className="desktop-nav" aria-label={t('nav_explore', 'Explore')}>{links()}</nav>
        <div className="site-header__tools">
          <LangSwitcher compact /><ThemeToggle compact />
          <button ref={triggerRef} className="site-menu-trigger" type="button" aria-label={t('nav_explore')} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={22} /></button>
        </div>
      </div>
      <div className="site-header__progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
    </header>
    {createPortal(<dialog ref={dialogRef} id="mobile-navigation" className="nav-dialog" aria-label={t('nav_explore')} onCancel={event => { event.preventDefault(); setOpen(false) }} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <div className="nav-dialog__panel">
        <div className="nav-dialog__heading"><p>{t('nav_explore')}</p><button type="button" className="nav-dialog__close" aria-label={t('nav_close')} onClick={() => setOpen(false)}><X size={22} /></button></div>
        <nav aria-label={t('nav_explore')}><ul className="nav-dialog__links">{links(true)}</ul></nav>
      </div>
    </dialog>, document.body)}
  </>
}
