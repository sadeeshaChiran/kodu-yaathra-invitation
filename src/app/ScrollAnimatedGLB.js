'use client'

import * as THREE from 'three'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Sky,
  useScroll,
  useGLTF,
  useAnimations,
  Environment,
} from '@react-three/drei'
import gsap from 'gsap'

export default function ScrollAnimatedGLB() {
  const textRef = useRef()
  const [showText, setShowText] = useState(false)

  // Track scroll offset
  function ScrollListener() {
    const scroll = useScroll()
    useFrame(() => {
      if (scroll.offset > 0.9 && !showText) setShowText(true)
      else if (scroll.offset < 0.9 && showText) setShowText(false)
    })
    return null
  }

  // Animate text in/out
  useEffect(() => {
    if (!textRef.current) return
    if (showText) {
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        pointerEvents: 'auto',
      })
    } else {
      gsap.to(textRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.in',
        pointerEvents: 'none',
      })
    }
  }, [showText])

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Sky scale={100} sunPosition={[40, 0.8, 20]} />
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.1}>
            <ScrollListener />
            <LittlestTokyo scale={0.01} position={[0, 0.2, 0]} />
            <Environment preset="sunset" />
          </ScrollControls>
        </Suspense>
      </Canvas>

      <div
        ref={textRef}
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%) translateY(50px)',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 20,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 0 15px rgba(0,0,0,0.8)',
          fontFamily: 'sans-serif',
        }}
      >
        KODUYATHRA - 2025
      </div>
    </>
  )
}

function LittlestTokyo(props) {
  const scroll = useScroll()
  const { scene, nodes, animations } = useGLTF('/models/LittlestTokyo-transformed.glb')
  const { actions } = useAnimations(animations, scene)

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if (node.isMesh) {
        node.receiveShadow = node.castShadow = true
      }
    })
  }, [nodes])

  useEffect(() => {
    const actionName = Object.keys(actions)[0]
    if (actionName) {
      actions[actionName].play()
      actions[actionName].paused = true
    }
  }, [actions])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) child.material.needsUpdate = true
      }
    })
  }, [scene])

  useFrame((state, delta) => {
    const actionName = Object.keys(actions)[0]
    if (!actionName) return
    const action = actions[actionName]

    const offset = scroll.offset

    // Smoothly animate GLB animation based on scroll
    action.time = THREE.MathUtils.damp(
      action.time,
      (action.getClip().duration / 2) * offset,
      5,
      delta
    )

    // Camera zoom based on scroll
    const zoomStart = 15
    const zoomEnd = 8
    const zoom = THREE.MathUtils.lerp(zoomStart, zoomEnd, offset)
    state.camera.position.set(0, 0, zoom)
    state.camera.lookAt(0, 0, 0)
  })

  return <primitive object={scene} {...props} rotation={[0, Math.PI * 1.1, 4.8]} />
}
