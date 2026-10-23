import { YearTimeline } from '../components/YearTimeline'
import { HeartHandshake } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

const ROLES = [
  {
    id: 'volunteer-education', endDate: '2024-02',
    titleKey: 'vol_1_title',
    orgKey: 'vol_1_org',
    periodKey: 'vol_1_period',
    categoryKey: 'vol_1_category',
    bullets: ['vol_1_b1', 'vol_1_b2', 'vol_1_b3', 'vol_1_b4'],
  },
  {
    id: 'volunteer-community', endDate: '2024-07',
    titleKey: 'vol_2_title',
    orgKey: 'vol_2_org',
    periodKey: 'vol_2_period',
    categoryKey: 'vol_2_category',
    bullets: ['vol_2_b1', 'vol_2_b2', 'vol_2_b3', 'vol_2_b4'],
  },
]

export function VolunteeringPage() {
  const { t } = useI18n()

  return (
    <PageShell className="volunteering-page chronology-page">
      <section className="page-section">
        <Box className="section-kicker reveal">
          <HeartHandshake size={16} />
          <span>{t('volunteering_kicker', 'Volunteering')}</span>
        </Box>
        <h1 className="page-title reveal">{t('volunteering_heading', 'Giving back')}</h1>
        <p className="page-lede reveal">{t('volunteering_lede', '')}</p>
      </section>

      <section className="page-section chronology-section">
        <YearTimeline items={ROLES} idPrefix="volunteer-year" renderItem={role => (
          <article key={role.titleKey} className="vol-card timeline-entry glass-panel">
            <span className="vol-card__category">{t(role.categoryKey, '')}</span>
            <h2>{t(role.titleKey, '')}</h2>
            <p className="vol-card__org">{t(role.orgKey, '')}</p>
            <p className="vol-card__period">{t(role.periodKey, '')}</p>
            <ul>
              {role.bullets.map((key) => (
                <li key={key}>{t(key, '')}</li>
              ))}
            </ul>
          </article>
        )} />
      </section>
    </PageShell>
  )
}
