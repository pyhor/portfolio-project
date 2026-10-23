import { lazy, Suspense, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Route } from 'lucide-react'
import { useI18n } from '../context/I18nProvider'

const JomGoCaseStudy = lazy(() => import('../pages/JomGoCaseStudy').then(module => ({ default: module.JomGoCaseStudy })))

function JomGoLoading() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const dialog = useRef(null)
  const back = useRef(null)
  const titleId = useId()
  useLayoutEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    element.showModal()
    back.current?.focus({ preventScroll: true })
    return () => {
      element.close()
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={dialog} className="jomgo-entry" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); navigate('/projects') }}>
    <div className="jomgo-entry__identity"><Route size={28} aria-hidden="true" /><strong>JomGo</strong><span>{t('bsa_primary')}</span></div>
    <div className="jomgo-entry__center"><p className="eyebrow">{t('jomgo_entry_eyebrow')}</p><h1 id={titleId}>{t('jomgo_entry_title')}</h1><p>{t('jomgo_entry_description')}</p><div className="jomgo-entry__route" aria-hidden="true"><i /><span /><i /><span /><i /></div><p className="jomgo-entry__status" role="status">{t('jomgo_entry_loading')}</p></div>
    <Link ref={back} to="/projects">{t('bsa_back')} <ArrowRight size={18} aria-hidden="true" /></Link>
  </dialog>
}

export function JomGoEntry() {
  const [entering, setEntering] = useState(true)
  useEffect(() => {
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 850
    const timer = setTimeout(() => setEntering(false), delay)
    return () => clearTimeout(timer)
  }, [])
  return <>
    {entering && <JomGoLoading />}
    <div inert={entering ? true : undefined} aria-hidden={entering ? true : undefined}>
      <Suspense fallback={entering ? null : <JomGoLoading />}><JomGoCaseStudy /></Suspense>
    </div>
  </>
}
