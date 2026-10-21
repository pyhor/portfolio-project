import { AccentText } from './AccentText'
import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, CircleAlert, Code2, MousePointer2, TextCursorInput } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

const CASES = ['complete', 'missing', 'existing']
const NODES = [TextCursorInput, Code2, MousePointer2]

export function EngineeringStudy() {
  const { t } = useI18n()
  const [scenario, setScenario] = useState('complete')
  const [selected, setSelected] = useState(0)
  const valid = scenario === 'complete'
  return (
    <section className="engineering-chapter page-section" id="home-playground" aria-labelledby="engineering-heading">
      <div className="engineering-chapter__heading">
        <p className="eyebrow">05 — {t('lab_kicker', 'A LITTLE CREATIVE ENGINEERING')}</p>
        <div className="engineering-title-grid"><h2 id="engineering-heading" className="section-title"><AccentText>{t('lab_heading', 'Serious about details. Curious about possibilities.')}</AccentText></h2><div><p className="page-lede">{t('engineering_intro', 'A system can be functional without being forgettable. The interesting part is how clearly it responds to people.')}</p><p>{t('engineering_context', 'A 2D interaction study inspired by the registration flow in my cinema project. Change the input scenario, then explore the decisions behind the response.')}</p></div></div>
      </div>
      <div className="engineering-workspace">
        <div className="engineering-toolbar"><span className="engineering-file"><Code2 size={16} /> registration.flow</span><span className="engineering-demo"><span className="status-dot" />{t('engineering_demo', 'LOCAL INTERACTION STUDY')}</span></div>
        <div className="engineering-scenarios" role="group" aria-label={t('engineering_choose', 'Choose an input scenario')}>{CASES.map((item, i) => <button key={item} type="button" aria-pressed={scenario === item} onClick={() => setScenario(item)} data-cursor="explore"><span>0{i + 1}</span>{t(`engineering_case_${item}`, item)}</button>)}</div>
        <div className="engineering-circuit" role="group" aria-label={t('engineering_nodes', 'Explore the interface layers')}>
          {NODES.map((Icon, index) => <div className="engineering-circuit__step" key={index}><button type="button" className={`engineering-node ${selected === index ? 'is-active' : ''}`} aria-pressed={selected === index} aria-controls="engineering-detail" onClick={() => setSelected(index)} data-cursor="explore"><span className="engineering-node__meta">0{index + 1} / {t(`engineering_layer_${index}`, '')}</span><Icon size={28} strokeWidth={1.3} /><h3>{t(`engineering_node_${index}`, '')}</h3><p>{t(`engineering_${scenario}_node_${index}`, '')}</p><span className="engineering-node__inspect">{t('engineering_inspect', 'Inspect decision')} ↗</span></button>{index < 2 && <span className={`engineering-wire ${index === 1 && !valid ? 'is-warning' : ''}`} aria-hidden="true"><ArrowRight size={20} /><ArrowDown size={20} /></span>}</div>)}
        </div>
        <div className="engineering-result" data-result={valid ? 'valid' : 'review'} aria-live="polite"><span className="engineering-result__icon">{valid ? <Check size={19} /> : <CircleAlert size={19} />}</span><div><span>{t('engineering_expected', 'EXPECTED INTERFACE RESPONSE')}</span><strong>{t(`engineering_${scenario}_response`, '')}</strong></div><span className="engineering-result__code">{t(`engineering_${scenario}_code`, '')}</span></div>
        <div className="engineering-detail" id="engineering-detail" aria-live="polite"><span className="eyebrow">{t('engineering_rationale', 'THE DECISION BEHIND THE DETAIL')}</span><h4>{t(`engineering_detail_${selected}_title`, '')}</h4><p>{t(`engineering_detail_${selected}_body`, '')}</p><code>{t(`engineering_detail_${selected}_code`, '')}</code></div>
      </div>
      <div className="engineering-principles"><p><span>01</span>{t('engineering_principle_1', 'Simple interfaces still need thoughtful rules.')}</p><p><span>02</span>{t('engineering_principle_2', 'Useful feedback keeps people moving.')}</p><p><span>03</span>{t('engineering_principle_3', 'A good solution starts with understanding the problem.')}</p></div>
      <p className="engineering-disclaimer">{t('engineering_disclaimer', 'An illustrative interface experiment. This does not create accounts or send data.')}</p>
    </section>
  )
}
