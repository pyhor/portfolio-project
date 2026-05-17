import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function LangSwitcher({ compact = false }) {
  const { lang, langs, setLang } = useI18n()
  return (
    <Box className={`lang-switcher ${compact ? 'lang-switcher--compact' : ''}`} role="group" aria-label="Language">
      {langs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={lang === item.id ? 'active' : ''}
          onClick={() => setLang(item.id)}
        >
          {item.label}
        </button>
      ))}
    </Box>
  )
}
