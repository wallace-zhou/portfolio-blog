"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

const galleryImages = [
  { src: "/images/gallery-1.jpg", alt: "Portrait in dramatic lighting" },
  { src: "/images/gallery-2.jpg", alt: "Minimalist architecture" },
  { src: "/images/gallery-3.jpg", alt: "Misty forest at dawn" },
  { src: "/images/gallery-4.jpg", alt: "Still life with ceramics" },
  { src: "/images/gallery-5.jpg", alt: "Urban street scene" },
  { src: "/images/gallery-6.jpg", alt: "Serene ocean seascape" },
]

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const parallaxOffset = scrollY * 0.3
  const opacity = Math.max(0, 1 - scrollY / 600)

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-foreground"
    >
      {/* Top Logo - Small and Centered on entire page */}
      <div 
        className="absolute top-8 left-0 right-0 z-20 flex justify-center"
        style={{ opacity }}
      >
        <a 
          href="#"
          className={`text-lg md:text-xl font-light text-background/80 hover:text-background transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          光影詩
        </a>
      </div>

      {/* Photo Grid Gallery */}
      <div 
        className="pt-24 pb-16 md:pb-24 px-4 md:pl-28 md:pr-8"
        style={{
          transform: `translateY(-${parallaxOffset}px)`,
          willChange: "transform",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${
                index === 0 || index === 5 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/5]"
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 3}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      
    </section>
  )
}
