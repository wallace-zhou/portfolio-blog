"use client"

import { useEffect, useRef, useState } from "react"

const journalEntries = [
  {
    id: 1,
    title: "The Art of Patience: Waiting for the Perfect Light",
    excerpt: "There's a particular quality to dawn light in Shanghai that cannot be replicated. After years of chasing it, I've learned that the best photographs come to those who wait.",
    date: "15 Jan, 2025",
    category: "Process",
  },
  {
    id: 2,
    title: "Finding Stillness in the Urban Chaos",
    excerpt: "Street photography isn't about capturing chaos—it's about finding the moments of stillness within it. The quiet spaces between the noise.",
    date: "28 Dec, 2024",
    category: "Street",
  },
  {
    id: 3,
    title: "New Project: Shadows of Memory",
    excerpt: "Announcing my latest series exploring abandoned spaces and the stories they hold. A meditation on time, decay, and the persistence of memory.",
    date: "10 Dec, 2024",
    category: "Announcement",
  },
]

export function JournalSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journal"
      className="bg-card py-24 md:py-32 md:pl-24"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <div 
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground block mb-4">
              Thoughts & Updates
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
              Journal
            </h2>
          </div>
          <a 
            href="#"
            className={`hidden md:block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            View All Entries
          </a>
        </div>

        {/* Journal Entries */}
        <div className="space-y-0 divide-y divide-border">
          {journalEntries.map((entry, index) => (
            <article
              key={entry.id}
              className={`group cursor-pointer py-10 md:py-12 first:pt-0 transition-all duration-700 ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                {/* Date & Category */}
                <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-2">
                  <span className="text-xs text-muted-foreground">
                    {entry.date}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
                    {entry.category}
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-9">
                  <h3 className="text-xl md:text-2xl font-light text-foreground group-hover:text-accent transition-colors mb-4">
                    {entry.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2">
                    {entry.excerpt}
                  </p>
                  <span className="inline-block mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground/60 group-hover:text-foreground transition-colors">
                    Read More
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 md:hidden text-center">
          <a 
            href="#"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            View All Entries
          </a>
        </div>
      </div>
    </section>
  )
}
