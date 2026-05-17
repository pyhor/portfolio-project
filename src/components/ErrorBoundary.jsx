import React from 'react'

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
          <h1 style={{ marginTop: 0 }}>Something went wrong</h1>
          <p style={{ maxWidth: '40rem', lineHeight: 1.6 }}>{String(this.state.error?.message || this.state.error)}</p>
          <p style={{ opacity: 0.8 }}>Open the browser console (F12) for details, then restart with npm run dev.</p>
        </div>
      )
    }
    return this.props.children
  }
}
