import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

export function hasSeenIntro() {
  try { return sessionStorage.getItem('pyhor-intro') === 'seen' } catch { return false }
}

export function PortfolioIntro({ onComplete }) {
  const { t } = useI18n()
  const [exiting, setExiting] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const start = window.setTimeout(() => setExiting(true), media.matches ? 120 : 1050)
    // A hard deadline makes the intro independent of decorative assets/network.
    const finish = window.setTimeout(onComplete, media.matches ? 180 : 1370)
    const escape = (event) => { if (event.key === 'Escape') onComplete() }
    window.addEventListener('keydown', escape)
    return () => { clearTimeout(start); clearTimeout(finish); window.removeEventListener('keydown', escape) }
  }, [onComplete])

  return <div className={`portfolio-intro${exiting ? ' is-exiting' : ''}`} aria-label={t('intro_label', 'Portfolio introduction')}>
    <div className="intro-identity"><span className="intro-monogram">p.</span><span>PYHOR / {t('intro_portfolio', 'PORTFOLIO')}</span><span className="intro-edition">{t('intro_edition', 'BUSINESS × TECHNOLOGY')}</span></div>
    <div className="intro-center"><p className="eyebrow">{t('intro_eyebrow', 'CONNECTED THINKING. PRACTICAL OUTCOMES.')}</p><h1>{t('intro_title_1', 'From understanding.')}<br /><span>{t('intro_title_2', 'To something useful.')}</span></h1><div className="intro-system" aria-hidden="true">{['intro_people', 'intro_interface', 'intro_system', 'intro_value'].map((label, i) => <div key={label} style={{ '--step': i }}><Check size={14} /><span>{t(label)}</span></div>)}</div><p className="intro-ready">{t('intro_ready', 'PORTFOLIO READY')} <span /></p></div>
    <div className="intro-bottom"><span>{t('intro_process', 'PEOPLE → PROCESS → TECHNOLOGY')}</span><button type="button" onClick={onComplete}>{t('intro_enter', 'Enter portfolio')} <ArrowUpRight size={16} /></button></div>
  </div>
}
