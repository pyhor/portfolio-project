import { useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, ClipboardList, Code2, ShieldCheck } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

const VIEWS = [
  { id: 'business', icon: ClipboardList, title: 'Understand the problem', output: 'A clear, shared requirement', rows: ['Identify user needs', 'Map the current process', 'Define acceptance criteria'], tag: 'REQUIREMENTS' },
  { id: 'build', icon: Code2, title: 'Connect the moving parts', output: 'A useful, working interface', rows: ['Design the user journey', 'Connect forms and data', 'Handle validation and errors'], tag: 'DEVELOPMENT' },
  { id: 'quality', icon: ShieldCheck, title: 'Make the outcome reliable', output: 'A tested, usable experience', rows: ['Check the happy path', 'Test edge cases and devices', 'Verify against requirements'], tag: 'QUALITY ASSURANCE' },
]

export function SystemOverview() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const cardRef = useRef(null)
  const view = VIEWS[active]
  const move = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    cardRef.current?.style.setProperty('--desk-x', `${(event.clientY - rect.top - rect.height / 2) / rect.height * -3}deg`)
    cardRef.current?.style.setProperty('--desk-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 3}deg`)
  }
  const reset = () => { cardRef.current?.style.setProperty('--desk-x', '0deg'); cardRef.current?.style.setProperty('--desk-y', '0deg') }
  return <div className="system-overview" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="system-overview__meta"><span><i /> THE WAY I THINK</span><span>01 — 03</span></div>
    <div className="system-desk" ref={cardRef}>
      <div className="system-desk__bar"><span className="window-dots"><i /><i /><i /></span><span>people / process / technology</span><ArrowUpRight size={14} /></div>
      <div className="system-desk__header"><span className="system-desk__tag">{t(`system_${view.id}_tag`, view.tag)}</span><span className="system-desk__status"><span className="status-dot" /> {t('system_connected', 'Connected thinking')}</span></div>
      <div className="system-view-switch" role="group" aria-label={t('system_switch', 'Explore my approach')}>{VIEWS.map(({ id, icon: Icon }, i) => <button type="button" data-cursor="explore" key={id} onClick={() => setActive(i)} aria-pressed={active === i}><Icon size={16} /><span>{t(`system_${id}`, ['Business', 'Build', 'Quality'][i])}</span></button>)}</div>
      <div className="system-desk__content" aria-live="polite"><h2>{t(`system_${view.id}_title`, view.title)}</h2><ul>{view.rows.map((row, i) => <li key={`${view.id}-${i}`}><span className="system-row-number">0{i + 1}</span>{t(`system_${view.id}_row_${i}`, row)}<Check size={14} /></li>)}</ul><div className="system-output"><span><ArrowDown size={14} /> {t('system_outcome', 'THE OUTCOME')}</span><strong>{t(`system_${view.id}_output`, view.output)}</strong></div></div>
    </div>
    <div className="system-overview__foot"><span>{t('system_hint', 'Select a lens. See how the pieces connect.')}</span><span>↗</span></div>
  </div>
}
