import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function HomeSectionPreview({
  id,
  to,
  icon: Icon,
  kickerKey,
  titleKey,
  descKey,
  previewKeys = [],
}) {
  const { t } = useI18n()

  return (
    <section className="page-section home-preview-section" id={id}>
      <Link to={to} className="home-preview-card glass-panel float-card reveal">
        <Box className="section-kicker home-preview-card__kicker">
          <Icon size={16} aria-hidden="true" />
          <span>{t(kickerKey, '')}</span>
        </Box>
        <h2 className="home-preview-card__title">{t(titleKey, '')}</h2>
        <p className="home-preview-card__desc">{t(descKey, '')}</p>
        {previewKeys.length > 0 && (
          <ul className="home-preview-card__chips" aria-label={t(titleKey, '')}>
            {previewKeys.map((key) => (
              <li key={key}>{t(key, '')}</li>
            ))}
          </ul>
        )}
        <span className="home-preview-card__cta">
          {t('home_view_more', 'View More')} <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </section>
  )
}
