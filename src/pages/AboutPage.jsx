import { LanguageGreetings } from '../components/LanguageGreetings'
import { Globe, Sparkles } from 'lucide-react'
import { WhyMeSummary } from '../components/WhyMeSummary'
import { PageShell } from '../components/PageShell'
import { PERSONAL_VALUE_KEYS, ValueHighlights } from '../components/ValueHighlights'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'


export function AboutPage() {
  const { t } = useI18n()

  return (
    <PageShell className="about-page">
      <section className="page-section">
        <Box className="section-kicker reveal">
          <Sparkles size={16} />
          <span>{t('about_kicker', 'Profile')}</span>
        </Box>
        <Box className="split-layout">
          <h1 className="page-title reveal">{t('about_heading', '')}</h1>
          <Box className="copy-stack">
            <p className="reveal">{t('about_p1', '')}</p>
            <p className="reveal">{t('about_p2', '')}</p>
            <p className="reveal">{t('about_p3', '')}</p>
            <p className="reveal">{t('about_p4', '')}</p>
            <ValueHighlights keys={PERSONAL_VALUE_KEYS} />
          </Box>
        </Box>
      </section>

      <section className="page-section">
        <Box className="section-kicker reveal">
          <Globe size={16} />
          <span>{t('languages_kicker', 'Languages')}</span>
        </Box>
        <h2 className="section-title reveal">{t('languages_heading', 'Languages I know')}</h2>
        <LanguageGreetings />
      </section>
      <section className="page-section"><WhyMeSummary /></section>
      <section className="page-section about-proof"><p className="eyebrow">{t('matters_kicker', 'Why my work matters')}</p><h2 className="section-title">{t('matters_heading', 'Real proof, not just claims')}</h2><p className="page-lede">{t('matters_lede', '')}</p><div className="proof-grid">{[1, 2, 3, 4, 5, 6].map(index => <article className="glass-panel panel-card" key={index}><h3>{t(`matters_${index}_title`, '')}</h3><p>{t(`matters_${index}_desc`, '')}</p>{index < 3 && <p>{t(`matters_${index}_examples`, '')}</p>}</article>)}</div></section>
    </PageShell>
  )
}
