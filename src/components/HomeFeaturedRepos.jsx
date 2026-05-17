import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Magnetic } from './Magnetic'
import { TechStackBadges } from './TechStackBadges'
import { useI18n } from '../context/I18nProvider'
import { REPO_LIVE_URLS, pickFeaturedRepos, repoLanguageList } from '../lib/featuredRepos'

const Box = 'd' + 'iv'

function FeaturedRepoCard({ repo }) {
  const { t } = useI18n()
  const languages = repoLanguageList(repo)
  const techLine = languages.join(', ')
  const liveUrl = REPO_LIVE_URLS[repo.name]

  return (
    <article className="featured-repo-card panel-card glass-panel reveal">
      <h3 className="featured-repo-card__title">{repo.name}</h3>
      <p className="featured-repo-card__desc">{repo.description || t('repo_fallback_desc', '')}</p>
      {techLine && (
        <p className="featured-repo-card__tech">
          <strong>{t('proj_tech_label', 'Tech')}:</strong>{' '}
          <TechStackBadges techString={techLine} />
        </p>
      )}
      <Box className="featured-repo-card__actions">
        <Magnetic href={repo.html_url} target="_blank" rel="noreferrer" className="primary-cta">
          {t('btn_view_github', 'View GitHub')} <ArrowUpRight size={16} />
        </Magnetic>
        {liveUrl && (
          <Magnetic href={liveUrl} target="_blank" rel="noreferrer" className="ghost-cta">
            {t('btn_view_live', 'View Live Website')} <ExternalLink size={16} />
          </Magnetic>
        )}
      </Box>
    </article>
  )
}

export function HomeFeaturedRepos({ repos, loading, showNavLink = true }) {
  const { t } = useI18n()
  const featured = pickFeaturedRepos(repos, 3)

  return (
    <>
      {loading && <p className="reveal">{t('work_loading', '')}</p>}
      <Box className="featured-repo-grid">
        {featured.map((repo) => (
          <FeaturedRepoCard key={repo.id} repo={repo} />
        ))}
      </Box>
      {showNavLink && (
        <Magnetic as={Link} to="/projects" className="ghost-cta reveal" style={{ marginTop: '1rem' }}>
          {t('home_view_more_projects', 'View More Projects')} <ArrowUpRight size={16} />
        </Magnetic>
      )}
    </>
  )
}
