'use client'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import Image from 'next/image'
import './Invitation.css'
import GraphemeSplitter from 'grapheme-splitter';


export default function InvitationOnePage() {
    const lines = [
        {
            text: [
                { part: "  තාරුකා මතින් ආලෝකය සොයායන කෝඩූකාරයන්ගේ සොදුරු සංචාරය", style: 'sinhala-text slogan-highlight' }
            ]
        },
        {
            text: [
                { part: 'WE ARE THRILLED TO INVITE YOU TO : ', style: '' },
                { part: '"KODU YAATHRA 2025"', style: 'topic-highlight' }
            ]
        },
        {
            text: [
                { part: 'DATE: ', style: '' },
                { part: '26TH AUGUST 2025', style: 'date-highlight' }
            ]
        },
        {
            text: [
                { part: 'TIME: ', style: '' },
                { part: '5:00 PM', style: 'time-highlight' },
                { part: ' ONWARDS', style: '' }
            ]
        },
        {
            text: [
                { part: 'VENUE: ', style: '' },
                { part: 'J. W. DAYANANDA SOMASUNDARA AUDITORIUM', style: 'venue-highlight' }
            ]
        },
        { text: 'BE A PART OF THIS VIBRANT EVENING' },
        { text: 'AND' },
        { text: 'WITNESS THE BRILLIANCE, CREATIVITY, AND TALENTS COME ALIVE ON STAGE' },
        {
            text: [
                { part: "Students' Union - Faculty of Computing  Sabaragamuwa University of Sri Lanka", style: 'bottom-highlight' }
            ]
        }
    ]

    const fullText = lines
        .map(l =>
            Array.isArray(l.text)
                ? l.text.map(seg => seg.part).join('')
                : l.text
        )
        .join('\n')
    const [visibleCount, setVisibleCount] = useState(0)
    const [showBox, setShowBox] = useState(false)
    const containerRef = useRef(null)
    const logoRef = useRef(null)

    // Custom cursor effect
    useEffect(() => {
        const circleElement = document.querySelector('.circle')
        const mouse = { x: 0, y: 0 }
        const previousMouse = { x: 0, y: 0 }
        const circle = { x: 0, y: 0 }
        let currentScale = 0
        let currentAngle = 0
        const speed = 0.17

        const onMouseMove = (e) => {
            mouse.x = e.x
            mouse.y = e.y
        }
        window.addEventListener('mousemove', onMouseMove)

        const tick = () => {
            circle.x += (mouse.x - circle.x) * speed
            circle.y += (mouse.y - circle.y) * speed
            const translateTransform = `translate(${circle.x}px, ${circle.y}px)`

            const deltaMouseX = mouse.x - previousMouse.x
            const deltaMouseY = mouse.y - previousMouse.y
            previousMouse.x = mouse.x
            previousMouse.y = mouse.y
            const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150)
            const scaleValue = (mouseVelocity / 150) * 0.5
            currentScale += (scaleValue - currentScale) * speed
            const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`

            const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI
            if (mouseVelocity > 20) currentAngle = angle
            const rotateTransform = `rotate(${currentAngle}deg)`

            if (circleElement) {
                circleElement.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`
            }
            requestAnimationFrame(tick)
        }

        tick()
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])


    const splitter = new GraphemeSplitter();
    // Typing + popup + logo animation
    useEffect(() => {
        const popupTimeout = setTimeout(() => {
            setShowBox(true)

            requestAnimationFrame(() => {
                if (containerRef.current) {
                    gsap.fromTo(
                        containerRef.current,
                        { scale: 0, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
                    )
                }
                if (logoRef.current) {
                    gsap.fromTo(
                        logoRef.current,
                        { y: -50, opacity: 0, scale: 0.5 },
                        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.6)', delay: 0.5 }
                    )
                }
            })

            let count = 0
            const interval = setInterval(() => {
                count++
                setVisibleCount(count)
                if (count >= fullText.length) clearInterval(interval)
            }, 50)
        }, 2000)

        return () => clearTimeout(popupTimeout)
    }, [])

    return (
        <>
            {/* Three.js background */}
            <Canvas
                shadows
                camera={{ position: [0, 0, 15], fov: 25 }}
                gl={{ alpha: true }}
                style={{ position: 'fixed', inset: 0, background: 'black' }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                    <SpinningModel scale={2.5} />
                </Suspense>
            </Canvas>

            {/* Cursor */}
            <div className="circle"></div>

            {/* Card */}
            {showBox && (
                <div className="card-container" ref={containerRef}>


                    <div className="card">
                        {/* Logo at the top */}
                        <div className="logo-box" ref={logoRef}>
                            <Image src="/logo.png" alt="Logo" width={120} height={120} />
                        </div>

                        {/* Animated lines */}
                        {lines.map((line, lineIdx) => {
                            const makeChars = (text, extraClass, baseOffset) =>
                                splitter.splitGraphemes(text).map((char, i) => {
                                    const globalIndex = baseOffset + i;
                                    return (
                                        <span
                                            key={i}
                                            className={extraClass}
                                            style={{
                                                opacity: globalIndex < visibleCount ? 1 : 0,
                                                display: 'inline-block',
                                                transition: 'opacity 0.05s',
                                            }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    );
                                });

                            const prevLength = lines
                                .slice(0, lineIdx)
                                .map(l =>
                                    Array.isArray(l.text)
                                        ? l.text.reduce((acc, t) => acc + t.part.length, 0)
                                        : l.text.length
                                )
                                .reduce((a, b) => a + b, 0) + lineIdx

                            return (
                                <p key={lineIdx} className={line.highlight || ''}>
                                    {Array.isArray(line.text)
                                        ? line.text.map((seg, j) =>
                                            makeChars(seg.part, seg.style, prevLength + line.text.slice(0, j).reduce((a, t) => a + t.part.length, 0))
                                        )
                                        : makeChars(line.text, line.highlight || '', prevLength)}
                                </p>
                            )
                        })}

                        {/* 3D shadow layers */}
                        {/* <div className="layers">
                            {[...Array()].map((_, i) => (
                                <div
                                    key={i}
                                    className="layer"
                                    style={{ '--tz': `${i * -6}px` }}
                                ></div>
                            ))}
                        </div> */}
                    </div>
                </div>
            )}
        </>
    )
}

function SpinningModel(props) {
    const { scene } = useGLTF('/models/sky_pano_-_milkyway.glb')
    useFrame(() => {
        scene.rotation.y += 0.002
        scene.rotation.x = 0.25
    })
    return <primitive object={scene} {...props} />
}
