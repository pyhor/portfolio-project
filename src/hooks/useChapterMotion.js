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
      const pinnedChapters = []
      const coverChapter = (previous, incoming, fade = false) => {
        if (!previous || !incoming) return
        pinnedChapters.push(previous)
        ScrollTrigger.create({
          trigger: previous,
          // Let taller chapters be read before holding them behind the next chapter.
          start: () => previous.offsetHeight > innerHeight ? 'bottom bottom' : 'top top',
          endTrigger: incoming, end: 'top top',
          pin: previous, pinSpacing: false, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => { previous.inert = self.progress >= .999 },
        })
        if (fade) gsap.fromTo(incoming, { opacity: .65 }, {
          opacity: 1, ease: 'none', scrollTrigger: {
            trigger: incoming, start: 'top bottom', end: 'top 55%', scrub: true,
            invalidateOnRefresh: true,
          },
        })
      }
      coverChapter(page.querySelector('#home-matters'), page.querySelector('#home-ideas'), true)
      coverChapter(page.querySelector('#home-build'), page.querySelector('#home-playground'))
      // Natural document flow brings the solid contact panel upward from below 07.
      coverChapter(page.querySelector('#home-journey'), page.querySelector('#home-contact'))
      return () => {
        observer.disconnect()
        pinnedChapters.forEach(chapter => { chapter.inert = false })
        words.forEach(word => word.classList.remove('is-revealed'))
      }
    })
    return () => media.revert()
  }, [dependency])
}
