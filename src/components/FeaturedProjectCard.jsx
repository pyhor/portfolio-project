import { useRef, useState } from 'react'
import { ArrowUpRight, ExternalLink, ZoomIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Magnetic } from './Magnetic'
import { MediaLightbox } from './MediaLightbox'
import { TechStackBadges } from './TechStackBadges'
import { useI18n } from '../context/I18nProvider'
import { pointerTilt } from '../lib/motion'

export function FeaturedProjectCard({ project, compact = false, index = 0 }) {
  const { t } = useI18n()
  const [previewSrc, setPreviewSrc] = useState(null)
  const artRef = useRef(null)
  const title = t(project.titleKey, project.id)
  const tilt = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const { x, y } = pointerTilt(event.clientX, event.clientY, rect)
    artRef.current?.style.setProperty('--tilt-x', `${x}deg`)
    artRef.current?.style.setProperty('--tilt-y', `${y}deg`)
  }
  const reset = () => { artRef.current?.style.setProperty('--tilt-x', '0deg'); artRef.current?.style.setProperty('--tilt-y', '0deg') }
  return (
    <article className={`featured-project reveal ${compact ? 'featured-project--compact' : ''}`}>
      <button className={`project-cover project-cover--${project.id}`} type="button" data-cursor="view" onClick={() => setPreviewSrc(project.media[0])} onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset} aria-label={`${t('media_view_image', 'View image')}: ${title}`}>
        <div className="project-cover__top"><span>{String(index + 1).padStart(2, '0')} / {t(project.metaKey, '')}</span><ZoomIn size={17} /></div>
        <div className="project-cover__art" ref={artRef}><div className="browser-chrome" aria-hidden="true"><i /><i /><i /><span>{project.id}</span></div><img src={project.media[0]} alt={title} loading="lazy" /></div>
        <span className="project-cover__label">{t('studio_project_preview', 'A closer look')} <ArrowUpRight size={17} /></span>
      </button>
      <div className="featured-project__body"><div className="featured-project__head"><div><span className="featured-project__meta">{t(project.metaKey, '')}</span><h3>{title}</h3></div><a href={project.liveUrl || project.githubUrl} target="_blank" rel="noreferrer" className="project-open" aria-label={`${t('studio_open_project', 'Open project')}: ${title}`}><ArrowUpRight size={23} /></a></div>
        <p>{t(project.descKey, '')}</p>
        {!compact && <p className="featured-project__contrib">{t(project.contribKey, '')}</p>}
        <TechStackBadges techString={t(project.techKey, '')} />
        {!compact && <><div className="media-grid">{project.media.slice(1).map((src, i) => <button key={src} type="button" className="media-grid__trigger" onClick={() => setPreviewSrc(src)} aria-label={`${t('media_view_image', 'View image')}: ${title} ${i + 2}`}><img src={src} alt="" loading="lazy" /><span className="media-grid__zoom"><ZoomIn size={18} /></span></button>)}</div><div className="featured-project__actions"><Magnetic href={project.githubUrl} target="_blank" rel="noreferrer" className="primary-cta">{t('btn_view_github', 'View GitHub')} <ArrowUpRight size={16} /></Magnetic>{project.liveUrl && <Magnetic href={project.liveUrl} target="_blank" rel="noreferrer" className="ghost-cta">{t('btn_view_live', 'View Live Website')} <ExternalLink size={16} /></Magnetic>}</div></>}
        {compact && <Link to="/projects" className="project-details-link" data-cursor="open">{t('studio_project_details', 'Explore project details')} <ArrowUpRight size={15} /></Link>}
      </div>
      {previewSrc && <MediaLightbox src={previewSrc} alt={title} onClose={() => setPreviewSrc(null)} />}
    </article>
  )
}
