import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, ClipboardList, Code2, ShieldCheck, Pause, Play } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import { useLensCycle } from '../hooks/useLensCycle'

const VIEWS = [
  { id: 'business', icon: ClipboardList, title: 'Understand the problem', output: 'A clear, shared requirement', rows: ['Identify user needs', 'Map the current process', 'Define acceptance criteria'], tag: 'REQUIREMENTS' },
  { id: 'build', icon: Code2, title: 'Connect the moving parts', output: 'A useful, working interface', rows: ['Design the user journey', 'Connect forms and data', 'Handle validation and errors'], tag: 'DEVELOPMENT' },
  { id: 'quality', icon: ShieldCheck, title: 'Make the outcome reliable', output: 'A tested, usable experience', rows: ['Check the happy path', 'Test edge cases and devices', 'Verify against requirements'], tag: 'QUALITY ASSURANCE' },
]

export function SystemOverview() {
  const { t } = useI18n()
  const root = useRef(null)
  const tabs = useRef([])
  const cycle = useLensCycle(root)
  const [displayed, setDisplayed] = useState(0)
  const [manual, setManual] = useState(null)
  const active = cycle.index
  const view = VIEWS[displayed]
  const changing = displayed !== active
  useEffect(() => {
    if (cycle.reduced) { setDisplayed(active); return }
    const timer = setTimeout(() => setDisplayed(active), 160)
    return () => clearTimeout(timer)
  }, [active, cycle.reduced])
  const choose = index => {
    cycle.select(index)
    setManual(index)
  }
  const keyboard = (event, index) => {
    const keys = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = keys[event.key]
    choose(next); tabs.current[next]?.focus()
  }
  const explore = <a href="#home-playground" className="system-explore" aria-label={t('system_explore_label', 'Explore interactive section')} data-cursor="explore"><ArrowUpRight size={18} aria-hidden="true" /></a>
  return <div className="system-overview" ref={root} data-running={cycle.running}>
    <div className="system-overview__meta"><span><i /> {t('system_way_i_think')}</span><span className="system-index" key={active}>0{active + 1} — 03</span></div>
    <div className="system-desk">
      <div className="system-desk__bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>{t('system_people_process')}</span>{explore}</div>
      <div className="system-desk__header"><span className="system-desk__tag">{t('system_business_tag')}</span><span className="system-desk__status"><span className="status-dot" /> {t('system_connected')}</span></div>
      <div className="system-view-switch" role="tablist" aria-label={t('system_switch')}>{VIEWS.map(({ id, icon: Icon }, i) => <button type="button" role="tab" id={`lens-${id}`} aria-controls="lens-panel" tabIndex={active === i ? 0 : -1} ref={element => { tabs.current[i] = element }} data-cursor="explore" key={id} onClick={() => choose(i)} onKeyDown={event => keyboard(event, i)} aria-selected={active === i}><Icon size={16} aria-hidden="true" /><span>{t(`system_${id}`)}</span>{active === i && <span className="lens-progress" aria-hidden="true" style={{ '--progress': 1 - cycle.remaining / cycle.duration, '--remaining': `${cycle.remaining}ms` }} key={`${active}-${cycle.remaining}-${cycle.running}`} />}</button>)}</div>
      <div className="system-connections" data-lens={active} aria-hidden="true"><svg viewBox="0 0 300 34" preserveAspectRatio="none"><path d="M50 0V10Q50 17 60 17H150V34" /><path d="M150 0V34" /><path d="M250 0V10Q250 17 240 17H150" /></svg><span>{t('system_business_tag')}</span></div>
      <div className={`system-desk__content${changing ? ' is-changing' : ''}`} id="lens-panel" role="tabpanel" aria-labelledby={`lens-${VIEWS[active].id}`} tabIndex={0}>
        <div className="system-process" key={view.id}>
          <p className="system-question">{t(`glass_${view.id}_question`)}</p>
          <h2>{t(`system_${view.id}_title`)}</h2>
          <ol>{view.rows.map((row, i) => <li key={row} style={{ '--step': i }}><span className="system-row-number">0{i + 1}</span><span>{t(`system_${view.id}_row_${i}`)}</span><Check size={14} aria-hidden="true" /></li>)}</ol>
          <div className="system-output"><span><ArrowDown size={14} aria-hidden="true" /> {t('system_outcome')}</span><strong>{t(`system_${view.id}_output`)}</strong></div>
        </div>
      </div>
    </div>
    <div className="system-overview__foot"><span>{t('system_hint')}</span><button type="button" className="lens-pause" onClick={cycle.toggle} aria-pressed={cycle.paused} aria-label={t(cycle.paused ? 'glass_resume' : 'glass_pause')} disabled={cycle.reduced}>{cycle.paused || cycle.reduced ? <Play size={14} /> : <Pause size={14} />}</button>{explore}</div>
    <span className="sr-only" role="status">{manual !== null ? `${t(`system_${VIEWS[manual].id}`)}: ${t(`system_${VIEWS[manual].id}_output`)}` : ''}</span>
  </div>
}
