import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'
import { loopCardWidth, loopPosition } from '../lib/showcase'

const PROJECT_COPY = { jomgo: 'jomgo', 'hotel-website-2023': 'hotel', 'cinema-mgmt-system-2020': 'cinema', 'vet-mgmt-system-2024': 'vet', 'asean-data-2024': 'asean' }

export function ProjectShowcase() {
  const { t, lang } = useI18n()
  const viewportRef = useRef(null)
  const phaseRef = useRef(0)
  const controlsRef = useRef(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current
    const root = viewport.parentElement
    const track = viewport.firstElementChild
    const cards = [...track.children]
    const media = matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0, last = 0, stride = 1, gutter = 0, visible = false
    let focused = root.contains(document.activeElement), pointerInput = false
    const paint = () => cards.forEach((card, index) => {
      card.style.transform = `translate3d(${loopPosition(index, phaseRef.current, stride, cards.length, gutter)}px,0,0)`
    })
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; viewport.dataset.running = 'false' }
    const animate = (time) => {
      if (last) phaseRef.current = (phaseRef.current + Math.min(time - last, 48) * .023) % (stride * cards.length)
      last = time
      paint()
      frame = requestAnimationFrame(animate)
    }
    const sync = () => {
      if (media.matches && visible && !paused && !focused && !document.hidden) {
        viewport.dataset.running = 'true'
        if (!frame) frame = requestAnimationFrame(animate)
      } else stop()
    }
    const measure = () => {
      viewport.classList.toggle('is-looping', media.matches)
      cards.forEach(card => {
        if (media.matches) card.style.width = `${loopCardWidth(viewport.clientWidth, cards.length)}px`
        else card.style.removeProperty('width')
      })
      cards.forEach(card => { card.style.height = '' })
      const height = Math.ceil(Math.max(...cards.map(card => card.getBoundingClientRect().height)))
      cards.forEach(card => { card.style.height = `${height}px` })
      if (media.matches) {
        stride = cards[0].offsetWidth + 24
        gutter = parseFloat(getComputedStyle(viewport).paddingLeft) || 0
        track.style.height = `${Math.max(...cards.map(card => card.offsetHeight))}px`
        paint()
      } else {
        track.style.removeProperty('height')
        cards.forEach(card => card.style.removeProperty('transform'))
      }
      sync()
    }
    const focus = (event) => {
      focused = !pointerInput
      if (media.matches) {
        const index = cards.findIndex(card => card.contains(event.target))
        if (index >= 0) { phaseRef.current = index * stride; viewport.scrollLeft = 0; paint() }
      }
      sync()
    }
    const blur = (event) => { focused = !pointerInput && root.contains(event.relatedTarget); sync() }
    const pointer = () => { pointerInput = true; focused = false; sync() }
    const keyboardFocus = () => { pointerInput = false; focused = root.contains(document.activeElement); sync() }
    const browse = (direction) => {
      if (media.matches) { phaseRef.current += direction * stride; paint() }
      else viewport.scrollBy({ left: direction * (cards[0].offsetWidth + 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
    const keyboard = (event) => {
      if (event.target !== viewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
      event.preventDefault(); browse(event.key === 'ArrowRight' ? 1 : -1)
    }
    controlsRef.current = browse
    const resize = new ResizeObserver(measure)
    cards.forEach(card => resize.observe(card))
    resize.observe(viewport)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .05 })
    intersection.observe(viewport)
    root.addEventListener('pointerdown', pointer)
    document.addEventListener('keydown', keyboardFocus)
    root.addEventListener('focusin', focus)
    root.addEventListener('focusout', blur)
    viewport.addEventListener('keydown', keyboard)
    media.addEventListener('change', measure)
    document.addEventListener('visibilitychange', sync)
    measure()
    return () => {
      stop(); resize.disconnect(); intersection.disconnect(); controlsRef.current = null
      viewport.classList.remove('is-looping'); track.style.removeProperty('height')
      cards.forEach(card => { card.style.removeProperty('transform'); card.style.removeProperty('height'); card.style.removeProperty('width') })
      root.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', keyboardFocus)
      root.removeEventListener('focusin', focus); root.removeEventListener('focusout', blur); viewport.removeEventListener('keydown', keyboard)
      media.removeEventListener('change', measure); document.removeEventListener('visibilitychange', sync)
    }
  }, [lang, paused])

  return <div className="project-showcase">
    <div className="showcase-controls"><p id="showcase-help">{t('home_showcase_hint', 'Explore the projects. Use the arrows to browse or pause the motion.')}</p><div>
      <button type="button" onClick={() => controlsRef.current?.(-1)} aria-label={t('showcase_previous')} aria-controls="project-rail"><ArrowLeft size={17} /></button>
      <button type="button" className="showcase-pause" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-controls="project-rail">{paused ? <Play size={15} /> : <Pause size={15} />}<span>{t(paused ? 'showcase_resume' : 'showcase_pause')}</span></button>
      <button type="button" onClick={() => controlsRef.current?.(1)} aria-label={t('showcase_next')} aria-controls="project-rail"><ArrowRight size={17} /></button>
    </div></div>
    <div className="showcase-viewport" id="project-rail" ref={viewportRef} tabIndex={0} role="region" aria-label={t('showcase_label')} aria-describedby="showcase-help">
      <div className="showcase-track">
        {SHOWCASE_PROJECTS.map((project, index) => <article className="showcase-project" key={project.id} data-project={project.id}>
          <img className="showcase-project__background" src={project.backgroundImage || project.media?.[0]} alt="" aria-hidden="true" loading="lazy" />
          <div className="showcase-project__body">
            <span className="eyebrow">0{index + 1} / {t(project.categoryKey)}</span>
            <h3><Link to={project.casePath || '/projects'} data-cursor="view">{t(project.id === 'jomgo' ? 'home_jomgo_title' : project.id === 'asean-data-2024' ? 'home_asean_title' : project.titleKey)}</Link></h3>
            <p>{t(`home_${PROJECT_COPY[project.id]}_intro`)}</p>
            <p className="showcase-project__value"><mark>{t(`home_${PROJECT_COPY[project.id]}_benefit_compact`)}</mark></p>
            <TechStackBadges techString={t(project.techKey)} />
            <div className="showcase-project__links">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{t(project.id === 'asean-data-2024' ? 'home_project_presentation_short' : 'home_project_live_short')} <ArrowUpRight size={14} /></a>}<Link to={project.casePath || '/projects'} data-cursor="view">{t('home_project_details_short')}<ArrowUpRight size={14} /></Link></div>
          </div>
        </article>)}
      </div>
    </div>
    <p className="showcase-touch-note">{t('showcase_touch_hint')}</p>
  </div>
}
