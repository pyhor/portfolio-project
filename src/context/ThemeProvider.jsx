import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readThemePreference, resolveTheme } from '../lib/theme'

const ThemeContext = createContext(null)
const systemQuery = '(prefers-color-scheme: dark)'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readThemePreference({ getItem: key => localStorage.getItem(key) }))
  const [prefersDark, setPrefersDark] = useState(() => matchMedia(systemQuery).matches)
  const resolvedTheme = resolveTheme(theme, prefersDark)

  useEffect(() => {
    const media = matchMedia(systemQuery)
    const update = () => setPrefersDark(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    document.documentElement.style.colorScheme = resolvedTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'dark' ? '#101820' : '#f5f7fa')
    try { localStorage.setItem('theme', theme) } catch { /* OS preference still works without storage. */ }
  }, [theme, resolvedTheme])

  const value = useMemo(() => ({ theme, resolvedTheme, isDark: resolvedTheme === 'dark', setTheme }), [theme, resolvedTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
