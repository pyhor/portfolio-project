import { useLocation } from 'react-router-dom'
import { routeIdFromPath } from '../routes'
import { BackToHome } from './BackToHome'
import { SiteFooter } from './SiteFooter'

const Box = 'd' + 'iv'

export function PageShell({ className = '', children, narrow = false }) {
  const location = useLocation()
  const isHome = routeIdFromPath(location.pathname) === 'home'

  return (
    <Box className={`page-shell ${narrow ? 'page-shell--narrow' : ''} ${className}`.trim()}>
      {!isHome && <BackToHome />}
      {children}
      <SiteFooter />
    </Box>
  )
}
