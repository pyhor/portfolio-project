import { TypewriterText } from './TypewriterText'
import { AccentText } from './AccentText'
import { useI18n } from '../context/I18nProvider'

export function HeroTypography({ children }) {
  const { t } = useI18n()
  return <div className="hero-copy">
    <h1 className="hero-name">Pei Yu Hor<span>.</span></h1>
    <p className="hero-profession"><TypewriterText phrases={[t('home_role_frontend'), t('home_role_analysis'), t('home_role_testing')]} /></p>
    <h2 className="hero-title"><span>{t('studio_title_1', 'Understand the problem.')}</span><span className="hero-title__accent"><AccentText>{t('studio_title_2', 'Build what matters.')}</AccentText></span></h2>
    <p className="hero-lede">{t('studio_lede', '')}</p>
    {children}
  </div>
}
