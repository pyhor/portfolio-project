import { useCallback, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

const SHOW_AFTER_PX = 320

export function ScrollToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  const updateVisibility = useCallback(() => {
    const y = window.scrollY
    setVisible(y > SHOW_AFTER_PX)
  }, [])

  useEffect(() => {
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [updateVisibility])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const label = t('scroll_to_top', 'Back to Top')

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label={label}
      title={label}
    >
      <ArrowUp size={18} aria-hidden="true" />
      <span className="scroll-to-top__label">{label}</span>
    </button>
  )
}
