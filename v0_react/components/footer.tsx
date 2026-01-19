"use client"

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground py-24 md:py-32 md:pl-24">
      
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* Brand & CTA */}
          <div className="md:col-span-6">
            <h3 
              className="text-5xl md:text-6xl lg:text-7xl font-light text-background mb-8"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              光影詩
            </h3>
            <p className="text-lg md:text-xl text-background/60 leading-relaxed max-w-md mb-10">
              Available for collaborations, exhibitions, and commissioned work.
            </p>
            <a 
              href="mailto:hello@example.com"
              className="inline-block text-sm tracking-[0.2em] uppercase text-background border-b border-background/30 pb-1 hover:border-background transition-colors"
            >
              Get in Touch
            </a>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <a 
                href="mailto:hello@example.com" 
                className="block text-sm text-background/70 hover:text-background transition-colors"
              >
                hello@example.com
              </a>
              <p className="text-sm text-background/50">
                Shanghai, China
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6">
              Follow
            </h4>
            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                className="text-sm text-background/50 hover:text-background transition-colors"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-sm text-background/50 hover:text-background transition-colors"
              >
                Behance
              </a>
              <a 
                href="#" 
                className="text-sm text-background/50 hover:text-background transition-colors"
              >
                500px
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-background/30">
            © 2025 All rights reserved
          </p>
          <p className="text-xs text-background/30">
            Crafted with intention
          </p>
        </div>
      </div>
    </footer>
  )
}
