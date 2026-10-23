import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useChapterMotion(dependency) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions.motion) return
      const page = document.querySelector('.home-page')
      if (!page) return
      const words = [...page.querySelectorAll('.word-accent')]
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-revealed', entry.isIntersecting)
        })
      }, { threshold: .45 })
      words.forEach(word => observer.observe(word))
      const coverChapter = (previous, incoming) => {
        if (!previous || !incoming) return
        ScrollTrigger.create({
          trigger: previous,
          // Read taller content first, then hold its entire colored surface.
          start: () => previous.offsetHeight > innerHeight + 1 ? 'bottom bottom' : 'top top',
          endTrigger: incoming, end: 'top top',
          pin: previous, pinSpacing: false, invalidateOnRefresh: true,
          anticipatePin: 1,
        })
        gsap.fromTo(incoming, { opacity: .65 }, {
          opacity: 1, ease: 'none', scrollTrigger: {
            trigger: incoming, start: 'top bottom', end: 'top 55%', scrub: true,
            invalidateOnRefresh: true,
          },
        })
      }
      coverChapter(page.querySelector('#home-matters'), page.querySelector('#home-ideas'))
      const ending = page.querySelector('.home-ending__stage')
      const contact = page.querySelector('#home-contact')
      const journey = page.querySelector('#home-journey')
      let finishContact
      if (ending && contact && journey) {
        // Read all of a tall journey before pinning. Offset contact to the viewport top.
        const measureOffset = () => {
          const offset = Math.max(0, journey.offsetHeight - innerHeight)
          ending.style.setProperty('--contact-offset', `${offset}px`)
          return offset
        }
        measureOffset()
        const revealContact = gsap.fromTo(contact, { xPercent: -100, opacity: 0 }, {
          xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: {
            trigger: ending, start: () => `top top-=${measureOffset()}`, end: () => `+=${innerHeight}`,
            pin: ending, scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
            onRefreshInit: measureOffset,
            onUpdate: self => { journey.inert = self.progress >= .999 },
          },
        })
        // Keyboard access to contact must finish the cover before showing a focused field.
        finishContact = () => {
          const trigger = revealContact.scrollTrigger
          if (trigger.progress < 1) { trigger.scroll(trigger.end); ScrollTrigger.update() }
        }
        contact.addEventListener('focusin', finishContact)
      }
      return () => { observer.disconnect(); if (finishContact) contact.removeEventListener('focusin', finishContact); if (journey) journey.inert = false; ending?.style.removeProperty('--contact-offset'); words.forEach(word => word.classList.remove('is-revealed')) }
    })
    return () => media.revert()
  }, [dependency])
}
