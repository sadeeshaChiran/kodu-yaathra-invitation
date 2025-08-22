'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import GraphemeSplitter from 'grapheme-splitter'
import './Invitation.css'
import gsap from 'gsap'

// --- Background easing ---
function bgEasing(t) {
    return Math.pow(t, 2.5)
}

// --- Sinhala Letter Animation ---
function ScrollSinhala({ text, startOffset = 0, endOffset = 0.9, fontFamily = "'Sinha Nimsara', sans-serif" }) {
    const scroll = useScroll()
    const [letters, setLetters] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        setLetters(splitter.splitGraphemes(text))
    }, [text])

    return (
        <span style={{ display: 'inline-block', fontFamily }}>
            {letters.map((letter, index) => (
                <Letter key={index} letter={letter} index={index} scroll={scroll} startOffset={startOffset} endOffset={endOffset} />
            ))}
        </span>
    )
}

function Letter({ letter, index, scroll, startOffset, endOffset }) {
    const [visible, setVisible] = useState(false)

    useFrame(() => {
        const t = scroll.offset
        const progress = Math.min(Math.max((t - startOffset) / (endOffset - startOffset), 0), 1)
        if (progress * 10 > index) setVisible(true)
    })

    return (
        <span
            style={{
                display: 'inline-block',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                marginRight: '0.1em',
            }}
        >
            {letter}
        </span>
    )
}

// --- 3D Ship Scene ---
function Scene() {
    const shipRef = useRef()
    const scroll = useScroll()
    const { scene } = useGLTF('/models/ship.glb')
    const { gl } = useThree()
    const prevRotation = useRef(0)

    useFrame(() => {
        if (!shipRef.current) return
        const t = scroll.offset

        // --- Make ship visible only after scrolling starts ---
        const visibleProgress = Math.min(Math.max(t * 5, 0), 1) // 0->1 quickly
        shipRef.current.scale.set(0.5 * visibleProgress, 0.5 * visibleProgress, 0.5 * visibleProgress)

        // --- Position animation ---
        let x = 10 - 20 * Math.min(t / 0.3, 1)
        if (t > 0.3) x = -10 + 20 * ((t - 0.3) / 0.7)
        const baseY = -2
        const y = baseY + Math.sin(t * Math.PI * 2) * 0.5
        const z = -5 + Math.sin(t * Math.PI) * 0.5
        shipRef.current.position.set(x, y, z)

        // --- Rotation ---
        const targetRotation = Math.PI * Math.min(Math.max((t - 0.05) / (0.45 - 0.05), 0), 1)
        prevRotation.current = THREE.MathUtils.lerp(prevRotation.current, targetRotation, 0.1)
        shipRef.current.rotation.y = prevRotation.current

        // --- Background color ---
        const mixedColor = new THREE.Color('#000000').lerp(new THREE.Color('#ffffff'), bgEasing(t))
        gl.setClearColor(mixedColor)
    })

    return <primitive ref={shipRef} object={scene} position={[10, -2, 0]} />
}


function AnimatedLogo({ src, width }) {
    const logoRef = useRef()

    useEffect(() => {
        gsap.fromTo(
            logoRef.current,
            { scale: 0, y: 50, opacity: 0 },
            {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.7)',
            }
        )
    }, [])

    return <img ref={logoRef} src={src} width={width} alt="Logo" />
}

// --- Main Component ---
export default function KoduYathra() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas shadows camera={{ position: [0, 2, 12], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                    <ScrollControls pages={2} damping={0.1}>
                        <Scene />
                        <Environment preset="sunset" />

                        <Scroll html>
                            {/* Page 1 - Sinhala */}
                            <section
                                className="sinhala-font"
                                style={{
                                    height: '100vh',
                                    width: '100vw',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    flexDirection: 'column',
                                }}
                            >
                                <AnimatedLogo src="/logo1.png" width={300} />
                            </section>



                            {/* Page 2 - English */}
                            <section
                                style={{
                                    height: '100vh',
                                    width: '100vw',
                                    color: 'black',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                <ScrollSinhala text="Get Ready" startOffset={0.5} endOffset={1.0} fontFamily="Arial, sans-serif" />
                            </section>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    )
}
