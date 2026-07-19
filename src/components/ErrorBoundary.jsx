import React from 'react'

// Localized copy for the crash screen. The i18n React context may be
// unavailable when the boundary triggers, so we resolve from the saved
// language directly instead of the useI18n hook.
const ERROR_COPY = {
  en: { title: 'Something went wrong', hint: 'Open the browser console (F12) for details, then restart with npm run dev.' },
  ms: { title: 'Sesuatu tidak kena', hint: 'Buka konsol pelayar (F12) untuk butiran, kemudian mulakan semula dengan npm run dev.' },
  'zh-cn': { title: '出了点问题', hint: '按 F12 打开浏览器控制台查看详情，然后用 npm run dev 重新启动。' },
  'zh-tw': { title: '出了點問題', hint: '按 F12 開啟瀏覽器主控台查看詳情，然後用 npm run dev 重新啟動。' },
  'yue-hk': { title: '出咗啲問題', hint: '撳 F12 開瀏覽器主控台睇詳情，再用 npm run dev 重新啟動。' },
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
      const copy = ERROR_COPY[lang] || ERROR_COPY.en
      return (
        <div
          style={{
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            color: '#0a0a0a',
            background: '#fff5f5',
            minHeight: '100vh',
          }}
        >
          <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
          <p style={{ maxWidth: '40rem', lineHeight: 1.6 }}>{String(this.state.error?.message || this.state.error)}</p>
          <p style={{ opacity: 0.8 }}>{copy.hint}</p>
        </div>
      )
    }
    return this.props.children
  }
}
