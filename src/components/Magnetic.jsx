import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Magnetic({ children, className = '', as: Tag = 'a', ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const move = (event) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      gsap.to(element, { x: x * 0.14, y: y * 0.14, duration: 0.35, ease: 'power3.out' })
    }
    const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' })

    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <Tag className={`magnetic ${className}`} ref={ref} {...props}>
      {children}
    </Tag>
  )
}
