'use client'
import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedModel({ url, scrollY }) {
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const mixer = useRef()

  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene)
      const action = mixer.current.clipAction(animations[0])
      action.play()
      action.paused = true
    }
  }, [animations, scene])

  useFrame((state, delta) => {
    if (mixer.current) {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(scrollY.current / maxScroll, 1)
      const duration = animations[0]?.duration || 1

      mixer.current.update(delta)
      mixer.current.setTime(duration * scrollPercent)
    }
  })

  return <primitive ref={group} object={scene} scale={0.1} />
}

export default function ScrollControlledAnimation() {
  const scrollY = React.useRef(0)

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div style={{ height: '150vh' }} />

      <div style={{ height: 5500, width: '100%', position: 'relative' }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <AnimatedModel url="/models/wall_e.glb" scrollY={scrollY} />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ height: '150vh' }} />
    </>
  )
}
