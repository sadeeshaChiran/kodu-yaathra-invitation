'use client'
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import './TextEffect.css';

gsap.registerPlugin(ScrollTrigger);

export default function TextEffect() {
  useEffect(() => {
    const texts = gsap.utils.toArray('.text');
    texts.forEach(text => {
      gsap.to(text, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'center 80%',
          end: 'center 20%',
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div className="container">
      <h1 className="text">TEXT EFFECT<span className="span">WOAH</span></h1>
      <h1 className="text">GSAP<span className="span">AND CLIPPING</span></h1>
      <h1 className="text">CRAZYYY<span className="span">CRAZYYY</span></h1>
      <h1 className="text">HOVER ON ME<span className="span"><a href="https://stacksorted.com/text-effects/minh-pham" target="_blank">SOURCE</a></span></h1>
      <h1 className="text">LIKE THIS?<span className="span"><a href="https://twitter.com/juxtopposed" target="_blank">LET'S CONNECT</a></span></h1>
    </div>
  );
}
