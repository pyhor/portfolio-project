import { NavLink } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { ROUTES } from '../routes'
import { LangSwitcher } from './LangSwitcher'
import { ThemeToggle } from './ThemeToggle'

const NAV_ROUTES = ['home', 'about', 'projects', 'trajectory', 'education', 'volunteering', 'contact']

export function ProgressNavigation({ pageProgress = 0 }) {
  const { t } = useI18n()
  const progress = Math.min(1, Math.max(0, pageProgress))
  return <header className={`site-header${progress > .005 ? ' is-scrolled' : ''}`}>
    <div className="site-header__inner">
      <NavLink to="/" end className="site-brand" aria-label={`pyhor — ${t('nav_home', 'Home')}`}>
        <span className="site-brand__mark" aria-hidden="true">p.</span>
        <span className="site-brand__name">pyhor</span>
      </NavLink>
      <nav className="desktop-nav" aria-label={t('nav_explore', 'Explore')}>
        {NAV_ROUTES.map(id => {
          const route = ROUTES.find(item => item.id === id)
          return <NavLink key={id} to={route.path} end={id === 'home'} className={({ isActive }) => `desktop-nav__link${isActive ? ' is-active' : ''}`}>{t(route.labelKey, id)}</NavLink>
        })}
      </nav>
      <div className="site-header__tools"><LangSwitcher compact /><ThemeToggle compact /></div>
    </div>
    <div className="site-header__progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
  </header>
}
