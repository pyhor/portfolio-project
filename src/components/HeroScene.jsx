import { useEffect, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { useI18n } from '../context/I18nProvider'

export function HeroScene() {
  const mountRef = useRef(null)
  const controlsRef = useRef({ x: 0, y: 0, reset: () => {}, render: () => {} })
  const { t } = useI18n()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 720px)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile })
    } catch {
      // Keep the CSS sculpture when WebGL is unavailable.
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
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
    const geometry = new THREE.TorusKnotGeometry(1.38, 0.43, mobile ? 120 : 200, mobile ? 20 : 32, 2, 3)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x91adf3, metalness: 0.32, roughness: 0.2,
      clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 0.9,
      iridescenceIOR: 1.4, iridescenceThicknessRange: [100, 400],
    })
    const knot = new THREE.Mesh(geometry, material)
    sculpture.add(knot)
    const ringGeometry = new THREE.TorusGeometry(2.35, 0.012, 8, 140)
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x91a0c9, transparent: true, opacity: 0.45 })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.set(1.15, 0.35, -0.25)
    sculpture.add(ring)
    sculpture.rotation.z = -0.2
    scene.add(sculpture)

    let raf = 0
    let visible = true
    let dragging = false
    let lastX = 0
    let lastY = 0
    let scroll = 0
    let time = 0
    let previous = 0
    const target = controlsRef.current
    const draw = (stamp = 0) => {
      cancelAnimationFrame(raf)
      const delta = Math.min((stamp - previous) / 1000, 0.05)
      previous = stamp
      if (!motion.matches) time += Math.max(0, delta)
      const ease = motion.matches ? 1 : 0.07
      sculpture.rotation.x += (target.x + (motion.matches ? 0 : scroll * 0.55) - sculpture.rotation.x) * ease
      sculpture.rotation.y += (target.y + (motion.matches ? 0 : time * 0.13 + scroll) - sculpture.rotation.y) * ease
      knot.position.y = motion.matches ? 0 : Math.sin(time * 0.7) * 0.12
      renderer.render(scene, camera)
      if (visible && !document.hidden && !motion.matches) raf = requestAnimationFrame(draw)
    }
    const restart = () => { previous = performance.now(); draw(previous) }
    target.render = restart
    target.reset = () => { target.x = 0; target.y = 0; time = 0; restart() }
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      restart()
    }
    const down = (event) => {
      if (event.pointerType === 'touch' || motion.matches) return
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      mount.setPointerCapture(event.pointerId)
    }
    const move = (event) => {
      if (motion.matches || event.pointerType === 'touch') return
      if (dragging) {
        target.y += (event.clientX - lastX) * 0.008
        target.x += (event.clientY - lastY) * 0.008
        lastX = event.clientX
        lastY = event.clientY
      } else {
        const rect = mount.getBoundingClientRect()
        target.y = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7
        target.x = ((event.clientY - rect.top) / rect.height - 0.5) * 0.4
      }
    }
    const up = () => { dragging = false }
    const onScroll = () => { scroll = Math.min(2, window.scrollY / window.innerHeight) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart() })
    observer.observe(mount)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    mount.addEventListener('pointerdown', down)
    mount.addEventListener('pointermove', move)
    mount.addEventListener('pointerup', up)
    mount.addEventListener('pointercancel', up)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', restart)
    motion.addEventListener('change', restart)
    resize()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      resizeObserver.disconnect()
      mount.removeEventListener('pointerdown', down)
      mount.removeEventListener('pointermove', move)
      mount.removeEventListener('pointerup', up)
      mount.removeEventListener('pointercancel', up)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', restart)
      motion.removeEventListener('change', restart)
      geometry.dispose()
      material.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      mount.classList.remove('has-webgl')
      target.reset = () => {}
      target.render = () => {}
    }
  }, [])

  const rotate = (direction) => {
    controlsRef.current.y += direction * Math.PI / 4
    controlsRef.current.render()
  }

  return (
    <div className="sculpture-stage">
      <div className="sculpture-stage__top"><span>{t('sculpture_title', 'Ideas, in a different dimension.')}</span><span className="sculpture-spark">✳</span></div>
      <div ref={mountRef} className="sculpture-canvas" aria-hidden="true">
        <div className="sculpture-placeholder"><span /><span /><span /></div>
      </div>
      <div className="sculpture-stage__bottom">
        <span>{t('sculpture_hint', 'Drag to explore · scroll to transform')}</span>
        <div className="sculpture-controls">
          <button type="button" onClick={() => rotate(-1)} aria-label={t('sculpture_left', 'Rotate sculpture left')}>←</button>
          <button type="button" onClick={() => rotate(1)} aria-label={t('sculpture_right', 'Rotate sculpture right')}>→</button>
          <button type="button" onClick={() => controlsRef.current.reset()} aria-label={t('sculpture_reset', 'Reset sculpture')}><RotateCcw size={13} /></button>
        </div>
      </div>
    </div>
  )
}
