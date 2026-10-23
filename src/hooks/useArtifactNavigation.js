import { useEffect } from 'react'

export function useArtifactNavigation() {
  useEffect(() => {
    const reveal = (hash) => {
      let id
      try { id = decodeURIComponent(hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (!target?.closest('.case-study')) return
      const disclosure = target.closest('details')
      if (disclosure) disclosure.open = true
      return target
    }
    const hashChanged = () => reveal(window.location.hash)?.scrollIntoView({ block: 'start' })
    const clicked = (event) => {
      const anchor = event.target.closest?.('.case-study a[href^="#"]')
      if (anchor) reveal(anchor.getAttribute('href'))
    }
    // Source/evidence links should reveal their artifact, including repeated
    // clicks to the same hash after a visitor manually closes a disclosure.
    document.addEventListener('click', clicked)
    window.addEventListener('hashchange', hashChanged)
    hashChanged()
    return () => {
      document.removeEventListener('click', clicked)
      window.removeEventListener('hashchange', hashChanged)
    }
  }, [])
}
