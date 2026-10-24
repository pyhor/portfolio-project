import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'
import { projectWheelStep } from '../lib/projectScroll'

const PROJECT_COPY = { jomgo: 'jomgo', 'hotel-website-2023': 'hotel', 'cinema-mgmt-system-2020': 'cinema', 'vet-mgmt-system-2024': 'vet', 'asean-data-2024': 'asean' }

export function ProjectShowcase() {
  const { t } = useI18n()
  const viewportRef = useRef(null)
  const indexRef = useRef(0)
  const wheelRef = useRef({ index: 0, lastEventAt: -Infinity, direction: 0, handled: false })
  const [active, setActive] = useState(0)
  const count = SHOWCASE_PROJECTS.length
  const stride = () => viewportRef.current.clientWidth + 24
  const browse = index => {
    const next = Math.max(0, Math.min(count - 1, index))
    indexRef.current = next
    wheelRef.current.index = next
    setActive(next)
    viewportRef.current.scrollTo({ left: next * stride(), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const syncActive = () => {
    const index = Math.max(0, Math.min(count - 1, Math.round(viewportRef.current.scrollLeft / stride())))
    indexRef.current = index
    setActive(index)
  }
  useEffect(() => {
    const viewport = viewportRef.current
    const wheel = event => {
      if (event.ctrlKey) return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      const now = performance.now()
      if (now - wheelRef.current.lastEventAt > 220) wheelRef.current.index = indexRef.current
      const previous = wheelRef.current.index
      const next = projectWheelStep(wheelRef.current, delta, now, count)
      wheelRef.current = next
      if (next.consume) event.preventDefault()
      if (next.index !== previous) {
        indexRef.current = next.index
        setActive(next.index)
        viewport.scrollTo({ left: next.index * (viewport.clientWidth + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      }
    }
    const resize = new ResizeObserver(() => viewport.scrollTo({ left: indexRef.current * (viewport.clientWidth + 24), behavior: 'instant' }))
    resize.observe(viewport)
    viewport.addEventListener('wheel', wheel, { passive: false })
    return () => { resize.disconnect(); viewport.removeEventListener('wheel', wheel) }
  }, [count])

  return <div className="project-showcase project-showcase--stepped">
    <div className="showcase-controls"><p id="showcase-help">{t('home_showcase_hint')}</p><div>
      <button type="button" disabled={active === 0} onClick={() => browse(indexRef.current - 1)} aria-label={t('showcase_previous')} aria-controls="project-rail"><ArrowLeft size={17} /></button>
      <span className="showcase-count" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      <button type="button" disabled={active === count - 1} onClick={() => browse(indexRef.current + 1)} aria-label={t('showcase_next')} aria-controls="project-rail"><ArrowRight size={17} /></button>
    </div></div>
    <div className="showcase-viewport" id="project-rail" ref={viewportRef} tabIndex={0} onScroll={syncActive} role="region" aria-label={t('showcase_label')} aria-describedby="showcase-help" onKeyDown={event => {
      if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      browse(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : indexRef.current + (event.key === 'ArrowRight' ? 1 : -1))
    }}>
      <div className="showcase-track">
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
