import GalleryCarousel from "@/app/GalleryCarousel"
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


