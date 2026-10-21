import { useI18n } from '../context/I18nProvider'

export function HeroTypography({ children }) {
  const { t } = useI18n()
  return (
    <div className="hero-copy">
      <p className="hero-intro"><span className="status-dot" /> {t('studio_intro', 'Developer & creative technologist')}</p>
      <h1 className="hero-title">
        <span>{t('studio_title_1', 'Thoughtful code.')}</span>
        <span className="hero-title__accent">{t('studio_title_2', 'Tangible impact.')}</span>
      </h1>
      <p className="hero-lede">{t('studio_lede', 'Hi, I’m pyhor. I turn complex ideas into useful digital experiences — with a little curiosity and a lot of care.')}</p>
      {children}
    </div>
  )
}
