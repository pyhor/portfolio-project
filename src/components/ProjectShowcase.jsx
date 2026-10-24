import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'

gsap.registerPlugin(ScrollTrigger)
const PROJECT_COPY = { jomgo: 'jomgo', 'hotel-website-2023': 'hotel', 'cinema-mgmt-system-2020': 'cinema', 'vet-mgmt-system-2024': 'vet', 'asean-data-2024': 'asean' }

export function ProjectShowcase() {
  const { t, lang } = useI18n()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const triggerRef = useRef(null)
  const indexRef = useRef(0)
  const [active, setActive] = useState(0)
  const count = SHOWCASE_PROJECTS.length
  const distance = () => Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
  const stride = () => trackRef.current.firstElementChild.offsetWidth + 24
  const browse = index => {
    const next = Math.max(0, Math.min(count - 1, index))
    const trigger = triggerRef.current
    if (!trigger) return
    const progress = Math.min(distance(), next * stride()) / Math.max(1, distance())
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  useLayoutEffect(() => {
    const section = viewportRef.current.closest('.selected-work')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      const tween = gsap.to(trackRef.current, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => `+=${Math.max(innerHeight, distance())}`,
          pin: true, pinSpacing: true, scrub: reduced ? true : .35,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => {
            const index = self.progress >= .999 ? count - 1 : Math.min(count - 1, Math.round(distance() * self.progress / stride()))
            indexRef.current = index
            setActive(index)
          },
        },
      })
      triggerRef.current = tween.scrollTrigger
    }, section)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { window.removeEventListener('load', refresh); triggerRef.current = null; context.revert() }
  }, [lang, count])

  return <div className="project-showcase project-showcase--pinned">
    <div className="showcase-controls"><p id="showcase-help">{t('home_showcase_hint')}</p><div>
      <button type="button" disabled={active === 0} onClick={() => browse(indexRef.current - 1)} aria-label={t('showcase_previous')} aria-controls="project-rail"><ArrowLeft size={17} /></button>
      <span className="showcase-count" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      <button type="button" disabled={active === count - 1} onClick={() => browse(indexRef.current + 1)} aria-label={t('showcase_next')} aria-controls="project-rail"><ArrowRight size={17} /></button>
    </div></div>
    <div className="showcase-viewport" id="project-rail" ref={viewportRef} tabIndex={0} role="region" aria-label={t('showcase_label')} aria-describedby="showcase-help" onFocusCapture={event => {
      const card = event.target.closest('.showcase-project')
      if (!card) return
      viewportRef.current.scrollLeft = 0
      browse([...trackRef.current.children].indexOf(card))
    }} onKeyDown={event => {
      if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      browse(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : indexRef.current + (event.key === 'ArrowRight' ? 1 : -1))
    }}>
      <div className="showcase-track" ref={trackRef}>
        {SHOWCASE_PROJECTS.map((project, index) => <article className="showcase-project" key={project.id} data-project={project.id}>
          <img className="showcase-project__background" src={project.backgroundImage || project.media?.[0]} alt="" aria-hidden="true" loading="lazy" />
          <div className="showcase-project__body"><div className="showcase-project__copy">
            <span className="eyebrow">0{index + 1} / {t(project.categoryKey)}</span>
            <h3><Link to={project.casePath || '/projects'} data-cursor="view">{t(project.id === 'jomgo' ? 'home_jomgo_title' : project.id === 'asean-data-2024' ? 'home_asean_title' : project.titleKey)}</Link></h3>
            <p>{t(`home_${PROJECT_COPY[project.id]}_intro`)}</p>
            <p className="showcase-project__value"><mark>{t(`home_${PROJECT_COPY[project.id]}_benefit_compact`)}</mark></p>
            <TechStackBadges techString={t(project.techKey)} />
            <div className="showcase-project__links">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{t(project.id === 'asean-data-2024' ? 'home_project_presentation_short' : 'home_project_live_short')} <ArrowUpRight size={14} /></a>}<Link to={project.casePath || '/projects'} data-cursor="view">{t('home_project_details_short')}<ArrowUpRight size={14} /></Link></div>
          </div></div>
        </article>)}
      </div>
    </div>
  </div>
}
