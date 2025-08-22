'use client'
import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, ScrollControls, useScroll } from '@react-three/drei'

export default function Invitation() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true }} // ✅ allows transparent background
        style={{ position: 'fixed', inset: 0, background: 'transparent' }} // ✅ fullscreen + no bg
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
          <ScrollControls pages={5}>
            <LittlestTokyo scale={2.5} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  )
}

function LittlestTokyo(props) {
  const scroll = useScroll()
  const { scene, animations } = useGLTF('/models/scene.gltf') // ✅ load scene.gltf
  const { actions } = useAnimations(animations, scene)

  // Play + pause animation
  useFrame((state, delta) => {
    const actionName = Object.keys(actions)[0]
    if (!actionName) return
    const action = actions[actionName]

    const offset = scroll.offset
    action.time = THREE.MathUtils.damp(
      action.time,
      (action.getClip().duration / 2) * offset,
      100,
      delta
    )

    // Camera zoom animation
    const zoomStart = 15
    const zoomEnd = 8
    const zoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, offset)
    state.camera.position.set(0, 0, zoom)
    state.camera.lookAt(0, 0, 0)
  })

  return <primitive object={scene} {...props} />
}
