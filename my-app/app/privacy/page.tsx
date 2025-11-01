import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UnderConstruction } from "@/components/under-construction"
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <Image
        src="https://tamanmini.com/taman_jelajah_indonesia/wp-content/uploads/2023/09/Anjungan-Bali-scaled.jpg"
        alt="Anjungan Bali"
        width={640}
        height={480}
      />
      <UnderConstruction title="Privacy Policy" />
      <Footer />
    </main>
  )
}
