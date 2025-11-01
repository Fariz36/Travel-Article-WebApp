import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UnderConstruction } from "@/components/under-construction"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <UnderConstruction title="Contact Us" />
      <Footer />
    </main>
  )
}
