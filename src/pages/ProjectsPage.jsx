import { useProjectCoverMotion } from '../hooks/useProjectCoverMotion'
import { CaseStudyTeaser } from '../components/CaseStudyTeaser'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Code2, Layers3 } from 'lucide-react'
import { FeaturedProjectCard } from '../components/FeaturedProjectCard'
import { GitHubRepos } from '../components/GitHubRepos'
import { Magnetic } from '../components/Magnetic'
import { ProjectBusinessValue } from '../components/ProjectBusinessValue'
import { PageShell } from '../components/PageShell'
import { FEATURED_PROJECTS } from '../data/featuredProjects'
import { useI18n } from '../context/I18nProvider'
import { useGithubData } from '../hooks/useGithubData'

const Box = 'd' + 'iv'
const ASEAN_CANVA_URL = 'https://aseandata2024.my.canva.site/'

const FOCUS_KEYS = ['proj_asean_f1', 'proj_asean_f2', 'proj_asean_f3', 'proj_asean_f4']
const CONTRIB_KEYS = ['proj_asean_c1', 'proj_asean_c2', 'proj_asean_c3', 'proj_asean_c4']

const SKILL_KEYS = [
  ['bsa_cap_analysis', 'bsa_cap_analysis_body'],
  ['bsa_cap_systems', 'bsa_cap_systems_body'],
  ['bsa_cap_delivery', 'bsa_cap_delivery_body'],
  ['bsa_cap_tools', 'bsa_cap_tools_body'],
]

export function ProjectsPage() {
  const { t, lang } = useI18n()
  useProjectCoverMotion(lang)
  const github = useGithubData(12)

  return (
    <PageShell className="projects-page">
      <section className="page-section">
        <Box className="section-kicker reveal">
          <Layers3 size={16} />
          <span>{t('projects_kicker', 'Projects')}</span>
        </Box>
        <h1 className="page-title reveal">{t('projects_page_heading', 'Selected projects')}</h1>
        <p className="page-lede reveal">{t('projects_page_lede', '')}</p>
      </section>

      <section className="page-section">
        <CaseStudyTeaser />
        <h2 className="section-title reveal">{t('projects_featured_title', 'Featured builds')}</h2>
        <Box className="featured-projects-stack">
          {[...FEATURED_PROJECTS].reverse().map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
          <article className="project-feature glass-panel page-section">
            <span className="project-feature__meta">{t('proj_asean_meta', '')}</span>
            <h2>{t('proj_asean_title', '')}</h2>
            <p>{t('proj_asean_desc', '')}</p>
            <p>{t('proj_asean_desc2', '')}</p>
            <ProjectBusinessValue project="asean" />
            <Box className="project-feature__cols">
              <Box>
                <strong>{t('proj_asean_contrib_label', '')}</strong>
                <ul>
                  {CONTRIB_KEYS.map((key) => (
                    <li key={key}>{t(key, '')}</li>
                  ))}
                </ul>
              </Box>
              <Box>
                <strong>{t('proj_asean_focus_label', '')}</strong>
                <ul>
                  {FOCUS_KEYS.map((key) => (
                    <li key={key}>{t(key, '')}</li>
                  ))}
                </ul>
              </Box>
            </Box>
            <p className="project-feature__impact">{t('proj_asean_impact', '')}</p>
            <span className="project-feature__tool">
              {t('proj_asean_tool_label', 'Tool')}: {t('proj_asean_tool', '')}
            </span>
            <Box className="project-feature__actions">
              <Magnetic href={ASEAN_CANVA_URL} target="_blank" rel="noreferrer" className="primary-cta project-canva-btn">
                {t('proj_asean_canva_cta', 'View Canva Project')} <ArrowUpRight size={18} />
              </Magnetic>
            </Box>
          </article>
          <CaseStudyTeaser featured />
        </Box>
      </section>

      <section className="page-section" id="projects-skills">
        <Box className="section-kicker reveal">
          <Code2 size={16} />
          <span>{t('skills_kicker', 'Skills')}</span>
        </Box>
        <h2 className="section-title reveal">{t('bsa_capabilities')}</h2>
        <p className="page-lede reveal">{t('projects_skills_lede', '')}</p>
        <Box className="skills-grid">
          {SKILL_KEYS.map(([nameKey, stackKey]) => (
            <article key={nameKey} className="skill-panel panel-card glass-panel reveal">
              <h3>{t(nameKey, '')}</h3>
              <p>{t(stackKey, '')}</p><Link className="text-link" to={nameKey === 'bsa_cap_delivery' ? '/trajectory' : '/projects/jomgo'}>{t('bsa_evidence')} <ArrowUpRight size={14} /></Link>
            </article>
          ))}
        </Box>
      </section>

      <GitHubRepos
        profile={github.profile}
        repos={github.repos}
        loading={github.loading}
        error={github.error}
        rateLimit={github.rateLimit}
        fromCache={github.fromCache}
      />
    </PageShell>
  )
}
