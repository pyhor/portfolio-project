import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="site-footer reveal">
      <span>pyhor</span>
      <span className="site-footer__credit">
        {t(
          'footer_credit',
          'This website was assisted by ChatGPT, Codex, Cursor, and mainly built by me.',
        )}
      </span>
    </footer>
  )
}
