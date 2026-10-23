import { AccentText } from './AccentText'
import { useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'

export function InnovationSection() {
  const { t } = useI18n()
  const choices = useRef([])
  const [active, setActive] = useState('hotel')
  return <section className="page-section ideas-chapter" id="home-ideas" aria-labelledby="ideas-heading">
    <div className="section-heading"><div><p className="eyebrow">03 — {t('ideas_kicker', 'QUESTIONS WORTH EXPLORING')}</p><h2 className="section-title" id="ideas-heading"><AccentText>{t('ideas_heading', 'Look beyond the feature.')}</AccentText></h2></div><p className="section-heading__note">{t('home_reflection_intro')}</p></div>
    <div className="ideas-composition"><div className="ideas-selector" role="tablist" aria-orientation="vertical" aria-label={t('ideas_choose', 'Choose a project reflection')}>{['hotel', 'research'].map((id, index) => <button type="button" role="tab" id={`reflection-tab-${id}`} ref={node => { choices.current[index] = node }} tabIndex={active === id ? 0 : -1} key={id} data-reflection={id} aria-controls="reflection-detail" aria-selected={active === id} onClick={() => setActive(id)} onKeyDown={event => {
      const next = { ArrowDown: (index + 1) % 2, ArrowUp: (index + 1) % 2, Home: 0, End: 1 }[event.key]
      if (next === undefined) return
      event.preventDefault()
      setActive(['hotel', 'research'][next])
      choices.current[next]?.focus()
    }} data-cursor="explore"><span>0{index + 1} / {t(`ideas_${id}_category`, '')}</span><strong>{t(`ideas_${id}_title`, '')}</strong><span className="ideas-selector__action">{t('home_reflection_explore', 'Explore reflection')} <ArrowRight size={14} /></span></button>)}</div><div className="ideas-detail" id="reflection-detail" role="tabpanel" aria-labelledby={`reflection-tab-${active}`} tabIndex={0} data-reflection={active} aria-live="polite"><p className="eyebrow">{t(`ideas_${active}_source`, '')}</p><div className="ideas-steps" key={active}>{['problem', 'opportunity', 'approach', 'value'].map((step, i) => <article key={step}><span className="ideas-step-label">0{i + 1} — {t(`ideas_step_${step}`, '')}</span><h3>{t(`ideas_${active}_${step}_title`, '')}</h3><p>{t(`home_ideas_${active}_${step}`)}</p>{i < 3 && <ArrowRight size={15} aria-hidden="true" />}</article>)}</div>{active === 'hotel' ? <Link to="/projects/hotel-website-2023" className="text-link" data-cursor="open">{t('ideas_source', 'Explore the source project')}<ArrowUpRight size={16} /></Link> : <a href="https://aseandata2024.my.canva.site/" target="_blank" rel="noopener noreferrer" className="text-link" data-cursor="open">{t('ideas_source', 'Explore the source project')}<ArrowUpRight size={16} /></a>}</div></div>
  </section>
}
