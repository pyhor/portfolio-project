import React from 'react'
import english from '../../public/locales/en.json'
import simplifiedChinese from '../../public/locales/zh-cn.json'

// Crash recovery must remain usable even when the React i18n provider fails.
const ERROR_COPY = {
  en: { title: english.error_title, hint: english.error_hint, reload: english.error_reload },
  'zh-cn': { title: simplifiedChinese.error_title, hint: simplifiedChinese.error_hint, reload: simplifiedChinese.error_reload },
  ms: { title: 'Sesuatu tidak kena', hint: 'Halaman ini tidak dapat dipaparkan. Sila cuba muat semula.', reload: 'Muat semula halaman' },
  'zh-tw': { title: '頁面出了點問題', hint: '目前無法顯示此頁面，請重新載入後再試。', reload: '重新載入頁面' },
  'yue-hk': { title: '頁面出咗啲問題', hint: '暫時未能顯示呢個頁面，請重新載入再試。', reload: '重新載入頁面' },
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) { return { error } }

  render() {
    if (this.state.error) {
      let lang = 'en'
      try { lang = localStorage.getItem('lang') || 'en' } catch { /* Recovery also works without storage. */ }
      const copy = ERROR_COPY[lang] || ERROR_COPY.en
      return (
        <div lang={lang} role="alert" style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#0a0a0a', background: '#fff5f5', minHeight: '100vh' }}>
          <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
          <p style={{ maxWidth: '40rem', lineHeight: 1.6 }}>{copy.hint}</p>
          <button type="button" onClick={() => window.location.reload()}>{copy.reload}</button>
        </div>
      )
    }
    return this.props.children
  }
}
