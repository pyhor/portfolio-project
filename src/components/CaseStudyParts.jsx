import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import study from '../data/jomgoCaseStudy.json'

export function SourceLink({ path }) {
  const { t } = useI18n()
  return <a className="case-source" href={`${study.sourceBase}${path}`} target="_blank" rel="noreferrer">{t('bsa_source')} <span>{path}</span><ArrowUpRight size={13} aria-hidden="true" /></a>
}
export function Status({ value }) {
  const { t } = useI18n()
  return <span className="case-status" data-status={value}>{t(`bsa_${value}`)}</span>
}
export function CaseSection({ id, children, titleKey, introKey }) {
  const { t } = useI18n()
  return <section className="page-section case-section" id={id} aria-labelledby={`${id}-title`}>
    <div className="case-section-heading"><p className="eyebrow">{t('bsa_primary')}</p><h2 id={`${id}-title`}>{t(titleKey || `bsa_${id}`)}</h2>{introKey && <p>{t(introKey)}</p>}</div>{children}
  </section>
}
export function Flow({ steps, label }) {
  const { t } = useI18n()
  return <ol className="case-flow" aria-label={label}>{steps.map((step, index) => <li key={step}><span className="case-flow__number">{String(index + 1).padStart(2, '0')}</span><span>{t(step)}</span>{index < steps.length - 1 && <ArrowDown size={15} aria-hidden="true" />}</li>)}</ol>
}
export function Metadata({ rows }) {
  const { t } = useI18n()
  return <dl className="case-metadata">{rows.map(([label, content]) => <div key={label}><dt>{t(`bsa_${label}`)}</dt><dd>{content}</dd></div>)}</dl>
}
