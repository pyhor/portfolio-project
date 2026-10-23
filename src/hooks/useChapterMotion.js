import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useChapterMotion(dependency) {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1025px)' }, context => {
      if (!context.conditions.motion) return
      const page = document.querySelector('.home-page')
      if (!page) return
      const words = [...page.querySelectorAll('.word-accent')]
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      }, { threshold: .45 })
      words.forEach(word => observer.observe(word))
      const desktop = context.conditions.desktop
      const sections = [...page.querySelectorAll(':scope > section')]
      sections.forEach((section, index) => {
        if (!index) return
        // The two overlapping chapters have their own coordinated transition.
        if (section.id === 'home-matters' || section.id === 'home-ideas') return
        const distance = desktop ? (section.id === 'home-playground' ? 70 : section.id === 'home-contact' ? 52 : 36) : 12
        gsap.fromTo(section, { y: distance }, { y: 0, ease: 'none', scrollTrigger: {
          trigger: section, start: 'top bottom', end: desktop ? 'top 55%' : 'top 85%', scrub: desktop ? .25 : true,
          invalidateOnRefresh: true,
        } })
      })
      const thinking = page.querySelector('#home-matters')
      const ideas = page.querySelector('#home-ideas')
      if (thinking && ideas) {
        ScrollTrigger.create({
          trigger: thinking, start: 'bottom bottom', endTrigger: ideas,
          end: 'top top', pin: thinking, pinSpacing: false, invalidateOnRefresh: true,
        })
        gsap.fromTo(ideas, { opacity: .82 }, { opacity: 1, ease: 'none', scrollTrigger: {
          trigger: ideas, start: 'top bottom', end: 'top 25%', scrub: true,
        } })
      }
      return () => { observer.disconnect(); words.forEach(word => word.classList.remove('is-revealed')) }
    })
    return () => media.revert()
  }, [dependency])
}
