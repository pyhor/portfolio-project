import { useMemo, useState } from 'react'
import { Code2, GitFork, Star } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'

const Box = 'd' + 'iv'
const REPO_DESCRIPTION_KEYS = {
  'hotel-website-2023': 'repo_hotel_desc',
  'cinema-mgmt-system-2020': 'repo_cinema_desc',
  'vet-mgmt-system-2024': 'repo_vet_desc',
  'portfolio-project': 'repo_portfolio_desc',
  pyhor: 'repo_profile_desc',
  'testing-tanstack-app': 'repo_tanstack_desc',
}


function RepoCard({ repo }) {
  const { t, lang } = useI18n()
  const languages = Object.keys(repo.languages || {}).slice(0, 3)
  const descriptionKey = REPO_DESCRIPTION_KEYS[repo.name]

  return (
    <a className="repo-card glass-panel float-card reveal" href={repo.html_url} target="_blank" rel="noreferrer">
      <Box className="repo-card__header">
        <Code2 size={18} />
        <span>{repo.name}</span>
      </Box>
      <p>{descriptionKey ? t(descriptionKey) : lang === 'zh-cn' ? t('repo_fallback_desc', '') : repo.description || t('repo_fallback_desc', '')}</p>
      {!descriptionKey && repo.description && lang !== 'zh-cn' && <small>{t('github_original_description', 'Original description from GitHub')}</small>}
      <TechStackBadges
        techString={(languages.length ? languages : [repo.language || t('stat_code', 'Code')]).join(', ')}
        className="language-row"
      />
      <Box className="repo-stats">
        <span>
          <Star size={15} aria-hidden="true" /> {repo.stargazers_count} {t('github_stars', 'stars')}
        </span>
        <span>
          <GitFork size={15} aria-hidden="true" /> {repo.forks_count} {t('github_forks', 'forks')}
        </span>
      </Box>
    </a>
  )
}

export function GitHubRepos({ profile, repos, loading, error, fromCache }) {
  const [filter, setFilter] = useState('All')
  const { t } = useI18n()

  const languages = useMemo(() => {
    const set = new Set()
    repos.forEach((repo) => {
      if (repo.language) set.add(repo.language)
      Object.keys(repo.languages || {}).forEach((language) => set.add(language))
    })
    return ['All', ...Array.from(set).slice(0, 7)]
  }, [repos])

  const visibleRepos =
    filter === 'All' ? repos : repos.filter((repo) => repo.language === filter || repo.languages?.[filter])

  const errorMessage =
    error === 'rate_limit'
      ? t('github_rate_limit', '')
      : t('work_error', 'Failed to load projects.')

  return (
    <section className="github-block">
      <Box className="section-kicker reveal">
        <Code2 size={16} />
        <span>{t('github_kicker', 'Live GitHub')}</span>
      </Box>
      <Box className="github-intro split-layout reveal">
        <h2 className="section-title">{t('github_heading', 'Repositories from GitHub.')}</h2>
        {profile && (
          <a className="profile-chip glass-panel float-card" href={profile.html_url} target="_blank" rel="noreferrer">
            <img src={profile.avatar_url} alt="" />
            <Box>
              <strong>{profile.name || profile.login}</strong>
              <p>{t('github_profile_description', 'Public projects and development activity')}</p>
              <span>
                {fromCache ? t('profile_cached', 'Cached GitHub data') : t('profile_live', 'Live from GitHub API')}
              </span>
            </Box>
          </a>
        )}
      </Box>
      {fromCache && error === 'rate_limit' && (
        <p className="cache-notice reveal">{errorMessage}</p>
      )}
      <Box className="filter-bar reveal" aria-label={t('github_filters', 'Project filters')}>
        {languages.map((language) => (
          <button
            className={filter === language ? 'active' : ''}
            key={language}
            type="button"
            onClick={() => setFilter(language)}
          >
            {language === 'All' ? t('filter_all', 'All') : language}
          </button>
        ))}
      </Box>
      {loading && (
        <Box className="loading-panel glass-panel reveal">
          <span className="loader" />
          {t('work_loading', 'Loading repositories…')}
        </Box>
      )}
      {error && !loading && !repos.length && (
        <Box className="loading-panel glass-panel reveal error">{errorMessage}</Box>
      )}
      <Box className="repo-grid">
        {visibleRepos.map((repo) => (
          <RepoCard repo={repo} key={repo.id} />
        ))}
      </Box>
    </section>
  )
}
