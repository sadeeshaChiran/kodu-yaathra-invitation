'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AnimationMixer, Clock } from 'three'
import { OrbitControls } from '@react-three/drei'

function FBXModel({ url, scrollY }) {
  const group = useRef()
  const mixer = useRef()
  const clock = useRef(new Clock())
  const [model, setModel] = useState(null)

  useEffect(() => {
    const loader = new FBXLoader()
    loader.load(url, (fbx) => {
      setModel(fbx)
      mixer.current = new AnimationMixer(fbx)
      if (fbx.animations.length > 0) {
        const action = mixer.current.clipAction(fbx.animations[0])
        action.play()
        action.paused = true
      }
    })
  }, [url])

  useFrame(() => {
    if (mixer.current && model) {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(scrollY.current / maxScroll, 1)
      const clipDuration = model.animations[0]?.duration || 1
      mixer.current.time = clipDuration * scrollPercent
      mixer.current.update(0)
    }
  })

  return model ? (
    <primitive
      ref={group}
      object={model}
      scale={[0.01, 0.01, 0.01]} // adjust as needed
      position={[0, 0, 0]}
    />
  ) : (
    // fallback mesh to confirm canvas works
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default function FBXModelOnScroll() {
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
    <Canvas style={{ height: '100vh' }} camera={{ position: [0, 2, 5], fov: 60 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} />
      <FBXModel url="/models/wall_e.fbx" scrollY={scrollY} />
      <OrbitControls />
      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />
    </Canvas>
    <div style={{ height: '200vh' }} />
   </>
  )
}
