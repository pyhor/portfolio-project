import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useChapterMotion(dependency) {
  useEffect(() => {
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
      const headerHeight = () => document.querySelector('.site-header')?.offsetHeight ?? 80
      const thinking = page.querySelector('#home-matters')
      const ideas = page.querySelector('#home-ideas')
      if (thinking && ideas) {
        ScrollTrigger.create({
          trigger: thinking,
          // Keep tall chapters readable before holding the whole section in place.
          start: () => thinking.offsetHeight > innerHeight - headerHeight() ? 'bottom bottom' : `top top+=${headerHeight()}`,
          endTrigger: ideas, end: () => `top top+=${headerHeight()}`,
          pin: thinking, pinSpacing: false, invalidateOnRefresh: true,
          anticipatePin: 1,
        })
        gsap.fromTo(ideas, { opacity: .65 }, { opacity: 1, ease: 'none', scrollTrigger: {
          trigger: ideas, start: 'top bottom', end: 'top 55%', scrub: true,
        } })
      }
      return () => { observer.disconnect(); words.forEach(word => word.classList.remove('is-revealed')) }
    })
    return () => media.revert()
  }, [dependency])
}
