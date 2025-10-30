import Image from "next/image"
import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { getArticlesList, type ArticleListItem } from "@/lib/api"
import { getValidImageUrl, pickRandomItems } from "@/lib/utils"

function formatDate(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(isoDate))
  } catch {
    return ""
  }
}

export async function FeaturedArticles() {
  let articles: ArticleListItem[] = []

  try {
    articles = await getArticlesList({ pageSize: 40 })
  } catch (error) {
    console.error("Failed to load featured articles:", error)
  }

  const randomArticles = pickRandomItems(articles, 5)

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="tag-category">Featured Stories</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
            Trending Travel <span className="text-primary">Destinations</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the most popular travel stories from our community of adventurers
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {randomArticles.length === 0 && (
            <div className="md:col-span-2 lg:col-span-4">
              <div className="card-base p-8 text-center">
                <p className="text-muted-foreground">No featured articles available right now. Please check back soon.</p>
              </div>
            </div>
          )}

          {randomArticles.map((article) => (
            <Link key={article.documentId} href={`/articles/${article.documentId}`}>
              <div className="card-base overflow-hidden h-full flex flex-col cursor-pointer group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={getValidImageUrl(article.coverImageUrl)}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 22rem, (min-width: 768px) 40vw, 100vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="tag-category">{article.categoryName}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">{article.description}</p>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{article.authorName}</p>
                      <p>{formatDate(article.createdAt)}</p>
                    </div>
                    <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/articles" className="btn-primary inline-block">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}
