import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, FileChartColumn, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects'
import { useI18n } from '../context/I18nProvider'
import { TechStackBadges } from './TechStackBadges'
import { loopPosition } from '../lib/showcase'

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
    let hovering = root.matches(':hover'), focused = root.contains(document.activeElement)
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
      stop()
      if (media.matches && visible && !paused && !hovering && !focused && !document.hidden) {
        viewport.dataset.running = 'true'
        frame = requestAnimationFrame(animate)
      }
    }
    const measure = () => {
      viewport.classList.toggle('is-looping', media.matches)
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
    const enter = () => { hovering = true; sync() }
    const leave = () => { hovering = false; sync() }
    const focus = (event) => {
      focused = true
      if (media.matches) {
        const index = cards.findIndex(card => card.contains(event.target))
        if (index >= 0) { phaseRef.current = index * stride; viewport.scrollLeft = 0; paint() }
      }
      sync()
    }
    const blur = (event) => { focused = root.contains(event.relatedTarget); sync() }
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
    root.addEventListener('mouseenter', enter)
    root.addEventListener('mouseleave', leave)
    root.addEventListener('focusin', focus)
    root.addEventListener('focusout', blur)
    viewport.addEventListener('keydown', keyboard)
    media.addEventListener('change', measure)
    document.addEventListener('visibilitychange', sync)
    measure()
    return () => {
      stop(); resize.disconnect(); intersection.disconnect(); controlsRef.current = null
      viewport.classList.remove('is-looping'); track.style.removeProperty('height')
      cards.forEach(card => card.style.removeProperty('transform'))
      root.removeEventListener('mouseenter', enter); root.removeEventListener('mouseleave', leave)
      root.removeEventListener('focusin', focus); root.removeEventListener('focusout', blur); viewport.removeEventListener('keydown', keyboard)
      media.removeEventListener('change', measure); document.removeEventListener('visibilitychange', sync)
    }
  }, [lang, paused])

  return <div className="project-showcase">
    <div className="showcase-controls"><p id="showcase-help">{t('showcase_hint')}</p><div>
      <button type="button" onClick={() => controlsRef.current?.(-1)} aria-label={t('showcase_previous')} aria-controls="project-rail"><ArrowLeft size={17} /></button>
      <button type="button" className="showcase-pause" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-controls="project-rail">{paused ? <Play size={15} /> : <Pause size={15} />}<span>{t(paused ? 'showcase_resume' : 'showcase_pause')}</span></button>
      <button type="button" onClick={() => controlsRef.current?.(1)} aria-label={t('showcase_next')} aria-controls="project-rail"><ArrowRight size={17} /></button>
    </div></div>
    <div className="showcase-viewport" id="project-rail" ref={viewportRef} tabIndex={0} role="region" aria-label={t('showcase_label')} aria-describedby="showcase-help">
      <div className="showcase-track">
        {SHOWCASE_PROJECTS.map((project, index) => <article className="showcase-project" key={project.id} data-project={project.id}>
          <Link to={project.casePath || '/projects'} className={`showcase-visual showcase-visual--${index}`} data-cursor="view" aria-label={`${t('studio_open_project')}: ${t(project.titleKey)}`}>
            <span className="showcase-visual__meta"><span>0{index + 1} / {t(project.categoryKey)}</span><ArrowUpRight size={20} /></span>
            {project.media ? <img src={project.media[0]} alt={t(project.titleKey)} loading="lazy" draggable="false" /> : <div className="showcase-document">{project.id === 'vet-mgmt-system-2024' ? <Code2 size={42} strokeWidth={1} /> : <FileChartColumn size={42} strokeWidth={1} />}<strong>{project.previewLabel || (project.id === 'vet-mgmt-system-2024' ? 'PHP / JavaScript' : 'ASEAN / 2024')}</strong><span>{t(project.previewKey || (project.id === 'vet-mgmt-system-2024' ? 'showcase_vet_preview' : 'showcase_asean_preview'))}</span><small>{t('showcase_text_preview')}</small></div>}
          </Link>
          <div className="showcase-project__body"><div className="showcase-project__meta"><span>{t(project.metaKey)}</span><span>{t(project.statusKey)}</span></div>
            <h3><Link to={project.casePath || '/projects'} data-cursor="view">{t(project.titleKey)}</Link></h3><p>{t(project.descKey)}</p>
            <dl><div><dt>{t('ref_project_role')}</dt><dd>{t(project.roleKey)}</dd></div><div><dt>{t('ref_project_problem')}</dt><dd>{t(project.problemKey)}</dd></div><div><dt>{t('showcase_contribution')}</dt><dd>{t(project.contribKey)}</dd></div></dl>
            <TechStackBadges techString={t(project.techKey)} />
            <div className="showcase-project__links">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{t(project.id === 'asean-data-2024' ? 'proj_asean_canva_cta' : 'btn_view_live')} <ArrowUpRight size={14} /></a>}<Link to={project.casePath || '/projects'} data-cursor="view">{t('studio_project_details')}<ArrowUpRight size={14} /></Link></div>
          </div>
        </article>)}
      </div>
    </div>
    <p className="showcase-touch-note">{t('showcase_touch_hint')}</p>
  </div>
}
