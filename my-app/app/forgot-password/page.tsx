import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UnderConstruction } from "@/components/under-construction"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <UnderConstruction title="Forgot Password" />
      <Footer />
    </main>
  )
}
