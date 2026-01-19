"use client"

import { useEffect, useRef, useState } from "react"

export function IntroductionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="bg-foreground pt-16 pb-24 md:pt-20 md:pb-32 md:pl-24"
    >
      <div className="max-w-3xl mx-auto px-8 md:px-16">
        <p 
          className={`text-base md:text-lg leading-relaxed text-background/70 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Through the lens, I seek the quiet moments between light and shadow—capturing the ephemeral beauty that exists in the spaces we often overlook. Based in Shanghai, my work explores the intersection of traditional aesthetics and contemporary vision.
        </p>
      </div>
    </section>
  )
}
