import { Monitor, Moon, Sun } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { useTheme } from '../context/ThemeProvider'

export function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const Icon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun
  return <label className={`theme-toggle theme-preference ${compact ? 'theme-toggle--compact' : ''}`}>
    <Icon size={17} aria-hidden="true" />
    <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label={t('theme_preference')}>
      {['system', 'light', 'dark'].map(mode => <option key={mode} value={mode}>{t(`theme_${mode}`)}</option>)}
    </select>
  </label>
}
