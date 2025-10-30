import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { getCategoriesList, type CategoryOption } from "@/lib/api"

import { CreateArticleForm } from "./create-article-form"

export default async function CreateArticlePage() {
  let categories: CategoryOption[] = []

  try {
    categories = await getCategoriesList()
  } catch (error) {
    console.error("Failed to load categories:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Share Your Travel Story</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Craft a new article to inspire other travelers. Add a captivating title, select a category, and include
              vivid details to bring your journey to life.
            </p>
          </div>

          <CreateArticleForm categories={categories} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
