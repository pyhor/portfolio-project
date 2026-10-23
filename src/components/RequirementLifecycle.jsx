import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'
import study from '../data/jomgoCaseStudy.json'
import { SourceLink, Status } from './CaseStudyParts'

export function RequirementLifecycle() {
  const { t } = useI18n()
  const [pathId, setPathId] = useState(study.paths[0].id)
  const [selected, setSelected] = useState(0)
  const path = study.paths.find(item => item.id === pathId)
  const requirement = study.requirements.find(item => item.id === path.requirement)
  const business = study.requirements.find(item => item.id === path.business)
  const story = study.stories.find(item => item.id === path.story)
  const uat = study.uat.find(item => item.id === path.uat)
  const nodes = [
    { id: business.id, label: 'business', body: business.description, status: business.status, href: `#${business.id}` },
    { id: requirement.id, label: 'requirement', body: requirement.description, status: requirement.status, href: `#${requirement.id}` },
    { id: story.id, label: 'story', body: story.body, href: `#${story.id}` },
    { id: 'DEV', label: 'feature', body: path.feature, status: 'implemented', source: path.source },
    { id: uat.id, label: 'uat', body: uat.expected, status: 'notrun', href: `#${uat.id}` },
    { id: 'VALUE', label: 'outcome', body: path.value },
  ]
  const node = nodes[selected]
  return <div className="lifecycle-board">
    <div className="lifecycle-choices" role="group" aria-label={t('bsa_choose_path')}>{study.paths.map(item => <button type="button" key={item.id} aria-pressed={pathId === item.id} onClick={() => { setPathId(item.id); setSelected(0) }}>{t(study.stories.find(story => story.id === item.story).title)}<span>{item.requirement}</span></button>)}</div>
    <div className="lifecycle-chain" role="group" aria-label={t('bsa_lifecycle_title')}>{nodes.map((item, index) => <div className="lifecycle-step is-connected" key={`${pathId}-${item.id}`}><button type="button" className={selected === index ? 'is-selected' : ''} aria-pressed={selected === index} aria-controls="lifecycle-detail" data-cursor="explore" onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(index) }} onFocus={() => setSelected(index)} onClick={() => setSelected(index)}><span>{t(`bsa_${item.label}`)}</span><strong>{item.id}</strong><small>{t(item.body)}</small></button>{index < nodes.length - 1 && <ArrowRight size={17} aria-hidden="true" />}</div>)}</div>
    <div className="lifecycle-detail" id="lifecycle-detail" aria-live="polite" aria-label={t('bsa_path_detail')}><div><span className="eyebrow">{node.id} / {t(`bsa_${node.label}`)}</span><p>{t(node.body)}</p></div><div>{node.status && <Status value={node.status} />}{node.source && <SourceLink path={node.source} />}{node.href && <a className="text-link" href={node.href}>{t('bsa_evidence')} <ArrowRight size={15} /></a>}</div></div>
    <details className="case-disclosure"><summary>{t('bsa_matrix')}</summary><div className="case-table-scroll" tabIndex={0} role="region" aria-label={t('bsa_matrix')}><table><caption className="sr-only">{t('bsa_matrix')}</caption><thead><tr>{['business','requirement','story','feature','uat','outcome'].map(label => <th key={label} scope="col">{t(`bsa_${label}`)}</th>)}</tr></thead><tbody>{study.paths.map(item => <tr key={item.id}><td><a href={`#${item.business}`}>{item.business}</a></td><td><a href={`#${item.requirement}`}>{item.requirement}</a></td><td><a href={`#${item.story}`}>{item.story}</a></td><td><SourceLink path={item.source} /></td><td><a href={`#${item.uat}`}>{item.uat}</a><Status value="notrun" /></td><td>{t(item.value)}</td></tr>)}</tbody></table></div></details>
  </div>
}
