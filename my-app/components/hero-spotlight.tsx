"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import type { ArticleListItem } from "@/lib/api"
import { cn, getValidImageUrl } from "@/lib/utils"

const ROTATION_INTERVAL_MS = 8000

const FALLBACK_ARTICLE: ArticleListItem = {
  id: 0,
  documentId: "",
  title: "Explore the World Through Stories",
  description:
    "Read inspiring travel stories from adventurers around the globe. Share your experiences, discover hidden gems, and connect with fellow travelers.",
  coverImageUrl: "/tropical-sunset-palms.png",
  categoryName: "Featured Story",
  authorName: "TravelHub Team",
  createdAt: new Date().toISOString(),
}

interface HeroSpotlightProps {
  articles: ArticleListItem[]
}

export function HeroSpotlight({ articles }: HeroSpotlightProps) {
  const spotlightArticles = useMemo(() => {
    if (articles.length > 0) {
      return articles
    }
    return [FALLBACK_ARTICLE]
  }, [articles])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [spotlightArticles])

  useEffect(() => {
    if (spotlightArticles.length <= 1) {
      return
    }

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % spotlightArticles.length)
    }, ROTATION_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [spotlightArticles.length])

  const activeArticle = spotlightArticles[activeIndex] ?? spotlightArticles[0]
  const coverImage = getValidImageUrl(activeArticle.coverImageUrl)
  const excerpt = activeArticle.description.replace(/\s+/g, " ").trim()
  const truncatedExcerpt = excerpt.length > 220 ? `${excerpt.slice(0, 217)}...` : excerpt
  const primaryLink = activeArticle.documentId ? `/articles/${activeArticle.documentId}` : "/articles"

  return (
    <div className="grid items-center gap-12 md:grid-cols-2">
      <div className="space-y-6">
        <div className="inline-block">
          <span className="tag-category">{activeArticle.categoryName || "Featured Story"}</span>
        </div>

        <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">{activeArticle.title}</h1>

        <p className="text-lg leading-relaxed text-muted-foreground">{truncatedExcerpt}</p>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Link href={primaryLink} className="btn-primary text-center">
            Read This Story
          </Link>
          <Link href="/articles" className="btn-outline text-center">
            Browse More Destinations
          </Link>
        </div>

        <div className="flex gap-8 border-t border-border pt-8">
          <div>
            <p className="text-2xl font-bold text-primary">2.5K+</p>
            <p className="text-sm text-muted-foreground">Travel Stories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">150+</p>
            <p className="text-sm text-muted-foreground">Destinations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">50K+</p>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </div>
        </div>

        {spotlightArticles.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {spotlightArticles.map((article, index) => (
              <button
                key={`${article.documentId}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2.5 w-8 rounded-full transition-all duration-300",
                  index === activeIndex ? "bg-primary" : "bg-border hover:bg-primary/60"
                )}
                aria-label={`Show spotlight article ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative min-h-96 h-96 md:h-full">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20"></div>
        <div className="relative h-full overflow-hidden rounded-2xl">
          <Image
            key={`${activeArticle.documentId}-${coverImage}`}
            src={coverImage}
            alt={activeArticle.title}
            fill
            priority={activeIndex === 0}
            className="object-cover transition-opacity duration-500"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 max-w-xs rounded-xl border border-border bg-card p-4 shadow-lg">
          <p className="text-sm font-semibold text-foreground">Featured Story</p>
          <p className="font-bold text-primary line-clamp-2">{activeArticle.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">By {activeArticle.authorName}</p>
        </div>
      </div>
    </div>
  )
}
