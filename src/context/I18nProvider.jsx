import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'zh-cn', label: '简' },
  { id: 'zh-tw', label: '繁' },
  { id: 'yue-hk', label: '粵' },
  { id: 'ms', label: 'MS' },
]

const I18nContext = createContext(null)
const localeBase = `${import.meta.env.BASE_URL}locales/`

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('lang') || 'en'
  })
  const [dict, setDict] = useState({})
  const [fallbackDict, setFallbackDict] = useState({})
  const [ready, setReady] = useState(false)
  const fallbackLoaded = useRef(false)

  const ensureFallback = useCallback(async () => {
    if (fallbackLoaded.current) return
    try {
      const response = await fetch(`${localeBase}en.json`)
      if (response.ok) {
        const data = await response.json()
        fallbackLoaded.current = true
        setFallbackDict(data)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const loadLanguage = useCallback(async (nextLang) => {
    try {
      await ensureFallback()
      const response = await fetch(`${localeBase}${nextLang}.json`)
      if (!response.ok) throw new Error('Locale not found')
      const data = await response.json()
      setDict(data)
      setLang(nextLang)
      localStorage.setItem('lang', nextLang)
      document.documentElement.setAttribute('lang', nextLang)
      setReady(true)
    } catch (error) {
      console.error('Failed to load language', nextLang, error)
      if (nextLang !== 'en') await loadLanguage('en')
    }
  }, [ensureFallback])

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en'
    loadLanguage(saved)
  }, [loadLanguage])

  const t = useCallback(
    (key, fallback = '') => {
      const value = dict[key] ?? fallbackDict[key]
      if (value == null || value === '') return fallback
      return value
    },
    [dict, fallbackDict],
  )

  const value = useMemo(
    () => ({
      lang,
      langs: LANGS,
      ready,
      setLang: loadLanguage,
      t,
    }),
    [lang, ready, loadLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
