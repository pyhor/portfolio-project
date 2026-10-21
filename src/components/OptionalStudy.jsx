import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { DeferredScene } from './DeferredScene'
import { useI18n } from '../context/I18nProvider'

export function OptionalStudy() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  return <details className="optional-study" onToggle={event => setOpen(event.currentTarget.open)}><summary><span>{t('optional_study', 'A small interaction experiment')}</span><span>{t('optional_study_action', 'Discover 3D')} <ArrowUpRight size={14} /></span></summary>{open && <div className="optional-study__body"><p>{t('optional_study_note', 'An optional study in responsive feedback. Drag horizontally to rotate; scroll vertically as usual. The portfolio works fully without it.')}</p><DeferredScene /></div>}</details>
}
