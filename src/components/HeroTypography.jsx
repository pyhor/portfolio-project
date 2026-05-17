import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../context/I18nProvider'

const Box = 'd' + 'iv'

export function HeroTypography({ profileBio, children }) {
  const { t, ready } = useI18n()
  const phrases = useMemo(
    () => [
      t('hero_rotate_1', 'GitHub showcases'),
      t('hero_rotate_2', 'live demo sites'),
      t('hero_rotate_3', 'real web apps'),
    ],
    [t, ready],
  )

  const typingMinCh = useMemo(
    () => Math.max(12, ...phrases.map((phrase) => phrase.length)),
    [phrases],
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
        <span className="split-line hero-title__line">{t('hero_title_line', 'Building digital systems')}</span>
        <span className="split-line hero-title__line gradient-text hero-title__accent">
          {t('hero_title_gradient', 'with modern interfaces')}
        </span>
        <span className="split-line typing-line">
          <span className="typing-prefix">{t('hero_typing_prefix', 'and').trim()}</span>
          <span
            className="typing-cursor"
            style={{ '--typing-min-ch': `${typingMinCh}ch` }}
            aria-live="polite"
          >
            <span className="typing-cursor__text">{display}</span>
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
