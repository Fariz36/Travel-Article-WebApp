"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, Search } from "lucide-react"

import type { ArticleListItem } from "@/lib/api"
import { getValidImageUrl } from "@/lib/utils"

interface ArticlesExplorerProps {
  articles: ArticleListItem[]
}

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

const ITEMS_PER_PAGE = 6

export function ArticlesExplorer({ articles }: ArticlesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    articles.forEach((article) => {
      if (article.categoryName) {
        uniqueCategories.add(article.categoryName)
      }
    })
    return ["All", ...Array.from(uniqueCategories).sort()]
  }, [articles])

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.description.toLowerCase().includes(normalizedQuery)

      const matchesCategory = selectedCategory === "All" || article.categoryName === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [articles, searchQuery, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE))
  const clampedPage = Math.min(currentPage, totalPages)
  const startIndex = (clampedPage - 1) * ITEMS_PER_PAGE
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar - Filters */}
      <div className="lg:col-span-1">
        <div className="card-base p-6 sticky top-24">
          <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            Filters
          </h3>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Search</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1)
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-background text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredArticles.length}</span> articles found
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="lg:col-span-3">
        {paginatedArticles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {paginatedArticles.map((article) => (
                <Link key={article.documentId} href={`/articles/${article.documentId}`}>
                  <div className="card-base overflow-hidden h-full flex flex-col cursor-pointer group">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <Image
                        src={getValidImageUrl(article.coverImageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
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
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{article.description}</p>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">{article.authorName}</p>
                          <p>{formatDate(article.createdAt)}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">Read more</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={clampedPage === 1}
                  className="btn-outline px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <p className="text-sm text-muted-foreground">
                  Page <span className="font-semibold">{clampedPage}</span> of <span className="font-semibold">{totalPages}</span>
                </p>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={clampedPage === totalPages}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card-base p-10 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
