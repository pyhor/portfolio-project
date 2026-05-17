import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { useTheme } from '../context/ThemeProvider'

export function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme, isDark } = useTheme()
  const { t } = useI18n()
  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''}`}
      onClick={toggleTheme}
      aria-label={t('theme_toggle', 'Toggle theme')}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
      {!compact && <span>{theme === 'light' ? t('theme_light', 'Light') : t('theme_dark', 'Dark')}</span>}
    </button>
  )
}
