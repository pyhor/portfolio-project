import { useI18n } from '../context/I18nProvider'

// Match a meaningful word/phrase once, never split Chinese into characters.
export function AccentText({ children, tone = 'business' }) {
  const { t } = useI18n()
  const text = String(children)
  const terms = t('motion_keywords').split('|').filter(Boolean)
  const term = terms.find(value => text.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  if (!term) return text
  const start = text.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())
  return <>{text.slice(0, start)}<span className="word-accent" data-tone={tone}>{text.slice(start, start + term.length)}</span>{text.slice(start + term.length)}</>
}
