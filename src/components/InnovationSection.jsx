import { useState } from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nProvider'

export function InnovationSection() {
  const { t } = useI18n()
  const [active, setActive] = useState('hotel')
  return <section className="page-section ideas-chapter" id="home-ideas" aria-labelledby="ideas-heading">
    <div className="section-heading"><div><p className="eyebrow">06 — {t('ideas_kicker', 'QUESTIONS WORTH EXPLORING')}</p><h2 className="section-title" id="ideas-heading">{t('ideas_heading', 'Look beyond the feature.')}</h2></div><p className="section-heading__note">{t('ideas_intro', 'Small observations can change the way a problem is framed. These are reflections on existing work, not claims of new products.')}</p></div>
    <div className="ideas-composition"><div className="ideas-selector" role="group" aria-label={t('ideas_choose', 'Choose a project reflection')}>{['hotel', 'research'].map((id, index) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)} data-cursor="explore"><span>0{index + 1} / {t(`ideas_${id}_category`, '')}</span><strong>{t(`ideas_${id}_title`, '')}</strong><ArrowUpRight size={20} /></button>)}<p>{t('ideas_note', 'A working interface is the starting point. Understanding why it helps is the next step.')}</p></div><div className="ideas-detail" aria-live="polite"><p className="eyebrow">{t(`ideas_${active}_source`, '')}</p><div className="ideas-steps">{['problem', 'opportunity', 'approach', 'value'].map((step, i) => <article key={step}><span className="ideas-step-label">0{i + 1} — {t(`ideas_step_${step}`, '')}</span><h3>{t(`ideas_${active}_${step}_title`, '')}</h3><p>{t(`ideas_${active}_${step}`, '')}</p>{i < 3 && <ArrowRight size={15} aria-hidden="true" />}</article>)}</div><Link to="/projects" className="text-link" data-cursor="open">{t('ideas_source', 'Explore the source project')}<ArrowUpRight size={16} /></Link></div></div>
  </section>
}
