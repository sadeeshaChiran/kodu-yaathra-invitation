'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import GraphemeSplitter from 'grapheme-splitter'
import './Invitation.css'
import gsap from 'gsap'
// in src/app/layout.js or _app.js
import "@fontsource/ubuntu"; // Default weight
import "@fontsource/ubuntu/400.css"; // Regular
import "@fontsource/ubuntu/700.css"; // Bold


// --- Background easing ---
function bgEasing(t) {
    return Math.pow(t, 2.5)
}

// --- Sinhala Letter Animation ---
// --- Sinhala / English Letter Animation with GSAP ---
function ScrollSinhala({ text, startOffset = 0, endOffset = 0.9, fontFamily = "'Sinha Nimsara', sans-serif" }) {
    const scroll = useScroll()
    const [letters, setLetters] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        setLetters(splitter.splitGraphemes(text))
    }, [text])


    return (
        <span
            style={{
                display: 'inline-block',
                fontFamily,
                letterSpacing: '0em',   // 👈 add this
            }}
        >
            {letters.map((letter, index) => (
                <Letter
                    key={index}
                    letter={letter}
                    index={index}
                    scroll={scroll}
                    startOffset={startOffset}
                    endOffset={endOffset}
                />
            ))}
        </span>
    )


}

function Letter({ letter, index, scroll, startOffset, endOffset }) {
    const spanRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const visibleRef = useRef(false)

    useEffect(() => {
        if (!spanRef.current) return
        gsap.set(spanRef.current, { opacity: 0, y: 30, scale: 0.9 })
    }, [])

    useFrame(() => {
        const t = scroll.offset
        const progress = Math.min(Math.max((t - startOffset) / (endOffset - startOffset), 0), 1)
        const shouldBeVisible = progress * 10 > index

        if (shouldBeVisible !== visibleRef.current) {
            visibleRef.current = shouldBeVisible
            setVisible(shouldBeVisible)

            if (shouldBeVisible) {
                gsap.to(spanRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: index * 0.05,
                })
            } else {
                gsap.to(spanRef.current, {
                    opacity: 0,
                    y: 30,
                    scale: 0.8,
                    duration: 0.4,
                    ease: 'power2.in',
                })
            }
        }
    })

    // 👉 handle spaces differently
    if (letter === " ") {
        return <span style={{ display: "inline-block", width: "0.4em" }} />  // adjust width for word gap
    }

    return (
        <span
            ref={spanRef}
            style={{
                display: 'inline-block',

            }}
        >
            {letter}
        </span>
    )
}
function AnimatedSinhalaText({ text, fontFamily = "'0KDROSE', sans-serif", fontWeight = 'normal' }) {
    const textRef = useRef(null)
    const [letters, setLetters] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        setLetters(splitter.splitGraphemes(text))
    }, [text])

    useEffect(() => {
        if (!textRef.current) return
        const spans = textRef.current.querySelectorAll("span")

        gsap.fromTo(
            spans,
            { opacity: 0, y: 30, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.05, // animate letters one by one
            }
        )
    }, [letters])

    return (
        <span
            ref={textRef}
            style={{
                fontSize: 'clamp(1rem, 4vw, 2rem)', // responsive: min 1rem, max 2rem, scales with 4vw
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                textAlign: 'center',
                maxWidth: '90%',
                display: 'inline-block',
                lineHeight: 1.2,
            }}
        >
            {letters.map((letter, index) =>
                letter === " " ? (
                    <span key={index} style={{ display: "inline-block", width: "0.4em" }} />
                ) : (
                    <span key={index} style={{ display: "inline-block" }}>{letter}</span>
                )
            )}
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


function AnimatedLogo({ src, width, topMargin = '0rem' }) {
    const logoRef = useRef()

    useEffect(() => {
        gsap.fromTo(
            logoRef.current,
            { scale: 0, y: 0, opacity: 0 },
            {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.7)',
            }
        )
    }, [])

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: topMargin,
            }}
        >
            <img ref={logoRef} src={src} width={width} alt="Logo" />
        </div>
    )
}

function AnimatedText({ text, fontSize = '1rem', fontFamily = "'Ubuntu', sans-serif", fontWeight = '700', topMargin = '0rem' }) {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;
        gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 20, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }
        );
    }, []);

    return (
        <div
            ref={textRef}
            style={{
                fontSize,
                fontFamily,
                fontWeight,
                marginTop: topMargin, // keep it 0
            }}
        >
            {text}
        </div>
    );
}

// --- Main Component ---
export default function KoduYathra() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas shadows camera={{ position: [0, 2, 12], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                {/* <Suspense fallback={null}>
                    <SpinningModel scale={2.5} />
                </Suspense> */}
                <Suspense fallback={null}>
                    <ScrollControls pages={2} damping={0.1}>
                        <Scene />
                        <Environment preset="sunset" />

                        <Scroll html>

                            <section
                                className="sinhala-font"
                                style={{
                                    height: '100vh',
                                    width: '100vw',
                                    color: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    paddingTop: '2rem',
                                    paddingBottom: '0rem',
                                }}
                            >
                                {/* Logo */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Logo */}
                                    <AnimatedLogo src="/logo1.png" width={300} topMargin="0rem" />

                                    {/* 2024 directly under logo */}
                                    <AnimatedText
                                        text="2024"
                                        fontSize="2rem"
                                        fontFamily="'Ubuntu', sans-serif"
                                        fontWeight="700"
                                        topMargin="1rem" // no gap
                                    />
                                </div>

                                {/* Sinhala text */}
                                <AnimatedSinhalaText
                                    text="තාරුකා මතින් ආලෝකය සොයායන කෝඩූකාරයන්ගේ සොදුරු සංචාරය"
                                    fontSize="1.2rem"
                                    fontFamily="'0KDROSE', sans-serif"
                                    fontWeight="700"
                                />

                                {/* Scroll icon */}
                                <img
                                    src="/scroll.svg"
                                    alt="Scroll down"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        animation: 'bounce 1.5s infinite',
                                    }}
                                />
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
                                    fontFamily: "'Ubuntu', sans-serif",   // 👈 change here
                                }}
                            >
                                <ScrollSinhala
                                    text="Get Ready"
                                    startOffset={0.5}
                                    endOffset={1.0}
                                    fontFamily="'Ubuntu', sans-serif"    // 👈 pass to component too
                                />
                            </section>




                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    )
}

function SpinningModel(props) {
    const { scene } = useGLTF('/models/sky_pano_-_milkyway.glb')

    // Make all meshes transparent
    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.transparent = true
            child.material.opacity = 0.2  // adjust for desired transparency
            child.material.depthWrite = false // optional: prevent z-fighting
        }
    })

    useFrame(() => {
        scene.rotation.y += 0.002
        scene.rotation.x = 0.25
    })

    return <primitive object={scene} {...props} />
}
