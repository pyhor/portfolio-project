import { useMemo, useState } from 'react'
import { Code2, GitFork, Star } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { getRateLimitMessage } from '../lib/githubApi'
import { TechStackBadges } from './TechStackBadges'

const Box = 'd' + 'iv'

function RepoCard({ repo }) {
  const { t } = useI18n()
  const languages = Object.keys(repo.languages || {}).slice(0, 3)

  return (
    <a className="repo-card glass-panel float-card reveal" href={repo.html_url} target="_blank" rel="noreferrer">
      <Box className="repo-card__header">
        <Code2 size={18} />
        <span>{repo.name}</span>
      </Box>
      <p>{repo.description || t('repo_fallback_desc', '')}</p>
      <TechStackBadges
        techString={(languages.length ? languages : [repo.language || t('stat_code', 'Code')]).join(', ')}
        className="language-row"
      />
      <Box className="repo-stats">
        <span>
          <Star size={15} /> {repo.stargazers_count}
        </span>
        <span>
          <GitFork size={15} /> {repo.forks_count}
        </span>
      </Box>
    </a>
  )
}

export function GitHubRepos({ profile, repos, loading, error, rateLimit, fromCache }) {
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
      ? getRateLimitMessage(rateLimit) || t('github_rate_limit', '')
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
              <p>{profile.bio}</p>
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
      <Box className="filter-bar reveal" aria-label="Project filters">
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
          {t('work_loading', 'Syncing repository telemetry...')}
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
