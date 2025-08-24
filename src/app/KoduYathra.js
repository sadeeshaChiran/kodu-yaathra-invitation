'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import GraphemeSplitter from 'grapheme-splitter'
import './Invitation.css'
import gsap from 'gsap'
// Fonts
import "@fontsource/ubuntu";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/700.css";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// --- Background easing ---
function bgEasing(t) {
    return Math.pow(t, 2.5)
}

// --- Sinhala Letter Animation ---
function ScrollSinhala({ text, startOffset = 0, endOffset = 0.9, fontFamily = "'Sinha Nimsara', sans-serif", marginTop = '0rem' }) {
    const scroll = useScroll()
    const [letters, setLetters] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        setLetters(splitter.splitGraphemes(text))
    }, [text])

    return (
        <span style={{ display: 'inline-block', fontFamily, letterSpacing: '0em', marginTop: marginTop }}>
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
            if (shouldBeVisible) {
                gsap.to(spanRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out', delay: index * 0.05 })
            } else {
                gsap.to(spanRef.current, { opacity: 0, y: 30, scale: 0.8, duration: 0.4, ease: 'power2.in' })
            }
        }
    })

    if (letter === " ") return <span style={{ display: "inline-block", width: "0.4em" }} />
    return <span ref={spanRef} style={{ display: 'inline-block' }}>{letter}</span>
}

function AnimatedSinhalaText({
    text,
    fontFamily = "'TharuDigitalNikini', sans-serif",
    fontWeight = "normal",
    topMargin = "0rem"
}) {
    const textRef = useRef(null)
    const [lines, setLines] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        // split by newline first, then by graphemes
        const processedLines = text.split("\n").map(line => splitter.splitGraphemes(line))
        setLines(processedLines)
    }, [text])

    useEffect(() => {
        if (!textRef.current) return
        const spans = textRef.current.querySelectorAll("span.letter")
        gsap.fromTo(
            spans,
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }
        )
    }, [lines])

    return (
        <div
            ref={textRef}
            style={{
                fontSize: "clamp(0.8rem, 3vw, 1.0rem)",
                fontFamily,
                fontWeight,
                textAlign: "center",
                maxWidth: "100%",
                display: "inline-block",
                lineHeight: 1.2,
                marginTop: topMargin,
                color: "white"
            }}
        >
            {lines.map((letters, lineIndex) => (
                <div key={lineIndex}>
                    {letters.map((letter, index) =>
                        letter === " " ? (
                            <span
                                key={index}
                                style={{ display: "inline-block", width: "0.4em" }}
                            />
                        ) : (
                            <span key={index} className="letter" style={{ display: "inline-block" }}>
                                {letter}
                            </span>
                        )
                    )}
                </div>
            ))}
        </div>
    )
}


// --- Ship Scene ---
function Scene() {
    const shipRef = useRef()
    const scroll = useScroll()
    const { scene } = useGLTF('/models/ship.glb')
    const { gl } = useThree()
    const prevRotation = useRef(0)

    useFrame(() => {
        if (!shipRef.current) return
        const t = scroll.offset
        const visibleProgress = Math.min(Math.max(t * 5, 0.3), 1.5)
        shipRef.current.scale.set(0.5 * visibleProgress, 0.5 * visibleProgress, 0.5 * visibleProgress)

        let x = 10 - 20 * Math.min(t / 0.3, 1)
        if (t > 0.3) x = -10 + 20 * ((t - 0.3) / 0.7)
        const baseY = -2
        const y = baseY + Math.sin(t * Math.PI * 2) * 0.5
        const z = -5 + Math.sin(t * Math.PI) * 0.5
        shipRef.current.position.set(x, y, z)

        const targetRotation = Math.PI * Math.min(Math.max((t - 0.05) / (0.45 - 0.05), 0), 1)
        prevRotation.current = THREE.MathUtils.lerp(prevRotation.current, targetRotation, 0.1)
        shipRef.current.rotation.y = prevRotation.current

        const mixedColor = new THREE.Color('#000000').lerp(new THREE.Color('#ffffff'), bgEasing(t))
        gl.setClearColor(mixedColor)
    })

    return <primitive ref={shipRef} object={scene} position={[10, -2, 0]} />
}

// --- Plane Scene ---
function PlaneScene({ startOffset = 0.25, endOffset = 0.75 }) {
    const planeRef = useRef()
    const scroll = useScroll()
    const { scene } = useGLTF('/models/plane.glb')

    useFrame(() => {
        if (!planeRef.current) return
        const t = scroll.offset
        const progress = Math.min(Math.max((t - startOffset) / (endOffset - startOffset), 0), 1)

        planeRef.current.scale.set(progress, progress, progress)
        const x = -5 + 10 * progress
        const y = 2 + Math.sin(progress * Math.PI * 2) * 1
        const z = -3 + Math.cos(progress * Math.PI) * 1
        planeRef.current.position.set(x, y, z)
        planeRef.current.rotation.y = Math.PI * progress
    })

    return <primitive ref={planeRef} object={scene} position={[-5, 2, -3]} />
}


