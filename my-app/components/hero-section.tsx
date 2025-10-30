import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="tag-category">Discover Your Next Adventure</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Explore the <span className="text-primary">World</span> Through Stories
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Read inspiring travel stories from adventurers around the globe. Share your experiences, discover hidden
              gems, and connect with fellow travelers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/articles" className="btn-primary text-center">
                Explore Destinations
              </Link>
              <Link href="/register" className="btn-outline text-center">
                Share Your Story
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-border">
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
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
            <img
              src="/tropical-sunset-palms.png"
              alt="Tropical beach destination"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border max-w-xs">
              <p className="text-sm font-semibold text-foreground">Featured Destination</p>
              <p className="text-primary font-bold">Bali, Indonesia</p>
              <p className="text-xs text-muted-foreground mt-1">Discover paradise beaches and ancient temples</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}
