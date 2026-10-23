import React from 'react'
import { CATALOGS } from '../i18n/catalogs'

// Crash recovery uses the same complete catalogs even if the provider fails.
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
      const catalog = CATALOGS[lang] || CATALOGS.en
      const copy = { title: catalog.error_title, hint: catalog.error_hint, reload: catalog.error_reload }
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
