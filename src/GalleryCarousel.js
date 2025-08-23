'use client'
import { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import './GalleryCarousel.css';
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import GraphemeSplitter from "grapheme-splitter";

gsap.registerPlugin(ScrollTrigger);


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
    return <div ref={textRef} style={{ fontSize, fontFamily, fontWeight, marginTop: topMargin, color:'white' }}>{text}</div>
}



function AnimatedSinhalaText({ text, fontFamily = "'0KDROSE', sans-serif", fontWeight = 'normal', topMargin = '0rem' }) {
    const textRef = useRef(null)
    const [letters, setLetters] = useState([])

    useEffect(() => {
        const splitter = new GraphemeSplitter()
        setLetters(splitter.splitGraphemes(text))
    }, [text])

    useEffect(() => {
        if (!textRef.current) return
        const spans = textRef.current.querySelectorAll("span")
        gsap.fromTo(spans, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 })
    }, [letters])

    return (
        <span ref={textRef} style={{ fontSize: 'clamp(0.5rem, 3vw, 1.0rem)', fontFamily, fontWeight, textAlign: 'center', maxWidth: '100%', display: 'inline-block', lineHeight: 1.2, marginTop: topMargin, color: 'white' }}>
            {letters.map((letter, index) => letter === " " ? <span key={index} style={{ display: "inline-block", width: "0.4em" }} /> : <span key={index} style={{ display: "inline-block" }}>{letter}</span>)}
        </span>
    )
}


export default function GalleryCarousel() {
    const galleryRef = useRef(null);

    const galleryImages = [
        "/cards/card1s.jpg",
        "/cards/card2.jpg",
        "/cards/card3.jpg",
    ];


    useEffect(() => {
        const sections = gsap.utils.toArray(".cards li");

        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),

            ease: "none",
            scrollTrigger: {
                trigger: galleryRef.current,
                pin: true,
                scrub: 1,
                end: () => "+=" + window.innerWidth * (sections.length - 1)
            }
        });
    }, []);

    return (
        <div className="gallery" ref={galleryRef}>
            {/* Background 3D Canvas */}
            <Canvas
                className="background-canvas"
                gl={{ alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    <SpinningModel scale={2.5} />
                </Suspense>
            </Canvas>

            {/* Cards + Footer Container */}
            <div className="gallery-content">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AnimatedLogo src="/logo1.png" width={100} topMargin="3rem" />
                    <AnimatedText text="2025" fontSize="0.8rem" fontFamily="'Ubuntu', sans-serif" fontWeight="700" topMargin="1rem" />
                    <AnimatedSinhalaText text="තාරුකා මතින් ආලෝකය සොයායන කෝඩූකාරයන්ගේ සොදුරු සංචාරය" fontSize="0.6rem" fontFamily="'0KDROSE', sans-serif" fontWeight="700" topMargin="1rem" />
                </div>
                {/* Cards area - 8/12 */}
                <ul className="cards">
                    {galleryImages.map((src, i) => (
                        <li key={i} className="card">
                            <img src={src} alt={`Card ${i}`} />
                        </li>
                    ))}
                </ul>


                {/* Footer area - 4/12 */}
                <div
                    className="gallery-footer"
                    style={{ fontFamily: "'Ubuntu', sans-serif" }}
                >
                    <p className="footer-line-1" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        BE A PART OF THIS VIBRANT EVENING AND WITNESS THE BRILLIANCE,
                        CREATIVITY, AND TALENTS COME ALIVE ON STAGE
                    </p>
                    <p className="footer-line-1" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        AND
                    </p>
                    <p className="footer-line-1" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        TALENTS COME ALIVE ON STAGE
                    </p>
                    <div className="footer-text-container">
                        <img src="/foclogo.png" className="footer-logo front-logo" />
                        <p className="footer-text">
                            {"Students' Union Faculty of Computing Sabaragamuwa University of Sri Lanka"}
                        </p>
                        <img src="/susllog.png" className="footer-logo back-logo" />
                    </div>
                </div>

            </div>
        </div>

    );
}

function SpinningModel(props) {
    const { scene } = useGLTF('/models/sky_pano_-_milkyway.glb')

    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.transparent = true
            child.material.opacity = 0.5
            child.material.depthWrite = false
        }
    })

    useFrame(() => {
        scene.rotation.y += 0.002
        scene.rotation.x = 0.25
    })

    return <primitive object={scene} {...props} />
}
