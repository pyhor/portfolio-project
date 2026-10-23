import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CATALOGS } from '../i18n/catalogs'
const english = CATALOGS.en

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'zh-cn', label: '简' },
  { id: 'zh-tw', label: '繁' },
  { id: 'yue-hk', label: '粵' },
  { id: 'ms', label: 'MS' },
]
const BUNDLED = CATALOGS
const I18nContext = createContext(null)

function savedLanguage() {
  try {
    const saved = localStorage.getItem('lang')
    return LANGS.some(({ id }) => id === saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(savedLanguage)
  // All supported languages are ready before the first render, including the intro.
  const [dict, setDict] = useState(() => BUNDLED[savedLanguage()] || english)

  const loadLanguage = useCallback((requestedLang) => {
    const nextLang = LANGS.some(({ id }) => id === requestedLang) ? requestedLang : 'en'
    const data = BUNDLED[nextLang]
    setDict(data)
    setLang(nextLang)
    try { localStorage.setItem('lang', nextLang) } catch { /* Storage may be unavailable. */ }
    document.documentElement.setAttribute('lang', nextLang)
    document.title = data.site_title
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.site_description)
  }, [])

  useEffect(() => { loadLanguage(savedLanguage()) }, [loadLanguage])

  const t = useCallback((key, fallback = '') => {
    const value = dict[key] ?? english[key]
    return value == null || value === '' ? fallback : value
  }, [dict])

  const value = useMemo(() => ({ lang, langs: LANGS, ready: true, setLang: loadLanguage, t }), [lang, loadLanguage, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
