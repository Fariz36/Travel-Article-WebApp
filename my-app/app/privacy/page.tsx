import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UnderConstruction } from "@/components/under-construction"
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <UnderConstruction title="Privacy Policy" />
      <Footer />
    </main>
  )
}
