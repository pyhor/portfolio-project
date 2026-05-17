import { Globe, Sparkles } from 'lucide-react'
import { PageShell } from '../components/PageShell'
import { PERSONAL_VALUE_KEYS, ValueHighlights } from '../components/ValueHighlights'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

const LANGUAGE_KEYS = [
  'lang_english',
  'lang_malay',
  'lang_zh_cn',
  'lang_zh_tw',
  'lang_cantonese',
]

export function AboutPage() {
  const { t } = useI18n()

  return (
    <PageShell>
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
        <ul className="language-grid">
          {LANGUAGE_KEYS.map((key) => (
            <li key={key} className="language-chip glass-panel float-card reveal">
              {t(key, key)}
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
