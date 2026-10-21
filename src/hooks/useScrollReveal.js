import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.reveal').forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                once: true,
              },
            },
          )
        })

        gsap.utils.toArray('.timeline-reveal').forEach((element, index) => {
          gsap.fromTo(
            element,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.85,
              delay: (index % 3) * 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            },
          )
        })
        gsap.utils.toArray('.media-grid').forEach((element) => {
          gsap.fromTo(element, { y: 14 }, {
            y: -14, ease: 'none',
            scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 },
          })
        })
      })
      return () => ctx.revert()
    })
    return () => media.revert()
  }, deps)
}
