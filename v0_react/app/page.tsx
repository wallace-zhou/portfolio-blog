import { SidebarNav } from "@/components/sidebar-nav"
import { HeroSection } from "@/components/hero-section"
import { IntroductionSection } from "@/components/introduction-section"
import { JournalSection } from "@/components/journal-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <SidebarNav />
      <main className="overflow-x-hidden">
        <HeroSection />
        <IntroductionSection />
        <JournalSection />
        <Footer />
      </main>
    </>
  )
}
