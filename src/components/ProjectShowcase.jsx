import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'

gsap.registerPlugin(ScrollTrigger)
const SELECTED_PROJECTS = ['jomgo', 'asean-data-2024', 'vet-mgmt-system-2024'].map(id => SHOWCASE_PROJECTS.find(project => project.id === id))

export function ProjectShowcase({ children }) {
  const { t, lang } = useI18n()
  const [desktop, setDesktop] = useState(() => matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches)
  const [openProject, setOpenProject] = useState(null)
  useLayoutEffect(() => {
    const media = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)')
    const update = () => { setDesktop(media.matches); setOpenProject(null) }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const triggerRef = useRef(null)
  const indexRef = useRef(0)
  const count = SELECTED_PROJECTS.length + (desktop ? 2 : 1)
  const distance = () => Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
  const browse = index => {
    const next = Math.max(0, Math.min(count - 1, index))
    const trigger = triggerRef.current
    if (!desktop) {
      viewportRef.current.scrollTo({ left: trackRef.current.children[next]?.offsetLeft || 0, behavior: 'smooth' })
      return
    }
    if (!trigger) return
    const progress = Math.min(distance(), trackRef.current.children[next].offsetLeft) / Math.max(1, distance())
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  useLayoutEffect(() => {
    if (!desktop) return
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
            const offset = distance() * self.progress
            const slides = [...trackRef.current.children]
            indexRef.current = self.progress >= .999 ? count - 1 : slides.reduce((nearest, slide, index) => Math.abs(slide.offsetLeft - offset) < Math.abs(slides[nearest].offsetLeft - offset) ? index : nearest, 0)
          },
        },
      })
      triggerRef.current = tween.scrollTrigger
    }, section)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { window.removeEventListener('load', refresh); triggerRef.current = null; context.revert() }
  }, [lang, count, desktop])

  return <div className={`project-showcase project-showcase--pinned${desktop ? '' : ' project-showcase--swipe'}`}>
    {!desktop && <div className="showcase-mobile-intro">{children}</div>}
    <p id="showcase-help" className="sr-only">{t('home_showcase_hint')}</p>
    <div className="showcase-viewport" id="project-rail" ref={viewportRef} tabIndex={0} role="region" aria-label={t('showcase_label')} aria-describedby="showcase-help" onFocusCapture={event => {
      if (!desktop) return
      const card = event.target.closest('[data-showcase-slide]')
      if (!card) return
      viewportRef.current.scrollLeft = 0
      browse([...trackRef.current.children].indexOf(card))
    }} onKeyDown={event => {
      if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      if (!desktop) indexRef.current = [...trackRef.current.children].reduce((nearest, slide, index, slides) => Math.abs(slide.offsetLeft - viewportRef.current.scrollLeft) < Math.abs(slides[nearest].offsetLeft - viewportRef.current.scrollLeft) ? index : nearest, 0)
      browse(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : indexRef.current + (event.key === 'ArrowRight' ? 1 : -1))
    }}>
      <div className="showcase-track" ref={trackRef}>
        {desktop && <div className="showcase-intro" data-showcase-slide>{children}</div>}
        {SELECTED_PROJECTS.map(project => <article className={`showcase-project${openProject === project.id ? ' is-details-open' : ''}`} key={project.id} data-project={project.id} data-showcase-slide
          onPointerEnter={() => { if (desktop) setOpenProject(project.id) }}
          onPointerLeave={event => { if (desktop && !event.currentTarget.contains(document.activeElement)) setOpenProject(null) }}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenProject(null) }}
          onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.querySelector('button').focus(); setOpenProject(null) } }}>
          <button className="showcase-project__reveal" type="button" aria-label={t(project.id === 'jomgo' ? 'home_jomgo_title' : project.id === 'asean-data-2024' ? 'home_asean_title' : project.titleKey)} aria-expanded={openProject === project.id} aria-controls={`showcase-details-${project.id}`}
            onFocus={() => { if (desktop) setOpenProject(project.id) }}
            onClick={() => setOpenProject(current => current === project.id ? null : project.id)} />
          <img className="showcase-project__background" src={project.backgroundImage} alt="" aria-hidden="true" loading="lazy" />
          <a className="showcase-project__open" href={project.liveUrl || project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${t('studio_open_project')}: ${t(project.id === 'jomgo' ? 'home_jomgo_title' : project.id === 'asean-data-2024' ? 'home_asean_title' : project.titleKey)}`}><ArrowUpRight size={22} /></a>
          <div className="showcase-project__body" id={`showcase-details-${project.id}`} onClick={event => { if (!desktop && !event.target.closest('a')) setOpenProject(null) }}><div className="showcase-project__copy">
            <h3><Link to={project.casePath || '/projects'} data-cursor="view">{t(project.id === 'jomgo' ? 'home_jomgo_title' : project.id === 'asean-data-2024' ? 'home_asean_title' : project.titleKey)}</Link></h3>
            <p className="showcase-project__benefit">{t(`home_${project.id === 'jomgo' ? 'jomgo' : project.id === 'asean-data-2024' ? 'asean' : 'vet'}_benefit`)}</p>
            <TechStackBadges techString={t(project.techKey)} />
            <Link className="showcase-project__learn" to={project.casePath || '/projects'}>{t('showcase_learn_more')} <ArrowUpRight size={18} /></Link>
          </div></div>
        </article>)}
        <article className="showcase-project showcase-project--all" data-showcase-slide>
          <Link to="/projects" className="showcase-all-link"><h3>{t('studio_all_projects')}</h3><span>{t('nav_projects')}<ArrowUpRight size={24} /></span></Link>
        </article>
      </div>
    </div>
  </div>
}
