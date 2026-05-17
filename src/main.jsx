import { createRoot } from 'react-dom/client'
import App from './App'
import './style.scss'

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<App />)
} else {
  console.error('Root element #root not found in index.html')
}
