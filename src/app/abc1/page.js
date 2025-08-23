import BottomNav from "@/BottomNav"
import KoduYathra from "../KoduYathra"
import GalleryCarousel from "@/GalleryCarousel"
import TextEffect from "../TextEffect.js.js"
import ScrollHint from "../ScrollHint"
import './page.css'

export default function Home() {
  const sections = [
    { id: "page1", label: "Sinhala" },
    { id: "page2", label: "English" },
    { id: "page3", label: "Date" },
  ]

  return (
    <div className="root">

      <GalleryCarousel />
    </div>
  )
}


