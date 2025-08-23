"use client"
import { useEffect, useRef, useState } from "react"
import "./BottomNav.css"

export default function BottomNav({ sections }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const barRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight
      let current = 0
      sections.forEach((sec, i) => {
        const el = document.getElementById(sec.id)
        if (el && scrollPos >= el.offsetTop + el.offsetHeight / 2) {
          current = i
        }
      })
      setActiveIndex(current)

      if (barRef.current) {
        barRef.current.style.width = `${100 * (current / (sections.length - 1))}%`
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="bottom-nav">
      <div className="line">
        <div className="blue">
          <div ref={barRef} className="red"></div>
        </div>
      </div>
      <div className="nodes">
        {sections.map((sec, i) => (
          <div
            key={i}
            className={`node ${i === activeIndex ? "active" : ""}`}
            onClick={() => scrollTo(sec.id)}
          >
            <div className="circle"></div>
          </div>
        ))}
      </div>
    </nav>
  )
}
