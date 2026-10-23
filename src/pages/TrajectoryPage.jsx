import { ArrowUpRight, Briefcase, Code2, Route } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { TechStackBadges } from '../components/TechStackBadges'
import { useI18n } from '../context/I18nProvider'
import { JOURNEY_ITEMS } from '../data/timeline'
import { groupTimelineByYear, sortTimelineNewestFirst } from '../lib/timeline'

const Box = 'd' + 'iv'

const SORTED_JOURNEY = sortTimelineNewestFirst(JOURNEY_ITEMS)
const YEAR_GROUPS = groupTimelineByYear(JOURNEY_ITEMS)

function TimelineTrack({ items }) {
  const { t } = useI18n()

  return (
    <ol className="timeline-track">
      {items.map(item => {
        const Icon = item.category === 'work' ? Briefcase : Code2
        return (
          <li key={item.id} className={`timeline-node timeline-reveal${item.id === SORTED_JOURNEY[0]?.id ? ' timeline-node--latest' : ''}`}>
            <span className="timeline-node__dot" aria-hidden="true" />
            <article className="timeline-node__card glass-panel float-card">
              <Box className="timeline-node__meta">
                <Icon size={16} aria-hidden="true" />
                <span className="timeline-node__category">{t(item.category === 'work' ? 'traj_category_work' : 'traj_category_coding', '')}</span>
                {(item.endDate.length > 4 || item.startDate !== item.endDate) && <time dateTime={item.endDate}>{t(item.periodKey, '')}</time>}
                {item.id === SORTED_JOURNEY[0]?.id && <span className="timeline-node__latest">{t('traj_most_recent', '')}</span>}
                {item.ageKey && <span className="timeline-node__age">{t(item.ageKey, '')}</span>}
              </Box>
              <div className="timeline-node__content">
              <h3>{t(item.titleKey, '')}</h3>
              {item.projectKey && (
                <p>
                  <strong>{t('traj_project_label', 'Project')}:</strong>{' '}
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {t(item.projectKey, '')}
                    </a>
                  ) : (
                    t(item.projectKey, '')
                  )}
                </p>
              )}
              {item.sourceKey && (
                <p>
                  <strong>{t('traj_source_label', 'Source')}:</strong> {t(item.sourceKey, '')}
                </p>
              )}
              {item.techKey && (
                <p>
                  <strong>{t('traj_tech_label', 'Tech')}:</strong>{' '}
                  <TechStackBadges techString={t(item.techKey, '')} />
                </p>
              )}
              {item.noteKey && <p>{t(item.noteKey, '')}</p>}
              {item.href && (
                <a
                  className="timeline-github-btn"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('traj_view_github', 'View on GitHub')} <ArrowUpRight size={16} />
                </a>
              )}
              {item.roleKey && (
                <p>
                  <strong>{t('traj_role_label', 'Role')}:</strong> {t(item.roleKey, '')}
                </p>
              )}
              {item.detailKeys?.map((key) => (
                <p key={key}>{t(key, '')}</p>
              ))}
              {item.bullets?.map((key) => (
                <p key={key} className="timeline-bullet">
                  • {t(key, '')}
                </p>
              ))}
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}

export function TrajectoryPage() {
  const { t } = useI18n()

  return (
    <PageShell className="trajectory-page">
      <section className="page-section">
        <Box className="section-kicker reveal">
          <Route size={16} />
          <span>{t('trajectory_kicker', 'Trajectory')}</span>
        </Box>
        <h1 className="page-title reveal">{t('trajectory_heading', 'How the journey unfolded')}</h1>
        <p className="page-lede reveal">{t('trajectory_lede', '')}</p>
      </section>

      <section className="page-section" aria-labelledby="journey-title">
        <h2 id="journey-title" className="section-title reveal">
          <Route size={28} className="inline-icon" aria-hidden="true" /> {t('trajectory_journey_title', '')}
        </h2>
        <p className="timeline-order-note reveal">{t('trajectory_order_note', '')}</p>
        <div className="timeline-years">{YEAR_GROUPS.map(group => <section className="timeline-year" key={group.year} aria-labelledby={`year-${group.year}`}>
          <h3 className="timeline-year__label timeline-reveal" id={`year-${group.year}`}><time dateTime={group.year}>{group.year}</time></h3>
          <TimelineTrack items={group.items} />
        </section>)}</div>
      </section>
    </PageShell>
  )
}
