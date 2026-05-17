import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  HeartHandshake,
  Layers,
  Route,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactSection } from '../components/ContactSection'
import { HeroTypography } from '../components/HeroTypography'
import { HomeProjectsPreview } from '../components/HomeProjectsPreview'
import { HomeSectionPreview } from '../components/HomeSectionPreview'
import { Magnetic } from '../components/Magnetic'
import { PageShell } from '../components/PageShell'
import { PERSONAL_VALUE_KEYS, ValueHighlights } from '../components/ValueHighlights'
import { WhyMeSummary } from '../components/WhyMeSummary'
import { useI18n } from '../context/I18nProvider'
import { useGithubData } from '../hooks/useGithubData'

const Box = 'd' + 'iv'

const BUILD_CARDS = [
  { icon: Layers, titleKey: 'build_card_1_title', descKey: 'build_card_1_desc' },
  { icon: Sparkles, titleKey: 'build_card_2_title', descKey: 'build_card_2_desc' },
  { icon: Wrench, titleKey: 'build_card_3_title', descKey: 'build_card_3_desc' },
  { icon: Code2, titleKey: 'build_card_4_title', descKey: 'build_card_4_desc' },
]

const MATTERS_CARDS = [
  { titleKey: 'matters_1_title', descKey: 'matters_1_desc', examplesKey: 'matters_1_examples' },
  { titleKey: 'matters_2_title', descKey: 'matters_2_desc', examplesKey: 'matters_2_examples' },
  { titleKey: 'matters_3_title', descKey: 'matters_3_desc' },
  { titleKey: 'matters_4_title', descKey: 'matters_4_desc' },
  { titleKey: 'matters_5_title', descKey: 'matters_5_desc' },
  { titleKey: 'matters_6_title', descKey: 'matters_6_desc' },
]

export function HomePage() {
  const { t } = useI18n()
  const github = useGithubData(12)

  const stats = [
    { value: github.profile?.public_repos ?? '—', label: t('metric_repos', 'repos') },
    { value: github.profile?.followers ?? '—', label: t('metric_followers', 'followers') },
    { value: github.profile?.location || t('metric_location', 'Malaysia'), label: t('metric_location_label', 'Location') },
  ]

  return (
    <PageShell className="home-page">
      <Box className="home-sections">
        <section className="page-section hero" id="home-hero">
          <HeroTypography profileBio={github.profile?.bio}>
            <Box className="hero-badges reveal">
              <span className="hero-badge hero-badge--signal">{t('signal_label', 'Availability')}</span>
              <span className="hero-badge">{t('signal_title', '')}</span>
              <span className="hero-badge hero-badge--soft">{t('signal_sub', '')}</span>
            </Box>
            <Box className="hero-metrics reveal">
              {stats.map((stat) => (
                <span key={stat.label} className="hero-metric">
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </span>
              ))}
            </Box>
            <p className="hero-value-line reveal">{t('hero_value_line', '')}</p>
          </HeroTypography>
          <Box className="hero-actions reveal">
            <Magnetic as={Link} to="/projects" className="primary-cta">
              {t('cta_explore', 'Explore work')} <ArrowUpRight size={18} />
            </Magnetic>
            <Magnetic
              href={github.profile?.html_url || 'https://github.com/pyhor'}
              target="_blank"
              rel="noreferrer"
              className="ghost-cta"
            >
              {t('cta_github', 'GitHub')} <Code2 size={18} />
            </Magnetic>
          </Box>
        </section>

        <section className="page-section" id="home-why">
          <WhyMeSummary />
        </section>

        <section className="page-section" id="home-build">
          <Box className="section-kicker reveal">
            <Zap size={16} />
            <span>{t('build_kicker', 'What I can build for you')}</span>
          </Box>
          <h2 className="section-title reveal">{t('build_heading', '')}</h2>
          <p className="page-lede reveal">{t('build_lede', '')}</p>
          <ValueHighlights keys={PERSONAL_VALUE_KEYS} />
          <Box className="value-grid">
            {BUILD_CARDS.map(({ icon: Icon, titleKey, descKey }) => (
              <article key={titleKey} className="value-card panel-card glass-panel reveal">
                <Icon size={22} />
                <h3>{t(titleKey, '')}</h3>
                <p>{t(descKey, '')}</p>
              </article>
            ))}
          </Box>
        </section>

        <section className="page-section" id="home-matters">
          <Box className="section-kicker reveal">
            <Sparkles size={16} />
            <span>{t('matters_kicker', 'Why my work matters')}</span>
          </Box>
          <h2 className="section-title reveal">{t('matters_heading', '')}</h2>
          <p className="page-lede reveal">{t('matters_lede', '')}</p>
          <ValueHighlights keys={PERSONAL_VALUE_KEYS} className="value-highlights--compact" />
          <Box className="stat-row reveal">
            <span>{t('matters_stat_years', '')}</span>
            <span>{t('matters_stat_repos', '{{n}} public repos').replace('{{n}}', String(github.profile?.public_repos ?? '—'))}</span>
            <span>{t('matters_stat_systems', '')}</span>
            <span>{t('matters_stat_langs', '')}</span>
          </Box>
          <Box className="matters-grid">
            {MATTERS_CARDS.map((card) => (
              <article key={card.titleKey} className="matters-card panel-card glass-panel reveal">
                <h3>{t(card.titleKey, '')}</h3>
                <p>{t(card.descKey, '')}</p>
                {card.examplesKey && <p className="matters-card__examples">{t(card.examplesKey, '')}</p>}
              </article>
            ))}
          </Box>
        </section>

        <HomeSectionPreview
          id="home-trajectory"
          to="/trajectory"
          icon={Route}
          kickerKey="trajectory_kicker"
          titleKey="nav_trajectory"
          descKey="home_trajectory_preview_desc"
          previewKeys={['traj_code_1_project', 'traj_code_2_project', 'traj_code_3_project']}
        />

        <HomeProjectsPreview repos={github.repos} loading={github.loading} />

        <HomeSectionPreview
          id="home-education"
          to="/education"
          icon={GraduationCap}
          kickerKey="education_kicker"
          titleKey="nav_education"
          descKey="home_education_preview_desc"
          previewKeys={['edu_1_degree', 'edu_2_degree']}
        />

        <HomeSectionPreview
          id="home-volunteering"
          to="/volunteering"
          icon={HeartHandshake}
          kickerKey="volunteering_kicker"
          titleKey="nav_volunteering"
          descKey="home_volunteering_preview_desc"
          previewKeys={['vol_1_title', 'vol_2_title']}
        />

        <section className="page-section" id="home-contact">
          <ContactSection id="home-contact-inner" />
        </section>
      </Box>
    </PageShell>
  )
}
