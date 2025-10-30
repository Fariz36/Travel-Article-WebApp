import { getArticlesList, type ArticleListItem } from "@/lib/api"
import { pickRandomItems } from "@/lib/utils"

import { HeroSpotlight } from "./hero-spotlight"

export async function HeroSection() {
  let articles: ArticleListItem[] = []

  try {
    articles = await getArticlesList({ pageSize: 50 })
  } catch (error) {
    console.error("Failed to load hero spotlight articles:", error)
  }

  const spotlightArticles = pickRandomItems(articles, 3)

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-background via-background to-muted/30 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSpotlight articles={spotlightArticles} />
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}
