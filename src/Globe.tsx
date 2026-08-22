import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import earthSkin from './assets/earth-skin.jpg'

function Globe() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 2.6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const texture = new THREE.TextureLoader().load(earthSkin)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ map: texture, shininess: 6 }),
    )
    scene.add(earth)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.045, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(0.55, 0.72, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      }),
    )
    scene.add(atmosphere)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(-2.2, 0.8, 1.6)
    scene.add(sun)

    const pointer = { x: 0, y: 0 }
    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('pointermove', handlePointerMove)

    const resize = () => {
      const size = mount.clientWidth
      if (!size) return
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let frame = 0
    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getDelta()
      earth.rotation.y += delta * 0.12
      atmosphere.rotation.y += delta * 0.03

      earth.rotation.x += (pointer.y * 0.25 - earth.rotation.x) * 0.04
      atmosphere.rotation.x = earth.rotation.x

      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      resizeObserver.disconnect()
      mount.removeChild(renderer.domElement)
      earth.geometry.dispose()
      ;(earth.material as THREE.Material).dispose()
      atmosphere.geometry.dispose()
      ;(atmosphere.material as THREE.Material).dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return <div className="globe" ref={mountRef} />
}

export default Globe
