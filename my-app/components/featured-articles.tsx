import Link from "next/link"
import { ArrowRight } from "lucide-react"

const articles = [
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
]

export function FeaturedArticles() {
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
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <div className="card-base overflow-hidden h-full flex flex-col cursor-pointer group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
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
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">{article.description}</p>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{article.author}</p>
                      <p>{article.date}</p>
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
