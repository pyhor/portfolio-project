import { useEffect, useState } from 'react'
import { nextTypewriterFrame } from '../lib/typewriter'

export function TypewriterText({ phrases }) {
  const [text, setText] = useState('')
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const phraseKey = JSON.stringify(phrases)

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduced) return
    const items = JSON.parse(phraseKey)
    let frame = { index: 0, length: 0, deleting: false }
    let timer
    setText('')
    const tick = () => {
      frame = nextTypewriterFrame(frame, items)
      setText(Array.from(items[frame.index]).slice(0, frame.length).join(''))
      timer = setTimeout(tick, frame.delay)
    }
    timer = setTimeout(tick, 70)
    return () => clearTimeout(timer)
  }, [phraseKey, reduced])

  return <><span className="sr-only">{phrases.join(' · ')}</span><span aria-hidden="true">{reduced ? phrases.join(' · ') : text}</span></>
}
