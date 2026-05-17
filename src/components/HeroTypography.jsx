import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function HeroTypography({ profileBio, children }) {
  const { t, ready } = useI18n()
  const phrases = useMemo(
    () => [
      t('hero_rotate_1', 'immersive web products'),
      t('hero_rotate_2', 'futuristic interfaces'),
      t('hero_rotate_3', 'GitHub-powered showcases'),
    ],
    [t, ready],
  )

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!ready) return undefined
    const phrase = phrases[phraseIndex % phrases.length]
    let timeout

    if (!deleting && display.length < phrase.length) {
      timeout = setTimeout(() => setDisplay(phrase.slice(0, display.length + 1)), 58)
    } else if (!deleting && display.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(phrase.slice(0, display.length - 1)), 32)
    } else {
      setDeleting(false)
      setPhraseIndex((value) => (value + 1) % phrases.length)
    }

    return () => clearTimeout(timeout)
  }, [display, deleting, phraseIndex, phrases, ready])

  return (
    <Box className="hero-copy reveal" key={ready ? 'ready' : 'loading'}>
      <h1 className="hero-title">
        <span className="split-line">{t('hero_title_line', 'Building digital systems with')}</span>
        <span className="gradient-text split-line hero-title__accent">
          {t('hero_title_gradient', 'cute modern interfaces')}
        </span>
        <span className="split-line typing-line">
          <span className="typing-prefix">{t('hero_typing_prefix', 'and ')}</span>
          <span className="typing-cursor" aria-live="polite">
            {display}
            <span className="caret" aria-hidden="true" />
          </span>
        </span>
      </h1>
      {children}
      <p className="hero-lede split-line">
        {profileBio || t('hero_lede', '')}
      </p>
    </Box>
  )
}
