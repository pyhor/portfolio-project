export let i18nDict = {}

const localeBase = `${import.meta.env.BASE_URL}locales/`

export async function loadLanguage(lang) {
  try {
    const response = await fetch(`${localeBase}${lang}.json`)
    if (!response.ok) throw new Error('Locale not found')

    i18nDict = await response.json()

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n')
      if (i18nDict[key]) {
        el.innerHTML = i18nDict[key]
      }
    })

    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('lang', lang)

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active')
      } else {
        btn.classList.remove('active')
      }
    })

    window.dispatchEvent(new Event('languageChanged'))
  } catch (e) {
    console.error('Failed to load language', lang, e)
    if (lang !== 'en') return loadLanguage('en')
  }
}

export function t(key, fallback = '') {
  return i18nDict[key] || fallback
}

export function initI18n() {
  const savedLang = localStorage.getItem('lang') || 'en'
  loadLanguage(savedLang)

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const nextLang = e.currentTarget.getAttribute('data-lang')
      loadLanguage(nextLang)
    })
  })
}
