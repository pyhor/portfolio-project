import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { scenePose } from '../lib/scenePose'

// One persistent canvas links the hero, content sections, and secondary pages.
export function HeroScene() {
  const mountRef = useRef(null)
  const updateRef = useRef(() => {})
  const { pathname } = useLocation()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let mobile = window.matchMedia('(max-width: 720px)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile })
    } catch {
      return // A quiet CSS orbit remains available without WebGL.
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    mount.classList.add('has-webgl')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.z = 10
    scene.add(new THREE.HemisphereLight(0xe9f3ff, 0x6775a0, 3))
    const key = new THREE.DirectionalLight(0xffffff, 5)
    key.position.set(3, 4, 5)
    const rim = new THREE.DirectionalLight(0x8df5dd, 5)
    rim.position.set(-4, -1, 2)
    const fill = new THREE.DirectionalLight(0xc3a5ff, 6)
    fill.position.set(0, -3, -2)
    scene.add(key, rim, fill)

    const sculpture = new THREE.Group()
    const geometry = new THREE.TorusKnotGeometry(1.38, 0.43, mobile ? 100 : 180, mobile ? 16 : 28, 2, 3)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x91adf3, metalness: 0.32, roughness: 0.2,
      clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 0.9,
      iridescenceIOR: 1.4, iridescenceThicknessRange: [100, 400],
    })
    const knot = new THREE.Mesh(geometry, material)
    sculpture.add(knot)
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.012, 6, 100)
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x91a0c9, transparent: true, opacity: 0.6 })
    const orbit = new THREE.Group()
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    orbit.add(ring)
    const satelliteGeometry = new THREE.SphereGeometry(0.15, 16, 12)
    const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0x9ed8c9, metalness: 0.3, roughness: 0.22 })
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
    satellite.position.x = 2.5
    orbit.add(satellite)
    orbit.rotation.set(1.15, 0.35, -0.25)
    sculpture.add(orbit)
    scene.add(sculpture)

    const palette = [new THREE.Color('#91adf3'), new THREE.Color('#9cd2c6'), new THREE.Color('#b9a4e7')]
    const targetColor = palette[0].clone()
    const pointer = new THREE.Vector2()
    let pose = scenePose({ progress: 0, section: 0, mobile })
    const current = { ...pose }
    let raf = 0
    let updateFrame = 0
    let previous = 0
    let time = 0
    let halfHeight = 1
    let halfWidth = 1
    let baseScale = 1

    const render = (stamp = performance.now()) => {
      cancelAnimationFrame(raf)
      const delta = Math.max(0, Math.min((stamp - previous) / 1000, 0.05))
      previous = stamp
      if (!motion.matches) time += delta
      const ease = motion.matches ? 1 : 1 - Math.exp(-delta * 5)
      for (const property of ['x', 'y', 'scale', 'opacity', 'rotation']) {
        current[property] += (pose[property] - current[property]) * ease
      }
      sculpture.position.set(current.x * halfWidth, current.y * halfHeight, 0)
      sculpture.scale.setScalar(baseScale * current.scale)
      sculpture.rotation.set(
        current.rotation * 0.35 + pointer.y * 0.15,
        current.rotation + time * 0.12 + pointer.x * 0.35,
        -0.2 + pointer.x * 0.08,
      )
      knot.position.y = motion.matches ? 0 : Math.sin(time * 0.7) * 0.1
      orbit.rotation.z = current.rotation * 0.3 + time * 0.08
      material.color.lerp(targetColor, ease)
      mount.style.opacity = current.opacity.toFixed(3)
      renderer.render(scene, camera)
      if (!document.hidden && !motion.matches) raf = requestAnimationFrame(render)
    }
    const restart = () => { previous = performance.now(); render(previous) }
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      const sections = [...document.querySelectorAll('.home-sections > .page-section, .page-shell > .page-section, .page-shell > .contact-block')]
      let section = 0
      sections.forEach((element, index) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.5) section = index
      })
      const anchorElement = document.querySelector('.hero-art-space')
      const rect = anchorElement?.getBoundingClientRect()
      const anchor = rect && rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.3
        ? { x: ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1, y: 1 - ((rect.top + rect.height / 2) / window.innerHeight) * 2 }
        : undefined
      pose = scenePose({ progress, section, mobile, anchor })
      targetColor.copy(palette[section % palette.length])
      if (motion.matches) restart()
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(updateFrame)
      updateFrame = requestAnimationFrame(measure)
    }
    updateRef.current = scheduleMeasure
    const resize = () => {
      mobile = window.matchMedia('(max-width: 720px)').matches
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      halfWidth = halfHeight * camera.aspect
      const diameter = Math.min(width * (mobile ? 0.76 : 0.34), height * 0.64)
      baseScale = diameter / (height / (halfHeight * 2) * 4.8)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75))
      renderer.setSize(width, height)
      measure()
      restart()
    }
    const move = (event) => {
      if (motion.matches || event.pointerType === 'touch') return
      pointer.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1)
    }
    const leave = () => { pointer.set(0, 0) }
    const onScroll = () => { if (!motion.matches) scheduleMeasure() }
    const preferenceChange = () => { pointer.set(0, 0); measure(); restart() }
    const bodyObserver = new ResizeObserver(scheduleMeasure)
    bodyObserver.observe(document.body)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', restart)
    motion.addEventListener('change', preferenceChange)
    resize()

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(updateFrame)
      bodyObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', restart)
      motion.removeEventListener('change', preferenceChange)
      geometry.dispose()
      material.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      satelliteGeometry.dispose()
      satelliteMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      mount.classList.remove('has-webgl')
      updateRef.current = () => {}
    }
  }, [])

  useEffect(() => { updateRef.current() }, [pathname])

  return <div className="world-scene" ref={mountRef} aria-hidden="true"><div className="world-scene__fallback"><span /><span /></div></div>
}
