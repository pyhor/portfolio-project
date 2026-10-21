import { ChevronDown, Globe2 } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

const LANGUAGE_NAMES = {
  en: 'English',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  'yue-hk': '粵語',
  ms: 'Bahasa Melayu',
}

export function LangSwitcher({ compact = false }) {
  const { lang, langs, setLang, t } = useI18n()

  return (
    <label className={`language-select${compact ? ' language-select--compact' : ''}`}>
      {!compact && <Globe2 size={17} aria-hidden="true" />}
      <select
        value={lang}
        onChange={(event) => setLang(event.target.value)}
        aria-label={t('languages_kicker', 'Languages')}
      >
        {langs.map((item) => (
          <option key={item.id} value={item.id} lang={item.id} aria-label={LANGUAGE_NAMES[item.id]}>
            {compact ? item.label : LANGUAGE_NAMES[item.id] || item.label}
          </option>
        ))}
      </select>
      <ChevronDown size={13} aria-hidden="true" />
    </label>
  )
}
