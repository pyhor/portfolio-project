import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function ValueHighlights({ keys, className = '' }) {
  const { t } = useI18n()
  return (
    <Box className={`value-highlights reveal ${className}`.trim()} role="list">
      {keys.map((key) => (
        <span key={key} className="value-highlights__item" role="listitem">
          {t(key, '')}
        </span>
      ))}
    </Box>
  )
}

export const PERSONAL_VALUE_KEYS = [
  'highlight_ai',
  'highlight_problem',
  'highlight_builder',
  'highlight_creative',
]
