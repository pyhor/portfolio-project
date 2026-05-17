import { useState } from 'react'
import { ArrowUpRight, ExternalLink, ZoomIn } from 'lucide-react'
import { Magnetic } from './Magnetic'
import { MediaLightbox } from './MediaLightbox'
import { TechStackBadges } from './TechStackBadges'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function FeaturedProjectCard({ project }) {
  const { t } = useI18n()
  const [previewSrc, setPreviewSrc] = useState(null)
  const projectTitle = t(project.titleKey, project.id)
  const techString = t(project.techKey, '')

  return (
    <article className="featured-project glass-panel float-card reveal">
      <Box className="featured-project__head">
        <span className="featured-project__meta">{t(project.metaKey, '')}</span>
        <h3>{projectTitle}</h3>
      </Box>
      <p>{t(project.descKey, '')}</p>
      <p className="featured-project__contrib">{t(project.contribKey, '')}</p>
      <p className="featured-project__tech">
        <strong>{t('proj_tech_label', 'Tech')}:</strong>{' '}
        <TechStackBadges techString={techString} />
      </p>
      {project.media?.length > 0 && (
        <Box className="media-grid">
          {project.media.map((src) => (
            <figure key={src} className="media-grid__item">
              <button
                type="button"
                className="media-grid__trigger"
                onClick={() => setPreviewSrc(src)}
                aria-label={`${t('media_view_image', 'View image')}: ${projectTitle}`}
              >
                <img src={src} alt="" loading="lazy" />
                <span className="media-grid__zoom" aria-hidden="true">
                  <ZoomIn size={18} />
                </span>
              </button>
            </figure>
          ))}
        </Box>
      )}
      <Box className="featured-project__actions">
        <Magnetic href={project.githubUrl} target="_blank" rel="noreferrer" className="primary-cta">
          {t('btn_view_github', 'View GitHub')} <ArrowUpRight size={16} />
        </Magnetic>
        {project.liveUrl && (
          <Magnetic href={project.liveUrl} target="_blank" rel="noreferrer" className="ghost-cta">
            {t('btn_view_live', 'View Live Website')} <ExternalLink size={16} />
          </Magnetic>
        )}
      </Box>
      {previewSrc && (
        <MediaLightbox
          src={previewSrc}
          alt={projectTitle}
          onClose={() => setPreviewSrc(null)}
        />
      )}
    </article>
  )
}
