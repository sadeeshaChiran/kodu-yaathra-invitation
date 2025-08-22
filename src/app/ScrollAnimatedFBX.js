'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer } from 'three'

function AnimatedFBX({ url, scrollY }) {
  const group = useRef()
  const mixer = useRef()
  const [model, setModel] = useState(null)

  useEffect(() => {
    const loader = new FBXLoader()
    loader.load(url, (fbx) => {
      setModel(fbx)
      mixer.current = new AnimationMixer(fbx)
      if (fbx.animations.length > 0) {
        const action = mixer.current.clipAction(fbx.animations[0])
        action.play()
        action.paused = true // we will control time manually
      }
    })
  }, [url])

  useFrame(() => {
    if (mixer.current && model) {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(scrollY.current / maxScroll, 1)
      const duration = model.animations[0]?.duration || 1
      mixer.current.setTime(duration * scrollPercent)
    }
  })

  return model ? <primitive ref={group} object={model} scale={0.01} /> : null
}

export default function ScrollAnimatedFBX() {
  const scrollY = React.useRef(0)

  useEffect(() => {
    function onScroll() {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div style={{ height: '200vh' }} /> {/* so page scrolls */}

      <div style={{ position: 'relative', width: '100%', height: '550px', overflow: 'hidden' }}>
        <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[10, 10, 10]} />
          <AnimatedFBX url="/models/wall_e.fbx" scrollY={scrollY} />
        </Canvas>
      </div>

      <div style={{ height: '200vh' }} />
    </>
  )
}
