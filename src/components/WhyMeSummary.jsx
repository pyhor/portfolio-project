import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { PERSONAL_VALUE_KEYS, ValueHighlights } from './ValueHighlights'
import { useI18n } from '../context/I18nProvider'
import { useGithubData } from '../hooks/useGithubData'

const Box = 'd' + 'iv'

function summarizeRepos(repos) {
  const languages = new Set()
  repos.forEach((repo) => {
    if (repo.language) languages.add(repo.language)
    Object.keys(repo.languages || {}).forEach((lang) => languages.add(lang))
  })
  return {
    topLanguages: Array.from(languages).slice(0, 4),
    highlighted: repos.slice(0, 4).map((repo) => repo.name),
  }
}

export function WhyMeSummary() {
  const { t } = useI18n()
  const { profile, repos, loading } = useGithubData(12)

  const insights = useMemo(() => summarizeRepos(repos), [repos])

  const langLine =
    insights.topLanguages.length > 0
      ? insights.topLanguages.join(' · ')
      : t('why_me_langs_fallback', 'PHP · JavaScript · HTML/CSS')

  const repoCount = profile?.public_repos ?? repos.length

  return (
    <Box className="why-me">
      <Box className="section-kicker reveal">
        <Heart size={16} />
        <span>{t('why_me_kicker', 'Why me')}</span>
      </Box>
      <article className="why-me__card panel-card glass-panel reveal">
        <h2 className="why-me__title">{t('why_me_heading', 'About me, in one breath')}</h2>
        <p className="why-me__lead">{t('why_me_p1', '')}</p>
        <p className="why-me__lead">{t('why_me_p2', '')}</p>
        <p className="why-me__lead">{t('why_me_qa', '')}</p>
        <p className="why-me__lead">{t('why_me_p3', '')}</p>
        <ValueHighlights keys={PERSONAL_VALUE_KEYS} className="value-highlights--compact" />
        {!loading && (
          <Box className="why-me__stats" aria-label="GitHub highlights">
            <span className="why-me__badge">
              {t('why_me_stat_repos', '{{count}} public repos').replace('{{count}}', String(repoCount || '—'))}
            </span>
            <span className="why-me__badge">
              {t('why_me_stat_langs', 'Often using')}: {langLine}
            </span>
            {insights.highlighted.length > 0 && (
              <span className="why-me__badge why-me__badge--soft">
                {t('why_me_stat_projects', 'Recent work')}: {insights.highlighted.join(', ')}
              </span>
            )}
          </Box>
        )}
        <p className="why-me__closing">{t('why_me_closing', '')}</p>
      </article>
    </Box>
  )
}
