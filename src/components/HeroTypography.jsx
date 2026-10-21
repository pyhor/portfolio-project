import { useI18n } from '../context/I18nProvider'

export function HeroTypography({ children }) {
  const { t } = useI18n()
  return <div className="hero-copy">
    <h1 className="hero-name">Pei Yu Hor<span>.</span></h1>
    <p className="hero-profession">{t('ref_hero_profession', 'Frontend development. Business & systems thinking. Software testing.')}</p>
    <h2 className="hero-title"><span>{t('studio_title_1', 'Understand the problem.')}</span><span className="hero-title__accent">{t('studio_title_2', 'Build what matters.')}</span></h2>
    <p className="hero-lede">{t('studio_lede', '')}</p>
    {children}
  </div>
}
