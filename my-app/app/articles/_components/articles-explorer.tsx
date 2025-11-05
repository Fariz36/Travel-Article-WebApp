"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, Search } from "lucide-react"

import { fetchArticlesList } from "@/lib/api"
import type { ApiPagination, ArticleListItem, CategoryOption } from "@/lib/api"
import { getValidImageUrl } from "@/lib/utils"

interface ArticlesExplorerProps {
  initialArticles: ArticleListItem[]
  initialPagination: ApiPagination | null
  categories: CategoryOption[]
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

export function ArticlesExplorer({ initialArticles, initialPagination, categories }: ArticlesExplorerProps) {
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles)
  const [pagination, setPagination] = useState<ApiPagination | null>(initialPagination)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(initialPagination?.page ?? 1)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const isFirstRunRef = useRef(true)

  const categoryOptions = useMemo(() => {
    const names = categories.map((category) => category.name)
    const uniqueSorted = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b))
    return ["All", ...uniqueSorted]
  }, [categories])

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400)
    return () => window.clearTimeout(handler)
  }, [searchQuery])

  const loadArticles = useCallback(
    async (page: number, categoryName: string, query: string) => {
      const requestId = ++requestIdRef.current
      setIsLoading(true)
      try {
        const result = await fetchArticlesList({
          page,
          pageSize: ITEMS_PER_PAGE,
          categoryName: categoryName !== "All" ? categoryName : undefined,
          searchQuery: query,
        })

        if (requestId !== requestIdRef.current) {
          return
        }

        setArticles(result.articles)
        setPagination(result.pagination)
        setError(null)

        const nextPage = result.pagination?.page ?? page
        if (nextPage !== page) {
          setCurrentPage(nextPage)
        }
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) {
          return
        }
        const message =
          fetchError instanceof Error ? fetchError.message : "Failed to load articles. Please try again."
        setError(message)
        setArticles([])
        setPagination(null)
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    },
    []
  )

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      return
    }
    void loadArticles(currentPage, selectedCategory, debouncedQuery)
  }, [currentPage, selectedCategory, debouncedQuery, loadArticles])

  const totalPages = pagination?.pageCount ?? 1
  const totalItems = pagination?.total ?? articles.length
  const activePage = pagination?.page ?? currentPage
  const isPrevDisabled = activePage <= 1 || isLoading
  const isNextDisabled = activePage >= totalPages || isLoading

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setError(null)
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
    setError(null)
  }

  const handlePrevPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(Math.max(1, totalPages), page + 1))
  }

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
                autoComplete="off"
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="space-y-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
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
              <span className="font-semibold text-foreground">{totalItems}</span> articles found
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="lg:col-span-3">
        {error && (
          <div className="card-base p-6 mb-6 text-destructive bg-destructive/10 border border-destructive/20">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mb-6 text-sm text-muted-foreground">Loading articles...</div>
        )}
        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {articles.map((article) => (
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
                  onClick={handlePrevPage}
                  disabled={isPrevDisabled}
                  className="btn-outline px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Previous
                </button>
                <p className="text-sm text-muted-foreground">
                  Page <span className="font-semibold">{activePage}</span> of <span className="font-semibold">{totalPages}</span>
                </p>
                <button
                  onClick={handleNextPage}
                  disabled={isNextDisabled}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              {error ? " Please try again later." : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
