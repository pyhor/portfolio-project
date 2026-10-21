import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'
import { LINKEDIN_URL } from './ContactSection'
import { LangSwitcher } from './LangSwitcher'
import { ROUTES } from '../routes'

export function SiteFooter() {
  const { t } = useI18n()
  return <footer className="site-footer">
    <div className="site-footer__editorial"><div><Link className="footer-wordmark" to="/">Pei Yu Hor<span>.</span></Link><p>{t('ref_footer_identity', 'Business context. Thoughtful interfaces. Reliable systems.')}</p><Link to="/contact" className="text-link">{t('ref_footer_connect', 'Let’s turn an idea into something practical.')}<ArrowUpRight size={17} /></Link></div><nav className="footer-nav" aria-label={t('ref_footer_navigation', 'Footer navigation')}>{ROUTES.map(route => <Link key={route.id} to={route.path}>{t(route.labelKey, route.id)}</Link>)}</nav><div className="footer-professional"><span className="eyebrow">{t('ref_footer_elsewhere', 'ELSEWHERE')}</span><a href="https://github.com/pyhor" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><LangSwitcher /></div></div>
    <div className="site-footer__bottom"><span>{t('ref_copyright', '© {{year}} Pei Yu Hor.').replace('{{year}}', String(new Date().getFullYear()))}</span><span className="site-footer__credit">{t('footer_credit', '')}</span></div>
  </footer>
}