function EventDetails() {
    const details = [
        { icon: <FaCalendarAlt />, value: "26th AUGUST 2025" },
        { icon: <FaClock />, value: "05:00 PM" },
        { icon: <FaMapMarkerAlt />, value: "PROF. J.W. DAYANANDA SOMASUNDARA AUDITORIUM" },
    ];

    const cardsRef = useRef([]);

    useEffect(() => {
        if (!cardsRef.current) return;

        gsap.from(cardsRef.current, {
            x: i => i % 2 === 0 ? -200 : 200, // left/right entry
            opacity: 0,
            duration: 10,
            ease: "power2.out",
            stagger: 0.2, // animate one after another
        });
    }, []);

    return (
        <div className="container-card">
            {details.map((item, index) => (
                <div
                    key={index}
                    className="card2"
                    ref={(el) => (cardsRef.current[index] = el)}
                >
                    <div className="slide slide1">
                        <div className="content">
                            <div className="icon">{item.icon}</div>
                        </div>
                    </div>
                    <div className="slide slide2">
                        <div className="content">
                            <p>{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}






// --- Logo ---
function AnimatedLogo({ src, width, topMargin = '0rem' }) {
    const logoRef = useRef()
    useEffect(() => {
        gsap.fromTo(logoRef.current, { scale: 0, y: 0, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' })
    }, [])
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: topMargin }}><img ref={logoRef} src={src} width={width} alt="Logo" /></div>
}

// --- Text ---
function AnimatedText({ text, fontSize = '1rem', fontFamily = "'Ubuntu', sans-serif", fontWeight = '700', topMargin = '0rem' }) {
    const textRef = useRef(null);
    useEffect(() => {
        if (!textRef.current) return;
        gsap.fromTo(textRef.current, { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' });
    }, []);
    return <div ref={textRef} style={{ fontSize, fontFamily, fontWeight, marginTop: topMargin }}>{text}</div>
}

// --- Main Component ---
export default function KoduYathra() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas shadows camera={{ position: [0, 2, 12], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                    <SpinningModel scale={2.5} />
                </Suspense>
                <Suspense fallback={null}>
                    <ScrollControls pages={2} damping={0.1}>
                        <Scene /> {/* Ship */}
                        {/* <PlaneScene />  */}
                        <Environment preset="sunset" />

                        <Scroll html>
                            {/* Page 1 */}
                            <section className="sinhala-font" style={{ height: '100vh', width: '100vw', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <AnimatedLogo src="/logo1.png" width={300} topMargin="3rem" />
                                    <AnimatedText text="2025" fontSize="1.4rem" fontFamily="'Ubuntu', sans-serif" fontWeight="700" topMargin="1rem" />
                                    <AnimatedSinhalaText
                                        text={`;dreldu;ska wdf,dalh fidhd hk fldavqldrhkaf.a\n fid÷re ixpdrh'''`}
                                        fontFamily="'TharuDigitalNikini', sans-serif"
                                        fontWeight="700"
                                        topMargin="1.7rem"
                                    />                                </div>
                                <div className="mouse"></div>
                            </section>

                            {/* Page 2 */}
                            <section style={{ height: '100vh', width: '100vw', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', fontSize: '3.5rem', fontWeight: 'bold', fontFamily: "'Ubuntu', sans-serif" }}>
                                <ScrollSinhala text="Get Ready" startOffset={0.5} endOffset={1.0} fontFamily="'Ubuntu', sans-serif" marginTop='6rem' />
                                {/* <div class="wrapper">
                                    <div class="container">
                                        <div class="fold"></div>
                                    </div>
                                </div> */}

                                {/* <div style={{ marginBottom: '0rem', textAlign: 'center' }}>

                                    <AnimatedText
                                        fontFamily="'Ubuntu', sans-serif"
                                        text="DATE: 26th AUGUST 2025"
                                        fontSize="1.4rem"
                                        topMargin="2rem"
                                    />
                                    <AnimatedText
                                        fontFamily="'Ubuntu', sans-serif"
                                        text="Time: 05:00 PM"
                                        fontSize="1.4rem"
                                        topMargin="1rem"
                                    />
                                    <AnimatedText
                                        fontFamily="'Ubuntu', sans-serif"
                                        text="VENUE: PROF.J.W.DAYANANDA SOMASUNDARA AUDITORIUN"
                                        fontSize="1.2rem"
                                        topMargin="1rem"
                                    />
                                </div> */}
                                <EventDetails />


                                <div className="footer-text-container2" style={{ marginBottom: '20px', textAlign: 'center', position: 'relative', marginLeft: '5px', marginRight: '5px' }}>
                                    <img src="/foclogo.png" className="footer-logo front-logo" />
                                    <p className="footer-text">
                                        {"Students' Union Faculty of Computing Sabaragamuwa University of Sri Lanka"}
                                    </p>
                                    <img src="/susllog.png" className="footer-logo back-logo" />
                                </div>
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
    scene.traverse((child) => { if (child.isMesh) { child.material.transparent = true; child.material.opacity = 0.2; child.material.depthWrite = false } })
    useFrame(() => { scene.rotation.y += 0.002; scene.rotation.x = 0.25 })
    return <primitive object={scene} {...props} />
}
