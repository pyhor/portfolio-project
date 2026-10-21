import { ArrowDown, ArrowUpRight, Code2, GraduationCap, HeartHandshake, Layers, Route, ShieldCheck, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroTypography } from '../components/HeroTypography'
import { ProjectShowcase } from '../components/ProjectShowcase'
import { AccentText } from '../components/AccentText'
import { useChapterMotion } from '../hooks/useChapterMotion'
import { HomeSectionPreview } from '../components/HomeSectionPreview'
import { Magnetic } from '../components/Magnetic'
import { PageShell } from '../components/PageShell'
import { useI18n } from '../context/I18nProvider'
import { useGithubData } from '../hooks/useGithubData'
import { SystemOverview } from '../components/SystemOverview'
import { BusinessWorkflow } from '../components/BusinessWorkflow'
import { ContactSection } from '../components/ContactSection'
import { EngineeringStudy } from '../components/EngineeringStudy'
import { InnovationSection } from '../components/InnovationSection'
import { OptionalStudy } from '../components/OptionalStudy'

const CAPABILITIES = [
  { icon: Layers, id: 'systems', titleKey: 'build_card_1_title', descKey: 'build_card_1_desc' },
  { icon: Code2, id: 'frontend', titleKey: 'build_card_2_title', descKey: 'build_card_2_desc' },
  { icon: ShieldCheck, id: 'quality', titleKey: 'ref_quality_title', descKey: 'ref_quality_body' },
  { icon: Wrench, id: 'delivery', titleKey: 'build_card_3_title', descKey: 'build_card_3_desc' },
]

