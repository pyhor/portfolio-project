import { useLayoutEffect } from 'react'

export function useProjectCoverMotion(dependency) {
  useLayoutEffect(() => {
    const page = document.querySelector('.projects-page')
    if (!page) return
    const projects = [...page.querySelectorAll('.featured-projects-stack > article')]
    const incoming = projects.slice(1)
    projects.forEach((project, index) => { project.style.zIndex = String(index + 1) })
    let frame = 0
    const update = () => {
      frame = 0
      projects.forEach((project, index) => {
        // Read tall panels completely before they stop behind the next panel.
        project.style.setProperty('--project-stick-top', `${Math.min(80, innerHeight - project.offsetHeight)}px`)
        project.inert = !!incoming[index] && incoming[index].getBoundingClientRect().top <= 80
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(schedule)
    projects.forEach(project => resize.observe(project))
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    update()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
      projects.forEach(project => {
        project.inert = false
        project.style.removeProperty('z-index')
        project.style.removeProperty('--project-stick-top')
      })
    }
  }, [dependency])
}
