import { ArrowDown, ArrowUpRight, Code2, GraduationCap, HeartHandshake, Layers, Route, Sparkles, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroTypography } from '../components/HeroTypography'
import { FeaturedProjectCard } from '../components/FeaturedProjectCard'
import { HomeSectionPreview } from '../components/HomeSectionPreview'
import { Magnetic } from '../components/Magnetic'
import { PageShell } from '../components/PageShell'
import { FEATURED_PROJECTS } from '../data/featuredProjects'
import { useI18n } from '../context/I18nProvider'
import { useGithubData } from '../hooks/useGithubData'
import { DeferredScene } from '../components/DeferredScene'
import { SystemOverview } from '../components/SystemOverview'
import { BusinessWorkflow } from '../components/BusinessWorkflow'
import { CONTACT_EMAIL } from '../components/ContactSection'

const CAPABILITIES = [
  { icon: Layers, titleKey: 'build_card_1_title', descKey: 'build_card_1_desc' },
  { icon: Sparkles, titleKey: 'build_card_2_title', descKey: 'build_card_2_desc' },
  { icon: Wrench, titleKey: 'build_card_3_title', descKey: 'build_card_3_desc' },
  { icon: Code2, titleKey: 'build_card_4_title', descKey: 'build_card_4_desc' },
]

export function HomePage() {
  const { t } = useI18n()
  const github = useGithubData(12)
  return (
    <PageShell className="home-page">
      <section className="hero" id="home-hero">
        <div className="hero-editorial">
          <p className="eyebrow">{t('studio_portfolio', 'PEOPLE. PROCESS. PURPOSEFUL TECHNOLOGY.')}</p>
          <HeroTypography>
            <div className="hero-actions">
              <Magnetic as={Link} to="/projects" className="primary-cta">{t('studio_view_work', 'Explore my work')} <ArrowUpRight size={18} /></Magnetic>
              <Link to="/about" className="text-link">{t('studio_about', 'A little about me')} <ArrowUpRight size={17} /></Link>
            </div>
          </HeroTypography>
          <div className="hero-footnote"><span className="status-dot" />{t('signal_title', 'Open to ambitious web builds')}</div>
        </div>
        <SystemOverview />
      </section>

      <div className="intro-strip">
        <span className="intro-strip__location"><span className="location-symbol" aria-hidden="true">↗</span> {t('studio_based', 'Based in Malaysia. Building for the web.')}</span>
        <span className="intro-strip__stack">React <span>/</span> PHP <span>/</span> JavaScript <span>/</span> Three.js</span>
        <a href="#home-projects" className="scroll-cue" aria-label={t('studio_scroll', 'Scroll to selected work')}><ArrowDown size={18} /></a>
      </div>

      <section className="page-section selected-work" id="home-projects">
        <div className="section-heading reveal">
          <div><p className="eyebrow">01 — {t('studio_selected', 'SELECTED WORK')}</p><h2 className="section-title">{t('studio_work_heading', 'Ideas, made real.')}</h2></div>
          <Link to="/projects" className="text-link">{t('studio_all_projects', 'All projects')} <ArrowUpRight size={18} /></Link>
        </div>
        <div className="home-project-grid">{FEATURED_PROJECTS.map((project, index) => <FeaturedProjectCard key={project.id} project={project} compact index={index} />)}</div>
      </section>

      <BusinessWorkflow />

      <section className="page-section home-about" id="home-why">
        <div className="about-stamp" aria-hidden="true"><span>pyhor</span><Code2 strokeWidth={1} /><span>CURIOUS BY NATURE.</span></div>
        <div className="home-about__copy reveal"><p className="eyebrow">03 — {t('nav_about', 'ABOUT')}</p><h2 className="section-title">{t('studio_about_heading', 'A curious mind. A builder at heart.')}</h2><p className="page-lede">{t('about_p2', '')}</p><p>{t('about_p4', '')}</p><Link to="/about" className="text-link">{t('studio_story', 'Get to know me')} <ArrowUpRight size={18} /></Link></div>
        <div className="home-stats"><div><strong>{github.profile?.public_repos ?? '—'}</strong><span>{t('metric_repos', 'repos')}</span></div><div><strong>2020</strong><span>{t('studio_since', 'First coding project')}</span></div><div><strong>5</strong><span>{t('languages_kicker', 'Languages')}</span></div></div>
      </section>

      <section className="page-section" id="home-build">
        <div className="section-heading reveal"><div><p className="eyebrow">04 — {t('studio_capabilities', 'WHAT I BRING')}</p><h2 className="section-title">{t('studio_build_heading', 'Built with purpose.')}</h2></div><p className="section-heading__note">{t('hero_value_line', '')}</p></div>
        <div className="value-grid">{CAPABILITIES.map(({icon: Icon, titleKey, descKey}, i) => <article key={titleKey} className="value-card reveal"><div className="value-card__top"><Icon size={24} strokeWidth={1.4} /><span>0{i + 1}</span></div><h3>{t(titleKey, '')}</h3><p>{t(descKey, '')}</p></article>)}</div>
      </section>

      <section className="page-section interaction-lab" id="home-playground" aria-labelledby="lab-heading">
        <div className="interaction-lab__copy"><p className="eyebrow">05 — {t('lab_kicker', 'A LITTLE CREATIVE ENGINEERING')}</p><h2 id="lab-heading" className="section-title">{t('lab_heading', 'Serious about details. Curious about possibilities.')}</h2><p>{t('lab_body', 'Good interfaces respond to people. This small 3D study explores the same idea: clear feedback, a little depth, and room to play.')}</p><ul className="lab-notes"><li><span>01</span>{t('lab_note_1', 'Drag horizontally to rotate. Scroll vertically as usual.')}</li><li><span>02</span>{t('lab_note_2', 'Switch between the finished surface and its structure.')}</li><li><span>03</span>{t('lab_note_3', 'Prefer a still view? Pause it. Arrow keys work, too.')}</li></ul><span className="lab-caption">{t('lab_caption', 'THREE.JS / REAL-TIME INTERACTION / RESPONSIVE BY DESIGN')}</span></div>
        <DeferredScene />
      </section>

      <section className="page-section" id="home-journey"><div className="section-heading reveal"><div><p className="eyebrow">06 — {t('studio_beyond', 'BEYOND THE CODE')}</p><h2 className="section-title">{t('studio_journey_heading', 'Always moving forward.')}</h2></div></div><div className="journey-grid">
        <HomeSectionPreview id="home-trajectory" to="/trajectory" icon={Route} kickerKey="trajectory_kicker" titleKey="nav_trajectory" descKey="home_trajectory_preview_desc" />
        <HomeSectionPreview id="home-education" to="/education" icon={GraduationCap} kickerKey="education_kicker" titleKey="nav_education" descKey="home_education_preview_desc" />
        <HomeSectionPreview id="home-volunteering" to="/volunteering" icon={HeartHandshake} kickerKey="volunteering_kicker" titleKey="nav_volunteering" descKey="home_volunteering_preview_desc" />
      </div></section>

      <section className="home-contact reveal" id="home-contact"><p className="eyebrow">{t('contact_eyebrow', 'LET’S CONNECT')}</p><div className="home-contact__row"><h2>{t('studio_contact_heading', 'Let’s make something matter.')}</h2><Link className="contact-orbit" to="/contact" aria-label={t('nav_contact', 'Contact')}><ArrowUpRight size={50} strokeWidth={1.2} /></Link></div><div className="home-contact__bottom"><p>{t('contact_body', '')}</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <ArrowUpRight size={16} /></a></div></section>
    </PageShell>
  )
}
