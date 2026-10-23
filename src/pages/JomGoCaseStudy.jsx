import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { CaseSection, Flow, Metadata, SourceLink, Status } from '../components/CaseStudyParts'
import { RequirementLifecycle } from '../components/RequirementLifecycle'
import { useArtifactNavigation } from '../hooks/useArtifactNavigation'
import { useI18n } from '../context/I18nProvider'
import study from '../data/jomgoCaseStudy.json'

const chapterGroups = [
  { titleKey: 'case_menu_understand', chapters: ['problem', 'stakeholders', 'process'] },
  { titleKey: 'case_menu_define', chapters: ['requirements', 'stories', 'systems'] },
  { titleKey: 'case_menu_verify', chapters: ['verification', 'lifecycle', 'decisions', 'value'] },
]
const evidence = ['process','requirements','stories','systems','verification','lifecycle']

export function JomGoCaseStudy() {
  useArtifactNavigation()
  const { t } = useI18n()
  return <PageShell className="case-study case-study--document">
    <div className="case-document">
      <aside className="case-document__sidebar">
        <a className="case-document__identity" href="#case-introduction"><strong>JomGo</strong><span>{t('bsa_primary')}</span></a>
        <div className="case-document__menu">
          <p className="case-menu-caption">{t('bsa_nav_label')}</p>
          <nav className="case-nav" aria-label={t('bsa_nav_label')}>
            {chapterGroups.map(group => <div className="case-menu-group" key={group.titleKey}>
              <h2>{t(group.titleKey)}</h2>
              {group.chapters.map(id => {
                const label = t(`bsa_${id}`)
                const slash = label.indexOf('/')
                return <a key={id} href={`#${id}`}><span className="case-menu-number">{label.slice(0, slash).trim()}</span><span>{label.slice(slash + 1).trim()}</span></a>
              })}
            </div>)}
          </nav>
        </div>
      </aside>
      <div className="case-document__content">
    <section className="page-section case-hero" id="case-introduction">
      <Link to="/projects" className="text-link">← {t('bsa_back')}</Link><p className="eyebrow">{t('bsa_primary')}</p>
      <h1 className="page-title">{t('bsa_jomgo_title')}</h1><p className="page-lede">{t('bsa_jomgo_desc')}</p>
      <div className="case-hero__actions"><a href="#lifecycle" className="primary-cta">{t('bsa_lifecycle_title')}<ArrowDown size={17} /></a><a href="https://jomgo.pages.dev/" target="_blank" rel="noreferrer" className="text-link">{t('bsa_live')}<ArrowUpRight size={17} /></a><a href="https://github.com/pyhor/JomGo-web" target="_blank" rel="noreferrer" className="text-link">GitHub<ArrowUpRight size={17} /></a></div>
      <aside className="case-evidence-note">{t('bsa_evidence_note')}</aside>
      <details className="case-disclosure"><summary>{t('bsa_role')}</summary><p>{t('bsa_role_body')}</p><SourceLink path="README.md" /></details>
      <div className="case-overview"><h2>{t('bsa_evidence_title')}</h2><p>{t('bsa_evidence_intro')}</p><div>{evidence.map(id => <a key={id} href={`#${id}`} data-cursor="explore">{t(`bsa_overview_${id}`)}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</div></div>
    </section>
    <CaseSection id="problem"><Status value="proposed" /><p className="case-label">{t('bsa_hypothesis')}</p><p className="case-lead">{t('bsa_problem_body')}</p><div className="case-grid case-grid--three">{['affected','why','opportunity'].map(id => <article className="case-card" key={id}><h3>{t(`bsa_${id}`)}</h3><p>{t(`bsa_${id}_body`)}</p></article>)}</div><div className="case-reasoning">{['observation','assumption','evidence','requirement','solution'].map(id => <article key={id}><h3>{t(`bsa_${id}`)}</h3><p>{t(`bsa_${id}_body`)}</p></article>)}</div><SourceLink path="src/routes/search.tsx" /></CaseSection>
    <CaseSection id="stakeholders" introKey="bsa_stakeholders_note"><div className="case-grid">{study.stakeholders.map(item => <article className="case-card" key={item.id}><span className="eyebrow">{t(item.role)}</span><h3>{t(item.title)}</h3><Metadata rows={['need','pain','interaction'].map(label => [label,t(item[label])])} /></article>)}</div></CaseSection>
    <CaseSection id="process" introKey="bsa_process_note"><div className="case-grid"><article className="case-card"><h3>{t('bsa_asis')}</h3><Flow steps={study.asis} label={t('bsa_asis')} /></article><article className="case-card case-card--accent"><h3>{t('bsa_tobe')}</h3><Flow steps={study.tobe} label={t('bsa_tobe')} /><SourceLink path="src/routes/search.tsx" /></article></div><h3 className="case-subtitle">{t('bsa_gap_title')}</h3><div className="case-grid">{study.gaps.map(item => <article className="case-card" key={item.id}><Status value={item.status} /><Metadata rows={['current','gap','desired'].map(label => [label,t(item[label])]).concat([['solution',t(item.response)]])} /></article>)}</div></CaseSection>
    <CaseSection id="requirements" introKey="bsa_catalog_note"><div className="case-grid"><article className="case-card"><h3>{t('bsa_functional')}</h3><p>{t('bsa_functional_body')}</p></article><article className="case-card"><h3>{t('bsa_nonfunctional')}</h3><p>{t('bsa_nonfunctional_body')}</p></article></div><h3 className="case-subtitle">{t('bsa_catalog')}</h3><div className="case-status-legend">{['implemented','in-progress','planned','proposed','out-of-scope'].map(value => <Status key={value} value={value} />)}</div><p className="case-note">{t('bsa_status_note')}</p><div className="requirements-catalog">{study.requirements.map(item => <details className="case-disclosure requirement-item" id={item.id} key={item.id}><summary><span className="requirement-id">{item.id}</span><span>{t(item.description)}</span><Status value={item.status} /></summary><Metadata rows={[
      ['type',t(`bsa_${item.type}`)],['priority',t(`bsa_${item.priority}`)],['reason',t(item.reason)],['feature',<SourceLink path={item.source} />],['story',item.story ? <a href={`#${item.story}`}>{item.story}</a> : '—'],['uat',item.uat ? <a href={`#${item.uat}`}>{item.uat}</a> : '—'],
    ]} /><SourceLink path={item.source} /></details>)}</div><h3 className="case-subtitle">{t('bsa_moscow')}</h3><p className="case-note">{t('bsa_moscow_note')}</p><div className="case-grid">{['must','should','could','wont'].map(id => <article className="case-card" key={id}><h3>{t(`bsa_${id}`)}</h3><p>{t(`bsa_${id}_body`)}</p></article>)}</div></CaseSection>
    <CaseSection id="stories"><div className="case-stories">{study.stories.map(item => <details className="case-disclosure" key={item.id} id={item.id}><summary><span className="requirement-id">{item.id}</span>{t(item.title)}<span className="case-note">{item.requirement} ↔ {item.uat}</span></summary><p className="case-lead">{t(item.body)}</p><h3>{t('bsa_ac')}</h3><Metadata rows={['given','when','then'].map(label => [label,t(item[label])])} /><SourceLink path={item.source} /><a className="text-link" href={`#${item.uat}`}>{item.uat} → {t('bsa_uat')}</a></details>)}</div><h3 className="case-subtitle">{t('bsa_rules')}</h3><p className="case-note">{t('bsa_rules_note')}</p><div className="case-grid case-grid--three">{study.rules.map(item => <article className="case-card" key={item.id}><h3>{item.id}</h3><p>{t(item.description)}</p><SourceLink path={item.source} /></article>)}</div></CaseSection>
    <CaseSection id="systems"><h3 className="case-subtitle">{t('bsa_context')}</h3><p>{t('bsa_context_note')}</p><div className="case-context"><div className="case-context__boundary"><span className="eyebrow">{t('bsa_solution')}</span><strong>JomGo</strong><p>React / TanStack · GTFS · Leaflet</p></div><div className="case-context__actors">{study.actors.map(item => <article key={item.id}><span aria-hidden="true">↔</span><div><h4>{t(item.title)}</h4><p>{t(item.body)}</p></div></article>)}</div></div><h3 className="case-subtitle">{t('bsa_architecture')}</h3><p>{t('bsa_architecture_note')}</p><figure className="architecture-map" aria-label={t('bsa_architecture')}><div className="architecture-map__client">{t('bsa_arch_client')}</div><div className="architecture-map__branches">{['local','public','server','cloud'].map(id => <div key={id}><span aria-hidden="true">↕</span><h4>{t(`bsa_arch_${id}`)}</h4><p>{t(`bsa_arch_${id}_detail`)}</p></div>)}</div></figure><div className="case-architecture">{study.layers.map((item,index) => <article key={item.id} className="case-card"><span className="case-flow__number">0{index+1}</span><h4>{t(item.title)}</h4><p>{t(item.body)}</p><SourceLink path={item.source} /></article>)}</div><h3 className="case-subtitle">{t('bsa_dataflow')}</h3><div className="case-card case-live-flow"><Flow steps={study.flow} label={t('bsa_dataflow')} /><aside className="case-evidence-note">{t('bsa_dataflow_note')}</aside><SourceLink path="src/lib/transit/realtime-client.ts" /></div><h3 className="case-subtitle">{t('bsa_integrations')}</h3><div className="case-grid">{study.integrations.map(item => <details className="case-disclosure" key={item.id}><summary>{t(item.title)}</summary><Metadata rows={['input','output','validation','failure','dependency'].map(label => [label,t(item[label])])} /><SourceLink path={item.source} /></details>)}</div></CaseSection>
    <CaseSection id="verification" titleKey="bsa_uat_title" introKey="bsa_uat_note"><div className="case-grid">{study.uat.map(item => <article className="case-card" key={item.id} id={item.id}><div className="case-card__top"><h3>{item.id}</h3><Status value={item.status} /></div><a href={`#${item.requirement}`} className="text-link">{item.requirement}</a><Metadata rows={['scenario','expected'].map(label => [label,t(item[label])])} /></article>)}</div><h3 className="case-subtitle">{t('bsa_edge_title')}</h3><div className="case-grid">{study.edges.map(item => <article className="case-card" key={item.id}><h4>{t(item.title)}</h4><p>{t(item.body)}</p></article>)}</div></CaseSection>
    <CaseSection id="lifecycle" titleKey="bsa_lifecycle_title" introKey="bsa_lifecycle_note"><RequirementLifecycle /></CaseSection>
    <CaseSection id="decisions" introKey="bsa_decisions_note"><div className="case-grid case-grid--three">{study.decisions.map(item => <article className="case-card" key={item.id}><h3>{t(item.title)}</h3><Metadata rows={['why','alternative','tradeoff'].map(label => [label,t(item[label])])} /><SourceLink path={item.source} /></article>)}</div><h3 className="case-subtitle">{t('bsa_scope')}</h3><div className="case-grid">{['inscope','outscope'].map(id => <article className="case-card" key={id}><h4>{t(`bsa_${id}`)}</h4><p>{t(id === 'inscope' ? 'bsa_inscope_body' : 'bsa_wont_body')}</p></article>)}</div><h3 className="case-subtitle">{t('bsa_risks')}</h3><div className="case-grid">{study.risks.map(item => <article className="case-card" key={item.id}><h4>{t(item.title)}</h4><Metadata rows={['impact','mitigation'].map(label => [label,t(item[label])])} /></article>)}</div></CaseSection>
    <CaseSection id="value" titleKey="bsa_value_title" introKey="bsa_value_note"><div className="case-grid case-grid--three">{study.values.map(item => <article className="case-card" key={item.id}><h3>{t(item.title)}</h3><Metadata rows={['output','outcome'].map(label => [label,t(item[label])]).concat([['product_value',t(item.value)]])} /></article>)}</div><h3 className="case-subtitle">{t('bsa_future')}</h3><div className="case-grid">{study.future.map(item => <article className="case-card" key={item.id}><div className="case-card__top"><Status value={item.status} /><span className="case-note">{t(`bsa_${item.priority}`)}</span></div><h4>{t(item.title)}</h4><p>{t(item.body)}</p></article>)}</div><div className="case-learning"><h3>{t('bsa_learning')}</h3><p>{t('bsa_learning_body')}</p><Link to="/projects" className="text-link">{t('bsa_back')} <ArrowUpRight size={17} /></Link></div></CaseSection>
      </div>
    </div>
  </PageShell>
}
