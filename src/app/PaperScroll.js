'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ButterflyCardsScroll() {
  // ✅ Make sure to initialize ref
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return; // safety check

    gsap.to(".paper", {
      rotateX: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }} ref={containerRef}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '500%', // depends on number of cards
        }}
      >
        <div className="butterfly-card" style={cardStyle('#f8b195')}>🦋 Butterfly 1</div>
        <div className="butterfly-card" style={cardStyle('#f67280')}>🦋 Butterfly 2</div>
        <div className="butterfly-card" style={cardStyle('#c06c84')}>🦋 Butterfly 3</div>
        <div className="butterfly-card" style={cardStyle('#6c5b7b')}>🦋 Butterfly 4</div>
        <div className="butterfly-card" style={cardStyle('#355c7d')}>🦋 Butterfly 5</div>
      </div>
    </div>
  );
}

function cardStyle(bg) {
  return {
    flex: '0 0 100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    color: '#fff',
    background: bg
  };
}
