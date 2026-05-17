import { ArrowUpRight, Briefcase, Code2, Route } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { TechStackBadges } from '../components/TechStackBadges'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

const CODING_ITEMS = [
  {
    periodKey: 'traj_code_1_period',
    ageKey: 'traj_code_1_age',
    titleKey: 'traj_code_1_title',
    projectKey: 'traj_code_1_project',
    sourceKey: 'traj_code_1_source',
    techKey: 'traj_code_1_tech',
    noteKey: 'traj_code_1_note',
    href: 'https://github.com/pyhor/cinema-mgmt-system-2020',
  },
  {
    periodKey: 'traj_code_2_period',
    ageKey: 'traj_code_2_age',
    titleKey: 'traj_code_2_title',
    projectKey: 'traj_code_2_project',
    sourceKey: 'traj_code_2_source',
    techKey: 'traj_code_2_tech',
    noteKey: 'traj_code_2_note',
    href: 'https://github.com/pyhor/hotel-website-2023',
  },
  {
    periodKey: 'traj_code_3_period',
    ageKey: 'traj_code_3_age',
    titleKey: 'traj_code_3_title',
    projectKey: 'traj_code_3_project',
    sourceKey: 'traj_code_3_source',
    techKey: 'traj_code_3_tech',
    noteKey: 'traj_code_3_note',
    href: 'https://github.com/pyhor/vet-mgmt-system-2024',
  },
]

function TimelineTrack({ items, icon: Icon }) {
  const { t } = useI18n()

  return (
    <ol className="timeline-track">
      {items.map((item) => (
        <li key={item.periodKey} className="timeline-node timeline-reveal">
          <span className="timeline-node__dot" aria-hidden="true" />
          <article className="timeline-node__card glass-panel float-card">
            <Box className="timeline-node__meta">
              <Icon size={16} />
              <span>{t(item.periodKey, '')}</span>
              {item.ageKey && <span className="timeline-node__age">{t(item.ageKey, '')}</span>}
            </Box>
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
          </article>
        </li>
      ))}
    </ol>
  )
}

export function TrajectoryPage() {
  const { t } = useI18n()

  const workItems = [
    {
      periodKey: 'traj_work_1_period',
      titleKey: 'traj_work_1_title',
      roleKey: 'traj_work_1_role',
      detailKeys: ['traj_work_1_location'],
      bullets: [
        'traj_work_1_b1',
        'traj_work_1_b2',
        'traj_work_1_b3',
        'traj_work_1_b4',
        'traj_work_1_b5',
      ],
    },
  ]

  return (
    <PageShell>
      <section className="page-section">
        <Box className="section-kicker reveal">
          <Route size={16} />
          <span>{t('trajectory_kicker', 'Trajectory')}</span>
        </Box>
        <h1 className="page-title reveal">{t('trajectory_heading', 'How the journey unfolded')}</h1>
        <p className="page-lede reveal">{t('trajectory_lede', '')}</p>
      </section>

      <section className="page-section">
        <h2 className="section-title reveal">
          <Code2 size={28} className="inline-icon" /> {t('trajectory_coding_title', 'Coding progress story')}
        </h2>
        <TimelineTrack items={CODING_ITEMS} icon={Code2} />
      </section>

      <section className="page-section">
        <h2 className="section-title reveal">
          <Briefcase size={28} className="inline-icon" /> {t('trajectory_work_title', 'Work trajectory')}
        </h2>
        <TimelineTrack items={workItems} icon={Briefcase} />
      </section>
    </PageShell>
  )
}
