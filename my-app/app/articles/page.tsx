import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getArticlesList, type ArticleListItem } from "@/lib/api"

import { ArticlesExplorer } from "./_components/articles-explorer"

export default async function ArticlesPage() {
  let articles: ArticleListItem[] = []

  try {
    articles = await getArticlesList({ pageSize: 60 })
  } catch (error) {
    console.error("Failed to load articles list:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore Articles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover inspiring travel stories from our community of adventurers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticlesExplorer articles={articles} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
