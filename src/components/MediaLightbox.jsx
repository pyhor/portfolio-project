import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

export function MediaLightbox({ src, alt, onClose }) {
  const { t } = useI18n()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!src || !dialog) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    closeButtonRef.current?.focus({ preventScroll: true })

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [src])

  if (!src) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className="media-lightbox"
      aria-label={t('media_lightbox_label', 'Image preview')}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="media-lightbox__close"
        onClick={onClose}
        aria-label={t('media_close', 'Close')}
      >
        <X size={22} />
        <span>{t('media_close', 'Close')}</span>
      </button>
      <figure className="media-lightbox__frame">
        <img src={src} alt={alt || t('media_preview', 'Preview')} />
      </figure>
    </dialog>,
    document.body,
  )
}
