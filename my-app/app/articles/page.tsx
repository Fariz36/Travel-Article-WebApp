"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

const allArticles = [
  {
    id: 1,
    title: "Hidden Waterfalls of Costa Rica",
    description: "Discover the most breathtaking waterfalls tucked away in the rainforests of Costa Rica.",
    category: "Nature",
    image: "/waterfall-in-rainforest.jpg",
    author: "Sarah Chen",
    date: "Mar 15, 2024",
  },
  {
    id: 2,
    title: "Street Food Adventure in Bangkok",
    description: "A culinary journey through the vibrant street food scene of Thailand's bustling capital.",
    category: "Food",
    image: "/street-food-market-bangkok.jpg",
    author: "Marco Rossi",
    date: "Mar 12, 2024",
  },
  {
    id: 3,
    title: "Hiking the Inca Trail",
    description: "An unforgettable trek through the Andes to the ancient ruins of Machu Picchu.",
    category: "Adventure",
    image: "/machu-picchu-mountain-landscape.jpg",
    author: "Alex Thompson",
    date: "Mar 10, 2024",
  },
  {
    id: 4,
    title: "Northern Lights in Iceland",
    description: "Chasing the magical aurora borealis across Iceland's stunning winter landscape.",
    category: "Nature",
    image: "/northern-lights-aurora-borealis-iceland.jpg",
    author: "Emma Wilson",
    date: "Mar 8, 2024",
  },
  {
    id: 5,
    title: "Cherry Blossoms in Japan",
    description: "Experience the serene beauty of spring in Tokyo and Kyoto during cherry blossom season.",
    category: "Culture",
    image: "/cherry-blossoms-japan-spring.png",
    author: "Yuki Tanaka",
    date: "Mar 5, 2024",
  },
  {
    id: 6,
    title: "Safari Adventure in Kenya",
    description: "Witness the incredible wildlife and vast landscapes of the African savanna.",
    category: "Adventure",
    image: "/safari-wildlife-kenya.jpg",
    author: "James Okonkwo",
    date: "Mar 1, 2024",
  },
  {
    id: 7,
    title: "Gondola Rides in Venice",
    description: "Navigate the romantic canals of Venice and discover hidden palaces and bridges.",
    category: "Culture",
    image: "/venice-gondola-canal-italy.jpg",
    author: "Isabella Romano",
    date: "Feb 28, 2024",
  },
  {
    id: 8,
    title: "Surfing in Bali",
    description: "Ride the perfect waves and experience the laid-back beach culture of Bali.",
    category: "Adventure",
    image: "/surfing-beach-bali-indonesia.jpg",
    author: "Lucas Silva",
    date: "Feb 25, 2024",
  },
]

const categories = ["All", "Adventure", "Nature", "Food", "Culture"]

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage)

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
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
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
                      <Link key={article.id} href={`/articles/${article.id}`}>
                        <div className="card-base overflow-hidden h-full flex flex-col cursor-pointer group">
                          {/* Image */}
                          <div className="relative h-56 overflow-hidden bg-muted">
                            <img
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="tag-category">{article.category}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">
                              {article.description}
                            </p>

                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">
                                <p className="font-medium text-foreground">{article.author}</p>
                                <p>{article.date}</p>
                              </div>
                              <button className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-secondary transition-colors">
                                Read
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="card-base p-12 text-center">
                  <p className="text-lg text-muted-foreground">No articles found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                      setCurrentPage(1)
                    }}
                    className="mt-4 btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
