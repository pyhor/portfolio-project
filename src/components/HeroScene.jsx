import { useEffect, useId, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { ArrowUpRight, Move, Pause, Play, RotateCcw } from 'lucide-react'
import { useI18n } from '../context/I18nProvider.jsx'

const INITIAL_ROTATION = { x: 0.23, y: -0.35, z: -0.16 }

function SculptureFallback({ id }) {
  return (
    <svg className="hero-scene__fallback" viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a4cfdf" />
          <stop offset=".32" stopColor="#477eab" />
          <stop offset=".7" stopColor="#264f75" />
          <stop offset="1" stopColor="#79b5bf" />
        </linearGradient>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c3c2b9" />
          <stop offset=".27" stopColor="#fffdf5" />
          <stop offset=".55" stopColor="#77796f" />
          <stop offset=".75" stopColor="#e8e7de" />
          <stop offset="1" stopColor="#aaa99f" />
        </linearGradient>
      </defs>
      <g transform="translate(300 250) rotate(-23)" fill="none">
        <ellipse rx="186" ry="98" stroke={`url(#${id}-silver)`} strokeWidth="3" />
        <ellipse className="hero-scene__fallback-loop" rx="105" ry="155" transform="rotate(38)" stroke={`url(#${id}-blue)`} strokeWidth="49" />
        <ellipse className="hero-scene__fallback-loop" rx="105" ry="155" transform="rotate(-38)" stroke={`url(#${id}-blue)`} strokeWidth="49" />
        <path className="hero-scene__fallback-loop" d="M -118 -66 C -154 -10 -133 61 -80 104" stroke={`url(#${id}-blue)`} strokeWidth="49" strokeLinecap="round" />
        <ellipse rx="177" ry="93" stroke={`url(#${id}-silver)`} strokeWidth="3" strokeDasharray="280 580" transform="rotate(180)" />
      </g>
    </svg>
  )
}

/**
 * A self-contained studio exhibit. Rendering only runs while the exhibit is
 * visible; manual controls render a single frame when animation is disabled.
 */
export function HeroScene() {
  const { t } = useI18n()
  const id = useId().replace(/:/g, '')
  const mountRef = useRef(null)
  const controllerRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [mode, setMode] = useState('form')
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 720px)')
    const cleanups = []
    const geometries = []
    const materials = []
    let renderer
    let environment
    let environmentRoom
    let generator
    let frame = 0
    let disposed = false
    let failed = false
    let visible = true
    let manualPause = false
    let reduceMotion = media.matches
    let dragging = false
    let lastTime = 0
    let elapsed = 0
    let activePointer = null
    let lastX = 0
    let lastY = 0

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
    }
    const on = (target, name, callback, options) => {
      target.addEventListener(name, callback, options)
      cleanups.push(() => target.removeEventListener(name, callback, options))
    }
    const teardown = () => {
      if (disposed) return
      disposed = true
      stop()
      cleanups.reverse().forEach((cleanup) => cleanup())
      controllerRef.current = null
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      environment?.dispose()
      environmentRoom?.dispose()
      generator?.dispose()
      if (renderer) {
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile.matches, powerPreference: 'low-power' })
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18
      renderer.domElement.setAttribute('aria-hidden', 'true')
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
      camera.position.set(0, 0, 10)
      generator = new THREE.PMREMGenerator(renderer)
      environmentRoom = new RoomEnvironment()
      environment = generator.fromScene(environmentRoom, 0.04)
      scene.environment = environment.texture
      scene.environmentIntensity = 1.25
      environmentRoom.dispose()
      environmentRoom = null
      generator.dispose()
      generator = null

      const sculpture = new THREE.Group()
      sculpture.rotation.set(INITIAL_ROTATION.x, INITIAL_ROTATION.y, INITIAL_ROTATION.z)
      const hoverGroup = new THREE.Group()
      hoverGroup.add(sculpture)
      scene.add(hoverGroup)
      let hoverX = 0
      let hoverY = 0
      let velocity = 0

      const geometry = new THREE.TorusKnotGeometry(1.31, 0.43, mobile.matches ? 112 : 176, 24, 2, 3)
      const surface = new THREE.MeshPhysicalMaterial({
        color: '#477eab',
        metalness: 0.45,
        roughness: 0.27,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
      })
      geometries.push(geometry)
      materials.push(surface)
      const knot = new THREE.Mesh(geometry, surface)
      sculpture.add(knot)

      // A coarser separate geometry makes the mesh mode legible on small screens.
      const wireGeometry = new THREE.TorusKnotGeometry(1.31, 0.43, 64, 12, 2, 3)
      const wireMaterial = new THREE.MeshBasicMaterial({ color: '#447e91', wireframe: true, transparent: true, opacity: 0.72 })
      geometries.push(wireGeometry)
      materials.push(wireMaterial)
      const wire = new THREE.Mesh(wireGeometry, wireMaterial)
      wire.visible = false
      sculpture.add(wire)

      const ringGeometry = new THREE.TorusGeometry(2.48, 0.022, 10, 160)
      const chrome = new THREE.MeshStandardMaterial({ color: '#d7d7cd', metalness: 0.92, roughness: 0.2 })
      geometries.push(ringGeometry)
      materials.push(chrome)
      const ring = new THREE.Mesh(ringGeometry, chrome)
      ring.rotation.set(1.02, 0.25, -0.2)
      sculpture.add(ring)

      scene.add(new THREE.HemisphereLight('#fff9e9', '#b8a18d', 2.4))
      const keyLight = new THREE.DirectionalLight('#fff7e8', 3.5)
      keyLight.position.set(-3, 5, 6)
      scene.add(keyLight)
      const fillLight = new THREE.DirectionalLight('#ffffff', 2)
      fillLight.position.set(4, 1, -2)
      scene.add(fillLight)

      const canRender = () => !disposed && !failed && visible && !document.hidden
      const canAnimate = () => canRender() && !reduceMotion && !manualPause && !dragging
      const fail = () => {
        if (disposed || failed) return
        failed = true
        stop()
        renderer.domElement.style.visibility = 'hidden'
        setStatus('fallback')
      }
      const draw = () => {
        if (!canRender()) return
        try {
          renderer.render(scene, camera)
        } catch {
          fail()
        }
      }
      const animate = (time) => {
        frame = 0
        if (!canAnimate()) return
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
        lastTime = time
        elapsed += delta
        velocity *= Math.exp(-delta * 6)
        sculpture.rotation.y += delta * (0.13 + velocity)
        const blend = 1 - Math.exp(-delta * 9)
        hoverGroup.rotation.x += (hoverX - hoverGroup.rotation.x) * blend
        hoverGroup.rotation.y += (hoverY - hoverGroup.rotation.y) * blend
        sculpture.position.y = Math.sin(elapsed * 0.7) * 0.075
        draw()
        if (canAnimate()) frame = requestAnimationFrame(animate)
      }
      const sync = () => {
        stop()
        draw()
        if (canAnimate()) frame = requestAnimationFrame(animate)
      }

      const updatePalette = () => {
        const styles = getComputedStyle(mount)
        surface.color.set(styles.getPropertyValue('--scene-surface').trim() || '#477eab')
        wireMaterial.color.set(styles.getPropertyValue('--scene-wire').trim() || '#447e91')
        draw()
      }
      const resize = () => {
        const width = Math.max(mount.clientWidth, 1)
        const height = Math.max(mount.clientHeight, 1)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.35 : 1.75))
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.position.z = camera.aspect < 1 ? 10.8 : 9.7
        camera.updateProjectionMatrix()
        draw()
      }
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      cleanups.push(() => resizeObserver.disconnect())
      if ('IntersectionObserver' in window) {
        const intersection = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          sync()
        }, { threshold: 0 })
        intersection.observe(mount)
        cleanups.push(() => intersection.disconnect())
      }
      const themeObserver = new MutationObserver(updatePalette)
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      cleanups.push(() => themeObserver.disconnect())
      on(media, 'change', (event) => {
        reduceMotion = event.matches
        setReducedMotion(event.matches)
        sculpture.position.y = 0
        sync()
      })
      on(mobile, 'change', resize)
      on(document, 'visibilitychange', sync)
      on(renderer.domElement, 'webglcontextlost', (event) => {
        event.preventDefault()
        fail()
      })

      const endDrag = (event) => {
        if (event.pointerId !== activePointer) return
        dragging = false
        activePointer = null
        mount.classList.remove('is-dragging')
        if (mount.hasPointerCapture(event.pointerId)) mount.releasePointerCapture(event.pointerId)
        sync()
      }
      on(mount, 'pointerdown', (event) => {
        if (failed || reduceMotion || event.button !== 0 || activePointer !== null) return
        activePointer = event.pointerId
        lastX = event.clientX
        lastY = event.clientY
        dragging = true
        stop()
        mount.classList.add('is-dragging')
        mount.setPointerCapture(event.pointerId)
      })
      on(mount, 'pointerleave', () => { hoverX = 0; hoverY = 0 })
      on(mount, 'pointermove', (event) => {
        if (!dragging && event.pointerType === 'mouse' && !reduceMotion && !manualPause) {
          const bounds = mount.getBoundingClientRect()
          hoverX = (event.clientY - bounds.top - bounds.height / 2) / bounds.height * 0.12
          hoverY = (event.clientX - bounds.left - bounds.width / 2) / bounds.width * 0.18
        }
        // Reduced motion disables pointer-driven movement. Discrete keyboard
        // rotation and the reset button remain available.
        if (!dragging || event.pointerId !== activePointer || reduceMotion || failed) return
        velocity = Math.max(-1.5, Math.min(1.5, (event.clientX - lastX) * 0.08))
        sculpture.rotation.y += (event.clientX - lastX) * 0.009
        sculpture.rotation.x += (event.clientY - lastY) * 0.007
        lastX = event.clientX
        lastY = event.clientY
        draw()
      })
      on(mount, 'pointerup', endDrag)
      on(mount, 'pointercancel', endDrag)
      on(mount, 'lostpointercapture', endDrag)

      controllerRef.current = {
        setMode: (next) => {
          knot.visible = next === 'form'
          wire.visible = next === 'mesh'
          draw()
        },
        setPaused: (next) => {
          manualPause = next
          sync()
        },
        rotate: (key) => {
          const step = Math.PI / 12
          if (key === 'ArrowLeft') sculpture.rotation.y -= step
          if (key === 'ArrowRight') sculpture.rotation.y += step
          if (key === 'ArrowUp') sculpture.rotation.x -= step
          if (key === 'ArrowDown') sculpture.rotation.x += step
          draw()
        },
        reset: () => {
          sculpture.rotation.set(INITIAL_ROTATION.x, INITIAL_ROTATION.y, INITIAL_ROTATION.z)
          sculpture.position.y = 0
          elapsed = 0
          velocity = 0
          hoverX = 0
          hoverY = 0
          hoverGroup.rotation.set(0, 0, 0)
          draw()
        },
      }
      updatePalette()
      resize()
      if (!failed) setStatus('ready')
      sync()
    } catch {
      teardown()
      setStatus('fallback')
    }

    return teardown
  }, [])

  const chooseMode = (next) => {
    setMode(next)
    controllerRef.current?.setMode(next)
  }
  const togglePause = () => {
    const next = !paused
    setPaused(next)
    controllerRef.current?.setPaused(next)
  }
  const handleKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    controllerRef.current?.rotate(event.key)
  }

  return (
    <div className={`hero-scene hero-scene--${mode} hero-scene--${status}`}>
      <div className="hero-scene__topline" aria-hidden="true">
        <span><i /> {t('scene_label', 'A little creative engineering')}</span>
        <ArrowUpRight size={17} strokeWidth={1.4} />
      </div>
      <div className="hero-scene__coordinates" aria-hidden="true">
        <span>FIG. 01</span>
        <span>X / Y / Z</span>
      </div>
      <div className="hero-scene__orbit hero-scene__orbit--one" aria-hidden="true" />
      <div className="hero-scene__orbit hero-scene__orbit--two" aria-hidden="true" />
      <div className="hero-scene__shadow" aria-hidden="true" />
      {status !== 'ready' && <SculptureFallback id={id} />}
      <div
        ref={mountRef}
        className="hero-scene__canvas"
        data-cursor={status === 'ready' && !reducedMotion ? 'drag' : undefined}
        tabIndex={status === 'ready' ? 0 : -1}
        role={status === 'fallback' ? 'img' : 'group'}
        aria-label={status === 'fallback'
          ? t('scene_preview_label', 'Steel-blue loop sculpture with a silver orbit')
          : t('scene_accessible_label', 'Interactive steel-blue knot sculpture. Use the arrow keys to rotate.')}
        aria-describedby={`${id}-hint`}
        onKeyDown={handleKeyDown}
      />
      <div className="hero-scene__bottom">
        <div className="hero-scene__modes" role="group" aria-label={t('scene_mode_label', 'Sculpture display')}>
          <button type="button" aria-pressed={mode === 'form'} onClick={() => chooseMode('form')}>
            {t('scene_form', 'Form')}
          </button>
          <button type="button" aria-pressed={mode === 'mesh'} onClick={() => chooseMode('mesh')}>
            {t('scene_mesh', 'Mesh')}
          </button>
        </div>
        <div className="hero-scene__actions">
          <button
            type="button"
            onClick={togglePause}
            disabled={reducedMotion || status !== 'ready'}
            aria-label={paused ? t('scene_resume', 'Resume rotation') : t('scene_pause', 'Pause rotation')}
            aria-pressed={paused || reducedMotion}
            title={reducedMotion ? t('scene_motion_off', 'Animation off: reduced motion') : paused ? t('scene_resume', 'Resume rotation') : t('scene_pause', 'Pause rotation')}
          >
            {paused || reducedMotion ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            type="button"
            onClick={() => controllerRef.current?.reset()}
            disabled={status !== 'ready'}
            aria-label={t('scene_reset', 'Reset sculpture rotation')}
            title={t('scene_reset', 'Reset sculpture rotation')}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <p className="hero-scene__hint" id={`${id}-hint`}>
        <Move size={12} aria-hidden="true" />
        {status === 'fallback'
          ? t('scene_fallback', 'Sculpture preview · 3D is unavailable in this browser')
          : reducedMotion
            ? t('scene_reduced_hint', 'Use arrow keys to explore · reduced motion')
            : t('scene_hint', 'Drag to explore · arrow keys work, too')}
      </p>
    </div>
  )
}
