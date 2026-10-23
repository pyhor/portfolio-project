import { Globe } from 'lucide-react'
import { TypewriterText } from './TypewriterText'
import { useI18n } from '../context/I18nProvider'

const LANGUAGES = [
  { key: 'lang_english', tag: 'en', hello: 'Hello' },
  { key: 'lang_malay', tag: 'ms', hello: 'Helo' },
  { key: 'lang_zh_cn', tag: 'zh-Hans', hello: '你好' },
  { key: 'lang_zh_tw', tag: 'zh-Hant', hello: '你好' },
  { key: 'lang_cantonese', tag: 'yue', hello: '你好' },
]

export function LanguageGreetings() {
  const { t } = useI18n()
  return <div className="language-showcase">
    <div className="language-globe" aria-hidden="true">
      <Globe className="language-globe__sphere" size={240} strokeWidth={.65} />
      <div className="language-globe__greeting"><TypewriterText phrases={LANGUAGES.map(item => `${item.hello} · ${t(item.key)}`)} /></div>
    </div>
    <ul className="language-grid">{LANGUAGES.map((item, index) => <li key={item.key} className="language-chip glass-panel" style={{ '--language-index': index }}>
      <span>{t(item.key)}</span><strong lang={item.tag}>{item.hello}</strong>
    </li>)}</ul>
  </div>
}
