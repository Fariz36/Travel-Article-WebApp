import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  fetchArticlesList,
  getCategoriesList,
  type ApiPagination,
  type ArticleListItem,
  type CategoryOption,
} from "@/lib/api"

import { ArticlesExplorer } from "./_components/articles-explorer"

export default async function ArticlesPage() {
  let articles: ArticleListItem[] = []
  let pagination: ApiPagination | null = null
  let categories: CategoryOption[] = []

  try {
    const result = await fetchArticlesList({ pageSize: 6, page: 1 })
    articles = result.articles
    pagination = result.pagination
  } catch (error) {
    console.error("Failed to load articles list:", error)
  }

  try {
    categories = await getCategoriesList()
  } catch (error) {
    console.error("Failed to load categories list:", error)
  }

  if (categories.length === 0) {
    const fallbackCategories = Array.from(new Set(articles.map((article) => article.categoryName))).map(
      (name, index) => ({
        id: index,
        documentId: `${index}`,
        name,
      })
    )
    categories = fallbackCategories
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-linear-to-b from-muted/50 to-background py-12 md:py-16">
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
          <ArticlesExplorer initialArticles={articles} initialPagination={pagination} categories={categories} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
