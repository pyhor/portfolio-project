import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import english from '../../public/locales/en.json'
import simplifiedChinese from '../../public/locales/zh-cn.json'

const LANGS = [
  { id: 'en', label: 'EN' },
  { id: 'zh-cn', label: '简' },
  { id: 'zh-tw', label: '繁' },
  { id: 'yue-hk', label: '粵' },
  { id: 'ms', label: 'MS' },
]
const BUNDLED = { en: english, 'zh-cn': simplifiedChinese }
const I18nContext = createContext(null)
const localeBase = `${import.meta.env.BASE_URL}locales/`

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
  // The two primary languages are ready before the first render, including the intro.
  const [dict, setDict] = useState(() => BUNDLED[savedLanguage()] || english)
  const [ready, setReady] = useState(() => Boolean(BUNDLED[savedLanguage()]))
  const requestId = useRef(0)

  const loadLanguage = useCallback(async (requestedLang) => {
    const nextLang = LANGS.some(({ id }) => id === requestedLang) ? requestedLang : 'en'
    const request = ++requestId.current
    let data = BUNDLED[nextLang]
    let resolvedLang = nextLang
    if (!data) {
      try {
        const response = await fetch(`${localeBase}${nextLang}.json`)
        if (!response.ok) throw new Error('Locale not found')
        data = await response.json()
      } catch {
        data = english
        resolvedLang = 'en'
      }
    }
    // A slow earlier request must not overwrite a more recent language selection.
    if (request !== requestId.current) return
    setDict(data)
    setLang(resolvedLang)
    try { localStorage.setItem('lang', resolvedLang) } catch { /* Storage may be unavailable. */ }
    document.documentElement.setAttribute('lang', resolvedLang)
    document.title = data.site_title || english.site_title
    setReady(true)
  }, [])

  useEffect(() => { loadLanguage(savedLanguage()) }, [loadLanguage])

  const t = useCallback((key, fallback = '') => {
    const value = dict[key] ?? english[key]
    return value == null || value === '' ? fallback : value
  }, [dict])

  const value = useMemo(() => ({ lang, langs: LANGS, ready, setLang: loadLanguage, t }), [lang, ready, loadLanguage, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
