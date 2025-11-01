import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UnderConstruction } from "@/components/under-construction"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <UnderConstruction title="About TravelHub" />
      <Footer />
    </main>
  )
}
