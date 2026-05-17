import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

export function MediaLightbox({ src, alt, onClose }) {
  const { t } = useI18n()

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!src) return null

  return createPortal(
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t('media_lightbox_label', 'Image preview')}
      onClick={onClose}
    >
      <button
        type="button"
        className="media-lightbox__close"
        onClick={onClose}
        aria-label={t('media_close', 'Close')}
      >
        <X size={22} />
        <span>{t('media_close', 'Close')}</span>
      </button>
      <figure
        className="media-lightbox__frame"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={src} alt={alt || t('media_preview', 'Preview')} />
      </figure>
    </div>,
    document.body,
  )
}