export function HomePage() {
  const { t, lang } = useI18n()
  useChapterMotion(lang)
  const github = useGithubData(12)
  return (
    <PageShell className="home-page">
      <section className="hero" id="home-hero">
        <div className="hero-editorial">
          <p className="eyebrow">{t('ref_portfolio', 'PERSONAL PORTFOLIO / BUSINESS × TECHNOLOGY')}</p>
          <HeroTypography>
            <div className="hero-actions">
              <Magnetic as={Link} to="/projects" className="primary-cta">{t('studio_view_work', 'Explore my work')} <ArrowUpRight size={18} /></Magnetic>
              <Link to="/trajectory" className="text-link">{t('ref_hero_experience', 'Explore my experience')} <ArrowUpRight size={17} /></Link>
            </div>
          </HeroTypography>
          <dl className="hero-facts"><div><dt>{t('ref_based_label', 'BASED IN')}</dt><dd>{t('metric_location', 'Malaysia')}</dd></div><div><dt>{t('ref_background_label', 'BACKGROUND')}</dt><dd>{t('ref_background', 'Enterprise Information Systems')}</dd></div><div><dt>{t('ref_approach_label', 'APPROACH')}</dt><dd>{t('ref_approach', 'Understand → build → verify')}</dd></div></dl>
          <div className="hero-footnote"><span className="status-dot" />{t('ref_availability', 'Open to technology roles, project discussions, and collaboration.')}</div>
        </div>
        <div className="hero-visual"><SystemOverview /><OptionalStudy /></div>
      </section>
      <div className="intro-strip"><span className="intro-strip__location">{t('ref_working_with', 'Working across interfaces, workflows, and quality.')}</span><span className="intro-strip__stack">React <span>/</span> PHP <span>/</span> JavaScript <span>/</span> XAMPP</span><a href="#home-projects" className="scroll-cue" aria-label={t('studio_scroll', 'Scroll to selected work')}><ArrowDown size={18} /></a></div>

      <section className="page-section selected-work" id="home-projects">
        <div className="section-heading"><div><p className="eyebrow">01 — {t('studio_selected', 'SELECTED WORK')}</p><h2 className="section-title"><AccentText>{t('studio_work_heading', 'Real projects. Useful outcomes.')}</AccentText></h2></div><div className="section-heading__aside"><p>{t('ref_projects_intro', 'Independent systems and team-built interfaces. Each project offers a different view of how I connect requirements, implementation, and usability.')}</p><Link to="/projects" className="text-link">{t('studio_all_projects', 'All projects')} <ArrowUpRight size={18} /></Link></div></div>
        <ProjectShowcase />
      </section>
      <BusinessWorkflow />
      <InnovationSection />

      <section className="page-section capabilities-chapter" id="home-build"><div className="section-heading"><div><p className="eyebrow">04 — {t('studio_capabilities', 'WHAT I BRING')}</p><h2 className="section-title"><AccentText>{t('ref_capabilities_heading', 'From a clear requirement to a usable result.')}</AccentText></h2></div><p className="section-heading__note">{t('ref_capabilities_intro', 'A mix of implementation, analysis, and testing — grounded in the projects and experience documented here.')}</p></div><div className="value-grid">{CAPABILITIES.map(({ icon: Icon, id, titleKey, descKey }, i) => <article key={id} className="value-card"><div className="value-card__top"><Icon size={25} strokeWidth={1.4} /><span>0{i + 1}</span></div><h3>{t(titleKey, '')}</h3><p>{t(descKey, '')}</p><div className="capability-evidence"><span>{t('ref_evidence_label', 'IN PRACTICE')}</span><strong>{t(`ref_evidence_${id}`, '')}</strong></div></article>)}</div></section>

      <EngineeringStudy />
      <section className="page-section home-about" id="home-why">
        <div className="about-editorial"><p className="eyebrow">06 — {t('nav_about', 'ABOUT')}</p><span className="about-editorial__name">Pei Yu Hor<span>.</span></span><p>{t('ref_about_anchor', 'A practical builder with an information-systems perspective.')}</p><div className="about-editorial__disciplines"><span>01 / {t('ref_discipline_business', 'Business context')}</span><span>02 / {t('ref_discipline_interface', 'Interface craft')}</span><span>03 / {t('ref_discipline_quality', 'Quality mindset')}</span></div></div>
        <div className="home-about__copy"><h2 className="section-title"><AccentText>{t('studio_about_heading', 'Curiosity, with a practical side.')}</AccentText></h2><p className="page-lede">{t('about_p2', '')}</p><p>{t('ref_about_quality', 'ERP testing taught me to look beyond whether a screen looks finished: check the workflow, question the edge cases, and document what needs to improve.')}</p><p>{t('about_p4', '')}</p><Link to="/about" className="text-link">{t('studio_story', 'Get to know me')} <ArrowUpRight size={18} /></Link><dl className="home-stats"><div><dt>{t('ref_public_repos', 'Public repositories')}</dt><dd>{github.profile?.public_repos ?? '—'}</dd></div><div><dt>{t('studio_since', 'First coding project')}</dt><dd>2019</dd></div><div><dt>{t('ref_qa_context', 'QA context')}</dt><dd>ERP / UAT</dd></div></dl></div>
      </section>

      <section className="page-section" id="home-journey"><div className="section-heading"><div><p className="eyebrow">07 — {t('studio_beyond', 'BEYOND THE CODE')}</p><h2 className="section-title"><AccentText>{t('studio_journey_heading', 'Always moving forward.')}</AccentText></h2></div><p className="section-heading__note">{t('ref_journey_intro', 'The context behind the work: education, professional experience, and contributing to a community.')}</p></div><div className="journey-grid">
        <HomeSectionPreview id="home-trajectory" to="/trajectory" icon={Route} kickerKey="trajectory_kicker" titleKey="nav_trajectory" descKey="home_trajectory_preview_desc" previewKeys={['traj_code_3_period', 'traj_work_1_role']} />
        <HomeSectionPreview id="home-education" to="/education" icon={GraduationCap} kickerKey="education_kicker" titleKey="nav_education" descKey="home_education_preview_desc" previewKeys={['edu_1_degree']} />
        <HomeSectionPreview id="home-volunteering" to="/volunteering" icon={HeartHandshake} kickerKey="volunteering_kicker" titleKey="nav_volunteering" descKey="home_volunteering_preview_desc" previewKeys={['vol_1_title', 'vol_2_title']} />
      </div></section>
      <ContactSection id="home-contact" />
    </PageShell>
  )
}
