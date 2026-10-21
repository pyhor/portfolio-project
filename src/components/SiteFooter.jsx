import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { LINKEDIN_URL } from './ContactSection'

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="site-footer">
      <div className="site-footer__top"><Link className="footer-wordmark" to="/">pyhor<span>.</span></Link><div className="footer-links"><a href="https://github.com/pyhor" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><Link to="/contact">{t('nav_contact', 'Contact')} <ArrowUpRight size={14} /></Link></div></div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} pyhor</span><span className="site-footer__credit">{t('footer_credit', 'This website was assisted by ChatGPT, Codex, Cursor, and mainly built by me.')}</span></div>
    </footer>
  )
}
