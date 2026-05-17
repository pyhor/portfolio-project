import { ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'

export function BackToHome() {
  const { t } = useI18n()
  return (
    <Link to="/" className="back-home reveal">
      <ArrowLeft size={16} aria-hidden="true" />
      <Home size={16} aria-hidden="true" />
      <span>{t('nav_back_home', 'Back to Home')}</span>
    </Link>
  )
}
