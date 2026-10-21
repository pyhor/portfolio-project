import { useEffect, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

export function hasSeenIntro() {
  try { return sessionStorage.getItem('pyhor-intro') === 'seen' } catch { return false }
}

export function PortfolioIntro({ onComplete }) {
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

  return <div className={`portfolio-intro${exiting ? ' is-exiting' : ''}`} aria-label="Portfolio introduction">
    <div className="intro-identity"><span className="intro-monogram">p.</span><span>PYHOR / PORTFOLIO</span><span className="intro-edition">BUSINESS × TECHNOLOGY</span></div>
    <div className="intro-center"><p className="eyebrow">CONNECTED THINKING. PRACTICAL OUTCOMES.</p><h1>From understanding.<br /><span>To something useful.</span></h1><div className="intro-system" aria-hidden="true">{['People', 'Interface', 'System', 'Value'].map((label, i) => <div key={label} style={{ '--step': i }}><Check size={14} /><span>{label}</span></div>)}</div><p className="intro-ready">PORTFOLIO READY <span /></p></div>
    <div className="intro-bottom"><span>PEOPLE → PROCESS → TECHNOLOGY</span><button type="button" onClick={onComplete}>Enter portfolio <ArrowUpRight size={16} /></button></div>
  </div>
}
