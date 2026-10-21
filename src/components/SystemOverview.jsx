import { useState } from 'react'
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
  const view = VIEWS[active]
  return <div className="system-overview">
    <div className="system-overview__meta"><span><i /> {t('system_way_i_think', 'THE WAY I THINK')}</span><span>01 — 03</span></div>
    <div className="system-desk">
      <div className="system-desk__bar"><span className="window-dots"><i /><i /><i /></span><span>{t('system_people_process', 'people / process / technology')}</span><ArrowUpRight size={14} /></div>
      <div className="system-desk__header"><span className="system-desk__tag">{t(`system_${view.id}_tag`, view.tag)}</span><span className="system-desk__status"><span className="status-dot" /> {t('system_connected', 'Connected thinking')}</span></div>
      <div className="system-view-switch" role="group" aria-label={t('system_switch', 'Explore my approach')}>{VIEWS.map(({ id, icon: Icon }, i) => <button type="button" data-cursor="explore" key={id} onClick={() => setActive(i)} aria-pressed={active === i}><Icon size={16} /><span>{t(`system_${id}`, ['Business', 'Build', 'Quality'][i])}</span></button>)}</div>
      <div className="system-desk__content" aria-live="polite"><h2>{t(`system_${view.id}_title`, view.title)}</h2><ul>{view.rows.map((row, i) => <li key={`${view.id}-${i}`}><span className="system-row-number">0{i + 1}</span>{t(`system_${view.id}_row_${i}`, row)}<Check size={14} /></li>)}</ul><div className="system-output"><span><ArrowDown size={14} /> {t('system_outcome', 'THE OUTCOME')}</span><strong>{t(`system_${view.id}_output`, view.output)}</strong></div></div>
    </div>
    <div className="system-overview__foot"><span>{t('system_hint', 'Select a lens. See how the pieces connect.')}</span><span>↗</span></div>
  </div>
}
