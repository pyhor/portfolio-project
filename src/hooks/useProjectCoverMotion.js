import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useProjectCoverMotion(dependency) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = document.querySelector('.projects-page')
      if (!page) return
      const projects = [...page.querySelectorAll('.featured-projects-stack > .project-presentation')]
      const research = page.querySelector('.project-feature')
      const outgoing = []
      const cover = (previous, incoming) => {
        if (!previous || !incoming) return
        outgoing.push(previous)
        ScrollTrigger.create({
          trigger: previous,
          // Read the full project before holding it behind the next one.
          start: () => previous.offsetHeight > innerHeight - 80 ? 'bottom bottom' : 'top top+=80',
          endTrigger: incoming, end: 'top top+=80',
          pin: previous, pinSpacing: false, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => { previous.inert = self.progress >= .999 },
        })
      }
      cover(projects[0], projects[1])
      cover(projects[1], research)
      // Details and responsive images can resize the content while its wrapper is pinned.
      let refreshFrame
      const refresh = () => {
        cancelAnimationFrame(refreshFrame)
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
      }
      const observer = new ResizeObserver(refresh)
      projects.forEach(project => {
        project.querySelectorAll('.featured-project__body, .project-cover').forEach(element => observer.observe(element))
      })
      return () => {
        cancelAnimationFrame(refreshFrame)
        observer.disconnect()
        outgoing.forEach(project => { project.inert = false })
      }
    })
    return () => media.revert()
  }, [dependency])
}
