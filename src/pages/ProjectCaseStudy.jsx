import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { FeaturedProjectCard } from '../components/FeaturedProjectCard'
import { PageShell } from '../components/PageShell'
import { FEATURED_PROJECTS } from '../data/featuredProjects'
import { useI18n } from '../context/I18nProvider'

export function ProjectCaseStudy() {
  const { slug } = useParams()
  const { t } = useI18n()
  const project = FEATURED_PROJECTS.find(item => item.id === slug)
  if (!project) return <Navigate to="/projects" replace />
  const prefix = project.id.startsWith('hotel') ? 'hotel' : 'cinema'
  return <PageShell className="case-study short-case">
    <section className="page-section"><Link to="/projects" className="text-link">← {t('bsa_back')}</Link><p className="eyebrow">{t(project.metaKey)}</p><h1 className="page-title">{t(project.titleKey)}</h1><p className="page-lede">{t(project.descKey)}</p><aside className="case-evidence-note">{t('bsa_short_note')}</aside></section>
    <section className="page-section"><div className="case-grid">{[
      ['problem',`ref_${prefix}_problem`],['role',`ref_${prefix}_role`],['constraints',`bsa_${prefix}_constraints`],['solution',`bsa_${prefix}_solution`],['technical',`bsa_${prefix}_contribution`],['testing',`bsa_${prefix}_verification`],['learning_short',`bsa_${prefix}_value`],
    ].map(([label,key]) => <article key={label} className="case-card"><h2>{t(`bsa_${label}`)}</h2><p>{t(key)}</p></article>)}</div></section>
    <section className="page-section"><FeaturedProjectCard project={project} /><Link to="/projects/jomgo" className="text-link">{t('bsa_jomgo_title')}<ArrowUpRight size={17} /></Link></section>
  </PageShell>
}
