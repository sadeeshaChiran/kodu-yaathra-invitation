'use client'
import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import './GalleryCarousel.css';
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

export default function GalleryCarousel() {
    const galleryRef = useRef(null);

    const galleryImages = [
        "/cards/card1.jpg",
        "/cards/card1.jpg",
        "/cards/card1.jpg",
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
                {/* Cards area - 8/12 */}
                <ul className="cards">
                    {galleryImages.map((src, i) => (
                        <li key={i} className="card">
                            <img src={src} alt={`Card ${i}`} />
                        </li>
                    ))}
                </ul>


                {/* Footer area - 4/12 */}
                <div className="gallery-footer">
                    <p className="footer-line-1">
                        BE A PART OF THIS VIBRANT EVENING AND WITNESS THE BRILLIANCE,
                        CREATIVITY, AND TALENTS COME ALIVE ON STAGE
                    </p>
                    <p className="footer-line-2">
                        Students' Union - Faculty of Computing, Sabaragamuwa University of Sri Lanka
                    </p>
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
