import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Link2, Mail, MessageCircle, Send } from 'lucide-react'
import { Magnetic } from './Magnetic'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'pyhor.9657@gmail.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/pei-yu-hor-9b3539265/'

export function ContactSection({ id = 'home-contact', compact = false }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* ignore */
    }
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const sendMessage = (event) => {
    event.preventDefault()
    const body = [
      `${t('contact_form_body_name', 'Name')}: ${form.name.trim()}`,
      `${t('contact_form_body_email', 'Email')}: ${form.email.trim()}`,
      '',
      form.message.trim(),
    ].join('\n')

    const params = new URLSearchParams({
      subject: t('contact_mailto_subject', 'Portfolio Contact Message'),
      body,
    })

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`
  }

  return (
    <section className={`contact-block ${compact ? 'contact-block--compact' : ''}`} id={id}>
      <Box className="section-kicker reveal">
        <MessageCircle size={16} />
        <span>{t('contact_eyebrow', "Let's connect")}</span>
      </Box>
      <h2 className="section-title reveal">{t('contact_heading', 'Have something in mind?')}</h2>
      <p className="page-lede reveal">{t('contact_body', '')}</p>

      <form className="contact-form glass-panel float-card reveal" onSubmit={sendMessage}>
        <p className="contact-form__helper">{t('contact_form_helper', '')}</p>
        <Box className="contact-form__fields">
          <label className="contact-form__field">
            <span>{t('contact_name_label', 'Name')}</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={updateField('name')}
              autoComplete="name"
              required
            />
          </label>
          <label className="contact-form__field">
            <span>{t('contact_email_field_label', 'Email')}</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
              required
            />
          </label>
          <label className="contact-form__field contact-form__field--full">
            <span>{t('contact_message_label', 'Message')}</span>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={updateField('message')}
              required
            />
          </label>
        </Box>
        <Magnetic as="button" type="submit" className="primary-cta contact-form__submit">
          {t('contact_send_message', 'Send Message')} <Send size={16} />
        </Magnetic>
      </form>

      <Box className="contact-cards">
        <article className="contact-card glass-panel float-card reveal">
          <Box className="contact-card__icon">
            <Mail size={22} />
          </Box>
          <h3>{t('contact_email_label', 'Email')}</h3>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <Box className="contact-card__actions">
            <Magnetic href={`mailto:${CONTACT_EMAIL}`} className="ghost-cta">
              {t('contact_email_cta', 'Send email')} <ArrowUpRight size={16} />
            </Magnetic>
            <button
              type="button"
              className={`contact-copy-btn ${copied ? 'contact-copy-btn--copied' : ''}`}
              onClick={copyEmail}
              aria-live="polite"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t('contact_copied', 'Copied!') : t('contact_copy_email', 'Copy Email')}
            </button>
          </Box>
        </article>
        <article className="contact-card glass-panel float-card reveal">
          <Box className="contact-card__icon contact-card__icon--linkedin">
            <Link2 size={22} />
          </Box>
          <h3>{t('contact_linkedin_label', 'LinkedIn')}</h3>
          <p>{t('contact_linkedin_desc', '')}</p>
          <Magnetic href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="primary-cta">
            {t('contact_linkedin_cta', 'Open LinkedIn')} <ArrowUpRight size={16} />
          </Magnetic>
        </article>
      </Box>
    </section>
  )
}
