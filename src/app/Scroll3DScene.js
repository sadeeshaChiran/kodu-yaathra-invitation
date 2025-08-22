'use client'
import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function ScrollAnimation({ scrollY }) {
  const mesh = useRef()

  useFrame(() => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollPercent = Math.min(scrollY.current / maxScroll, 1)

    if (mesh.current) {
      mesh.current.rotation.y = scrollPercent * Math.PI * 2
      mesh.current.position.y = scrollPercent * 2
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function Scroll3DScene() {
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


      {/* Fixed canvas container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '550px',
          backgroundColor: '#222',
          zIndex: 10,
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <ScrollAnimation scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Content below to allow more scrolling */}
      <div style={{ height: '150vh', backgroundColor: '#ddd' }} />
    </>
  )
}
