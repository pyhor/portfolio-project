import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Magnetic({ children, className = '', as: Tag = 'a', ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const media = gsap.matchMedia()
    media.add(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
      () => {
        const xTo = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3.out' })
        const yTo = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3.out' })

        const move = (event) => {
          if (event.pointerType === 'touch') return
          const rect = element.getBoundingClientRect()
          xTo(Math.max(-6, Math.min(6, (event.clientX - rect.left - rect.width / 2) * 0.1)))
          yTo(Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * 0.1)))
        }
        const leave = (event) => {
          if (event.pointerType === 'touch') return
          xTo(0)
          yTo(0)
        }

        element.addEventListener('pointermove', move)
        element.addEventListener('pointerleave', leave)
        return () => {
          element.removeEventListener('pointermove', move)
          element.removeEventListener('pointerleave', leave)
        }
      },
    )

    return () => media.revert()
  }, [])

  return (
    <Tag className={`magnetic ${className}`} ref={ref} {...props}>
      {children}
    </Tag>
  )
}
