export const ROUTES = [
  { id: 'home', path: '/', labelKey: 'nav_home' },
  { id: 'about', path: '/about', labelKey: 'nav_about' },
  { id: 'trajectory', path: '/trajectory', labelKey: 'nav_trajectory' },
  { id: 'education', path: '/education', labelKey: 'nav_education' },
  { id: 'projects', path: '/projects', labelKey: 'nav_projects' },
  { id: 'volunteering', path: '/volunteering', labelKey: 'nav_volunteering' },
  { id: 'contact', path: '/contact', labelKey: 'nav_contact' },
]

export const HOME_SECTIONS = [
  { id: 'home-hero', labelKey: 'home_sec_hero' },
  { id: 'home-why', labelKey: 'home_sec_about' },
  { id: 'home-build', labelKey: 'home_sec_build' },
  { id: 'home-matters', labelKey: 'home_sec_matters' },
  { id: 'home-trajectory', labelKey: 'home_sec_trajectory' },
  { id: 'home-projects', labelKey: 'home_sec_projects' },
  { id: 'home-education', labelKey: 'home_sec_education' },
  { id: 'home-volunteering', labelKey: 'home_sec_volunteering' },
  { id: 'home-contact', labelKey: 'home_sec_contact' },
]

export function routeIdFromPath(pathname) {
  const normalized = pathname.replace(/\/$/, '') || '/'
  const match = ROUTES.find((route) => route.path === normalized)
  return match?.id ?? 'home'
}

export function isHomePath(pathname) {
  return routeIdFromPath(pathname) === 'home'
}
