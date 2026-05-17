import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
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
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, deps)
}
