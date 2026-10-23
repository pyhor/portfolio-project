import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Link2, Mail, MessageCircle, Send } from 'lucide-react'
import { Magnetic } from './Magnetic'
import { useI18n } from '../context/I18nProvider'
import { submitContact, validateContactForm } from '../lib/contact'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/pei-yu-hor-9b3539265/'
const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' }
const FIELD_KEYS = { name: 'contact_name_label', email: 'contact_email_field_label', subject: 'contact_subject_label', message: 'contact_message_label' }
const ERROR_KEYS = {
  not_configured: 'contact_status_unavailable', network_error: 'contact_status_network',
  rate_limited: 'contact_status_rate_limited', origin_not_allowed: 'contact_status_unavailable',
  delivery_timeout: 'contact_status_timeout', validation_error: 'contact_status_validation',
  spam_detected: 'contact_status_failed', delivery_failed: 'contact_status_failed',
}

export function ContactSection({ id = 'home-contact', compact = false, headingAs: Heading = 'h2' }) {
  const { t } = useI18n()
  const formId = useId()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)
  const requestRef = useRef(null)
  const mounted = useRef(true)
  const formRef = useRef(null)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; requestRef.current?.abort() }
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status) setStatus('')
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    if (sendingRef.current) return
    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('validation_error')
      formRef.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }
    sendingRef.current = true
    setSending(true)
    setStatus('')
    const controller = new AbortController()
    requestRef.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      const result = await submitContact(form, {
        endpoint: import.meta.env.VITE_CONTACT_API_URL?.trim() || '/api/contact', signal: controller.signal,
      })
      if (!mounted.current) return
      if (result.ok) {
        setStatus('success')
        setForm({ ...EMPTY_FORM })
        setErrors({})
      } else {
        setStatus(result.code)
        if (result.code === 'validation_error') {
          const serverErrors = {}
          for (const field of Object.keys(FIELD_KEYS)) {
            const code = result.fields?.[field]
            if (['required', 'too_short', 'too_long', 'invalid'].includes(code)) serverErrors[field] = code
          }
          setErrors(serverErrors)
        }
      }
    } finally {
      window.clearTimeout(timeout)
      requestRef.current = null
      sendingRef.current = false
      if (mounted.current) setSending(false)
    }
  }

  return (
    <section className={`contact-block ${compact ? 'contact-block--compact' : ''}`} id={id}>
      <div className="section-kicker reveal"><MessageCircle size={16} aria-hidden="true" /><span>{t('contact_eyebrow')}</span></div>
      <Heading className="section-title reveal">{t('contact_heading')}</Heading>
      {!compact && <p className="page-lede reveal">{t('contact_body')}</p>}

      <div className="contact-layout">
        <aside className="contact-support reveal">
          <article className="contact-card glass-panel">
            <div className="contact-card__icon contact-card__icon--linkedin"><Link2 size={22} aria-hidden="true" /></div>
            <h3>{t('contact_linkedin_label')}</h3>
            {!compact && <p>{t('contact_linkedin_desc')}</p>}
            <Magnetic href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="ghost-cta">
              {t('contact_linkedin_cta')} <ArrowUpRight size={16} aria-hidden="true" />
            </Magnetic>
          </article>
          <article className="contact-card glass-panel">
            <div className="contact-card__icon"><Mail size={22} aria-hidden="true" /></div>
            <h3>Gmail</h3>
            <Magnetic href="https://mail.google.com/mail/u/1/#inbox" target="_blank" rel="noreferrer" className="ghost-cta">
              {t('contact_gmail_cta')} <ArrowUpRight size={16} aria-hidden="true" />
            </Magnetic>
          </article>
        </aside>

        <form ref={formRef} className="contact-form glass-panel reveal" onSubmit={sendMessage} noValidate aria-busy={sending} aria-label={t('contact_form_label')}>
          <div className="contact-form__intro"><h3>{t('contact_form_title')}</h3><p className="contact-form__helper">{t('contact_form_helper')}</p></div>
          <div className="contact-form__fields">
            {Object.entries(FIELD_KEYS).map(([field, labelKey]) => {
              const inputId = `${formId}-${field}`
              const errorId = `${inputId}-error`
              const Input = field === 'message' ? 'textarea' : 'input'
              return (
                <div className={`contact-form__field ${['subject', 'message'].includes(field) ? 'contact-form__field--full' : ''}`} key={field}>
                  <label htmlFor={inputId}>{t(labelKey)} <span className="contact-form__required" aria-hidden="true">*</span></label>
                  <Input id={inputId} name={field} type={field === 'message' ? undefined : field === 'email' ? 'email' : 'text'} rows={field === 'message' ? 6 : undefined}
                    value={form[field]} onChange={updateField(field)} disabled={sending} required
                    autoComplete={field === 'name' ? 'name' : field === 'email' ? 'email' : undefined}
                    maxLength={{ name: 100, email: 254, subject: 160, message: 5000 }[field]}
                    aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? errorId : undefined}
                    placeholder={t(`contact_${field}_placeholder`)} />
                  {errors[field] && <p className="contact-form__error" id={errorId}>{t(`contact_error_${field}_${errors[field]}`, t('contact_error_invalid'))}</p>}
                </div>
              )
            })}
          </div>
          <div className="contact-form__honeypot" aria-hidden="true" hidden>
            <label htmlFor={`${formId}-website`}>{t('contact_website_label')}</label>
            <input id={`${formId}-website`} type="text" name="website" value={form.website} onChange={updateField('website')} tabIndex={-1} autoComplete="off" />
          </div>
          <p className="contact-form__privacy">{t('contact_form_privacy')}</p>
          <Magnetic as="button" type="submit" className="primary-cta contact-form__submit" disabled={sending}>
            {t(sending ? 'contact_sending' : 'contact_send_message')} <Send size={16} aria-hidden="true" />
          </Magnetic>
          <div className={`contact-form__status ${status === 'success' ? 'contact-form__status--success' : status ? 'contact-form__status--error' : ''}`} role={status && status !== 'success' ? 'alert' : 'status'} aria-live={status && status !== 'success' ? 'assertive' : 'polite'} aria-atomic="true">
            {status === 'success' && <><CheckCircle2 size={20} aria-hidden="true" /><p>{t('contact_status_success')}</p></>}
            {status && status !== 'success' && <p>{t(ERROR_KEYS[status] || 'contact_status_failed')}</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
