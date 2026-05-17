import { GraduationCap } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

const DEGREES = [
  {
    schoolKey: 'edu_1_school',
    degreeKey: 'edu_1_degree',
    periodKey: 'edu_1_period',
    activitiesKey: 'edu_1_activities',
    activityKeys: ['edu_1_a1', 'edu_1_a2', 'edu_1_a3'],
    subjectKey: 'edu_1_subject_label',
    subjectKeys: ['edu_1_s1'],
  },
  {
    schoolKey: 'edu_2_school',
    degreeKey: 'edu_2_degree',
    periodKey: 'edu_2_period',
    activitiesKey: 'edu_2_activities',
    activityKeys: ['edu_2_a1', 'edu_2_a2', 'edu_2_a3', 'edu_2_a4'],
  },
]

export function EducationPage() {
  const { t } = useI18n()

  return (
    <PageShell>
      <section className="page-section">
        <Box className="section-kicker reveal">
          <GraduationCap size={16} />
          <span>{t('education_kicker', 'Education')}</span>
        </Box>
        <h1 className="page-title reveal">{t('education_heading', 'Academic journey')}</h1>
        <p className="page-lede reveal">{t('education_lede', '')}</p>
      </section>

      <Box className="edu-grid">
        {DEGREES.map((degree) => (
          <article key={degree.schoolKey} className="edu-card glass-panel float-card reveal">
            <h2>{t(degree.schoolKey, '')}</h2>
            <p className="edu-card__degree">{t(degree.degreeKey, '')}</p>
            <p className="edu-card__period">{t(degree.periodKey, '')}</p>
            <Box className="edu-card__block">
              <strong>{t(degree.activitiesKey, 'Activities and societies')}</strong>
              <ul>
                {degree.activityKeys.map((key) => (
                  <li key={key}>{t(key, '')}</li>
                ))}
              </ul>
            </Box>
            {degree.subjectKeys && (
              <Box className="edu-card__block">
                <strong>{t(degree.subjectKey, 'Relevant subject')}</strong>
                <ul>
                  {degree.subjectKeys.map((key) => (
                    <li key={key}>{t(key, '')}</li>
                  ))}
                </ul>
              </Box>
            )}
          </article>
        ))}
      </Box>
    </PageShell>
  )
}
