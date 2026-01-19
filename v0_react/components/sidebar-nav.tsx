"use client"

import { useState, useEffect } from "react"

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export function SidebarNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show background color after small scroll
      setIsScrolled(window.scrollY > 100)
      // Show logo after scrolling past the centered top logo (top-8 = 32px + logo height ~24px)
      setShowLogo(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      <nav 
        className={`fixed left-0 top-0 h-screen w-20 md:w-24 z-50 hidden md:flex flex-col items-center py-8 transition-colors duration-500 ${
          isScrolled ? "bg-foreground" : "bg-transparent"
        }`}
      >
        {/* Logo - only visible after scrolling past hero */}
        <a 
          href="#"
          className={`text-2xl font-light transition-all duration-500 ${
            showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          } ${
            isScrolled ? "text-background" : "text-background"
          }`}
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          光
        </a>

        {/* Horizontal Nav Links - positioned in upper half */}
        <div className="mt-12 flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:opacity-100 ${
                isScrolled 
                  ? "text-background/70 hover:text-background" 
                  : "text-background/70 hover:text-background"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Scroll Indicator - at bottom, disappears on scroll */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-500 ${
            showLogo ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-px h-12 bg-background/30 relative overflow-hidden">
            <div className="absolute w-full h-4 bg-background/80 animate-scroll-line" />
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-background/40">
            Scroll
          </span>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className={`flex items-center justify-between px-6 py-4 transition-colors duration-500 ${
          isScrolled ? "bg-foreground" : "bg-transparent"
        }`}>
          {/* Logo - only visible after scrolling past hero */}
          <a 
            href="#"
            className={`text-2xl font-light text-background transition-all duration-500 ${
              showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            光
          </a>

          {/* Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-background p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-px bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-foreground transition-transform duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl tracking-[0.2em] uppercase text-background/80 hover:text-background transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}
