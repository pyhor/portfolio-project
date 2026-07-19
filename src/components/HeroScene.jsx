import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Scroll-driven, interactive particle visualization.
 *
 * A single cloud of ~6000 particles continuously morphs between distinct 3D
 * formations as the visitor scrolls the page — sphere → torus knot → double
 * helix → cube lattice → rippling wave. The cursor pushes nearby particles
 * away and gently steers the whole cloud (parallax), so the piece feels alive
 * and reactive rather than a static backdrop.
 *
 * - Fixed behind all content (pointer-events: none), visible on every page.
 * - Theme-aware colours, sourced from the site's CSS custom properties.
 * - Respects prefers-reduced-motion and pauses while the tab is hidden.
 */
export function HeroScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const COUNT = isMobile ? 2600 : 6000

    // ---------- theme colours ----------
    const readPalette = () => {
      const styles = getComputedStyle(document.documentElement)
      const pick = (name, fallback) => new THREE.Color(styles.getPropertyValue(name).trim() || fallback)
      return [
        pick('--accent', '#5b7c99'),
        pick('--accent-2', '#7a9e7e'),
        pick('--accent-3', '#c4a882'),
        pick('--accent-4', '#b8a9c9'),
      ]
    }
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'
    let palette = readPalette()

    // ---------- renderer / scene ----------
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 20

    // ---------- soft round sprite ----------
    const makeSprite = () => {
      const size = 64
      const c = document.createElement('canvas')
      c.width = c.height = size
      const ctx = c.getContext('2d')
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.35, 'rgba(255,255,255,0.85)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
      const tex = new THREE.CanvasTexture(c)
      tex.needsUpdate = true
      return tex
    }
    const sprite = makeSprite()

    // ---------- formations (each fills a Float32Array of length COUNT*3) ----------
    const R = isMobile ? 6.2 : 8
    const rand = (i, salt) => {
      const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
      return x - Math.floor(x)
    }

    const fSphere = (i, out, o) => {
      const t = i / COUNT
      const phi = Math.acos(1 - 2 * t)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      out[o] = R * Math.sin(phi) * Math.cos(theta)
      out[o + 1] = R * Math.sin(phi) * Math.sin(theta)
      out[o + 2] = R * Math.cos(phi)
    }
    const fTorusKnot = (i, out, o) => {
      const p = 2
      const q = 3
      const u = (i / COUNT) * Math.PI * 2 * q
      const r = 2 + Math.cos((q / p) * u)
      const s = R * 0.42
      out[o] = s * r * Math.cos(u)
      out[o + 1] = s * r * Math.sin(u)
      out[o + 2] = s * r * Math.sin((q / p) * u) * 0.9 + (rand(i, 3) - 0.5) * 0.6
    }
    const fHelix = (i, out, o) => {
      const strand = i % 2 === 0 ? 0 : Math.PI
      const t = (i / COUNT) * Math.PI * 7
      const rad = R * 0.5
      out[o] = Math.cos(t + strand) * rad
      out[o + 1] = (i / COUNT - 0.5) * R * 1.6
      out[o + 2] = Math.sin(t + strand) * rad
    }
    const fCube = (i, out, o) => {
      const side = Math.max(2, Math.round(Math.cbrt(COUNT)))
      const gx = i % side
      const gy = Math.floor(i / side) % side
      const gz = Math.floor(i / (side * side)) % side
      const step = (R * 1.2) / (side - 1)
      out[o] = gx * step - R * 0.6
      out[o + 1] = gy * step - R * 0.6
      out[o + 2] = gz * step - R * 0.6
    }
    const fWave = (i, out, o) => {
      const cols = Math.round(Math.sqrt(COUNT))
      const gx = i % cols
      const gz = Math.floor(i / cols)
      const x = (gx / (cols - 1) - 0.5) * R * 1.7
      const z = (gz / (cols - 1) - 0.5) * R * 1.7
      out[o] = x
      out[o + 1] = Math.sin(x * 0.7) * Math.cos(z * 0.7) * R * 0.55
      out[o + 2] = z
    }

    const builders = [fSphere, fTorusKnot, fHelix, fCube, fWave]
    const formations = builders.map((b) => {
      const arr = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT; i += 1) b(i, arr, i * 3)
      return arr
    })

    // ---------- geometry ----------
    const positions = new Float32Array(COUNT * 3)
    positions.set(formations[0])
    const colors = new Float32Array(COUNT * 3)
    const applyColors = () => {
      for (let i = 0; i < COUNT; i += 1) {
        const c = palette[i % palette.length]
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
    }
    applyColors()

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.14 : 0.12,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: isDark() ? 0.9 : 0.85,
      depthWrite: false,
      blending: isDark() ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    const group = new THREE.Group()
    group.add(points)
    group.position.x = isMobile ? 0 : 3.5
    scene.add(group)

    // ---------- interaction state ----------
    const targetPointer = new THREE.Vector2(0, 0)
    const pointer = new THREE.Vector2(0, 0)
    const worldCursor = new THREE.Vector3(999, 999, 0)
    const onPointerMove = (e) => {
      targetPointer.x = (e.clientX / window.innerWidth) * 2 - 1
      targetPointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let scrollProgress = 0
    const computeScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    computeScroll()
    window.addEventListener('scroll', computeScroll, { passive: true })

    // ---------- theme observer ----------
    const themeObserver = new MutationObserver(() => {
      palette = readPalette()
      applyColors()
      geometry.attributes.color.needsUpdate = true
      material.opacity = isDark() ? 0.9 : 0.85
      material.blending = isDark() ? THREE.AdditiveBlending : THREE.NormalBlending
      material.needsUpdate = true
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // ---------- resize ----------
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      computeScroll()
    }
    window.addEventListener('resize', onResize)

    // ---------- animation ----------
    const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
    const clock = new THREE.Clock()
    const posAttr = geometry.attributes.position
    let progress = 0 // eased scroll actually applied
    let raf = 0
    const A = new THREE.Vector3()
    const B = new THREE.Vector3()

    // requestAnimationFrame is automatically throttled/paused by the browser in
    // backgrounded tabs, so no manual visibility gating is needed.
    const render = () => {
      raf = requestAnimationFrame(render)
      const t = clock.getElapsedTime()

      // smooth pointer + scroll
      pointer.x += (targetPointer.x - pointer.x) * 0.06
      pointer.y += (targetPointer.y - pointer.y) * 0.06
      progress += (scrollProgress - progress) * 0.07

      // which two formations we're between
      const F = formations.length
      const seg = progress * (F - 1)
      let idx = Math.floor(seg)
      if (idx >= F - 1) idx = F - 2
      const blend = easeInOut(seg - idx)
      const from = formations[idx]
      const to = formations[idx + 1]

      // cursor projected onto the group's local z=0 plane (approx)
      worldCursor.set(pointer.x * 12 - group.position.x, pointer.y * 8, 0)

      const arr = posAttr.array
      const breathe = reduceMotion ? 0 : Math.sin(t * 0.6) * 0.25
      for (let i = 0; i < COUNT; i += 1) {
        const o = i * 3
        A.set(from[o], from[o + 1], from[o + 2])
        B.set(to[o], to[o + 1], to[o + 2])
        let x = A.x + (B.x - A.x) * blend
        let y = A.y + (B.y - A.y) * blend
        let z = A.z + (B.z - A.z) * blend

        if (!reduceMotion) {
          // gentle idle shimmer
          const w = rand(i, 1)
          x += Math.sin(t * 0.8 + w * 6.28) * 0.12
          y += Math.cos(t * 0.7 + w * 6.28) * 0.12
          // breathing scale
          x *= 1 + breathe * 0.03
          y *= 1 + breathe * 0.03

          // cursor repulsion (in the group's local frame)
          const dx = x - worldCursor.x
          const dy = y - worldCursor.y
          const d2 = dx * dx + dy * dy
          if (d2 < 9) {
            const d = Math.sqrt(d2) || 0.0001
            const push = (1 - d / 3) * 2.4
            x += (dx / d) * push
            y += (dy / d) * push
          }
        }

        // ease toward computed target for fluid morphing
        arr[o] += (x - arr[o]) * 0.14
        arr[o + 1] += (y - arr[o + 1]) * 0.14
        arr[o + 2] += (z - arr[o + 2]) * 0.14
      }
      posAttr.needsUpdate = true

      // whole cloud rotates with scroll + leans toward cursor
      if (!reduceMotion) {
        group.rotation.y += 0.0016 + (pointer.x * 0.4 - group.rotation.y) * 0.02 + progress * 0.0004
        group.rotation.x += (-pointer.y * 0.25 - group.rotation.x) * 0.02
      }
      camera.position.z = 20 - progress * 4

      renderer.render(scene, camera)
    }

    render()

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', computeScroll)
      window.removeEventListener('resize', onResize)
      themeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />
}
