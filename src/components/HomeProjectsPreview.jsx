import { ArrowUpRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HomeFeaturedRepos } from './HomeFeaturedRepos'
import { Magnetic } from './Magnetic'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function HomeProjectsPreview({ repos, loading }) {
  const { t } = useI18n()

  return (
    <section className="page-section home-preview-section" id="home-projects">
      <Box className="section-kicker reveal">
        <Layers3 size={16} aria-hidden="true" />
        <span>{t('projects_kicker', 'Projects')}</span>
      </Box>
      <h2 className="section-title reveal">{t('nav_projects', 'Projects')}</h2>
      <p className="page-lede reveal">{t('home_projects_preview_desc', '')}</p>
      <Box className="home-projects-preview__body reveal">
        <HomeFeaturedRepos repos={repos} loading={loading} showNavLink={false} />
      </Box>
      <Magnetic as={Link} to="/projects" className="ghost-cta reveal home-projects-preview__more">
        {t('home_view_more', 'View More')} <ArrowUpRight size={16} />
      </Magnetic>
    </section>
  )
}
