import { ArrowUpRight, GitBranch, Route, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectBusinessValue } from './ProjectBusinessValue'
import { TechStackBadges } from './TechStackBadges'
import { useI18n } from '../context/I18nProvider'

export function CaseStudyTeaser({ featured = false }) {
  const { t } = useI18n()
  return <article className={`case-teaser${featured ? ' case-teaser--featured' : ''}`}>
    <div>{featured && <time className="project-feature__meta" dateTime="2026-03">{t('proj_jomgo_period')}</time>}<p className="eyebrow">{t('bsa_primary')}</p><h2>{t('bsa_jomgo_short')}</h2><p>{t('bsa_jomgo_desc')}</p><ProjectBusinessValue project="jomgo" />
      {featured && <div className="case-teaser__details">
        <section><h3>{t('bsa_functional')}</h3><p>{t('bsa_functional_body')}</p></section>
        <section><h3>{t('bsa_role')}</h3><p>{t('bsa_role_body')}</p></section>
        <section><h3>{t('bsa_evidence_title')}</h3><p>{t('bsa_evidence_intro')}</p></section>
        <TechStackBadges techString={t('bsa_jomgo_tech')} />
      </div>}
      <div className="case-teaser__actions"><Link to="/projects/jomgo" className="primary-cta" data-cursor="view">{t('bsa_case')}<ArrowUpRight size={18} /></Link><a href="https://jomgo.pages.dev/" className="text-link" target="_blank" rel="noreferrer">{t('bsa_live')}<ArrowUpRight size={18} /></a></div></div>
    <Link to="/projects/jomgo" className="case-teaser__map" data-cursor="view" aria-label={t('bsa_jomgo_title')}><span className="eyebrow">JOMGO / {t('bsa_lifecycle')}</span><div><Route size={24} /><span>BR-01</span><i /><GitBranch size={24} /><span>FR-01</span><i /><ScanLine size={24} /><span>UAT-01</span></div><span>{t('bsa_evidence_title')} <ArrowUpRight size={18} /></span></Link>
  </article>
}
