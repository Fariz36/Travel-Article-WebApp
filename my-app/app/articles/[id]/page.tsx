"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Share2, Heart, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const articleData = {
  1: {
    title: "Hidden Waterfalls of Costa Rica",
    author: "Sarah Chen",
    date: "Mar 15, 2024",
    category: "Nature",
    image: "/waterfall-in-rainforest.jpg",
    authorImage: "/author-sarah.jpg",
    authorBio: "Travel photographer and nature enthusiast exploring the world's most beautiful destinations.",
    content: `
      Costa Rica is a paradise for waterfall enthusiasts. With its lush rainforests and abundant rainfall, the country is home to some of the most spectacular waterfalls in Central America.

      During my recent trip, I discovered several hidden gems that most tourists never get to see. These waterfalls are tucked away in remote areas of the rainforest, requiring a bit of hiking but offering incredible rewards.

      The journey to these waterfalls is as beautiful as the destination itself. You'll trek through dense vegetation, cross crystal-clear streams, and encounter exotic wildlife along the way. The sound of rushing water grows louder as you approach, building anticipation for the moment you finally see the falls.

      One of my favorite discoveries was a three-tiered waterfall hidden deep in the Arenal region. The water cascades down moss-covered rocks into emerald pools perfect for swimming. The surrounding jungle creates a natural amphitheater, and the mist from the falls creates a magical atmosphere.

      I recommend visiting during the rainy season (May to November) when the waterfalls are at their most powerful. The trails can be muddy and challenging, but the reward is worth every step. Bring proper hiking boots, plenty of water, and a good camera to capture these natural wonders.

      The local guides in the area are incredibly knowledgeable and can take you to places you'd never find on your own. They share fascinating stories about the local flora and fauna, making the experience even more enriching.

      If you're planning a trip to Costa Rica, don't miss the opportunity to explore these hidden waterfalls. They represent the raw beauty of nature and remind us why travel is so important for the soul.
    `,
    likes: 342,
    comments: 28,
  },
  2: {
    title: "Street Food Adventure in Bangkok",
    author: "Marco Rossi",
    date: "Mar 12, 2024",
    category: "Food",
    image: "/street-food-market-bangkok.jpg",
    authorImage: "/author-marco.jpg",
    authorBio: "Food blogger and culinary explorer discovering authentic flavors around the globe.",
    content: `
      Bangkok's street food scene is legendary, and for good reason. The city's bustling markets and street corners offer an incredible array of flavors that represent the heart of Thai cuisine.

      I spent a week exploring the different food markets and street stalls, and each day brought new discoveries. From pad thai cooked on the street to fresh mango sticky rice, every bite was an adventure.

      The energy of the night markets is electric. Vendors call out their specialties, the aroma of grilled meats and spices fills the air, and locals and tourists alike gather to enjoy authentic Thai food at its finest.

      One of my favorite experiences was learning to make pad thai from a street vendor. She showed me the technique of tossing the noodles in the wok, the perfect balance of sweet, sour, and spicy flavors, and the importance of fresh ingredients.

      The affordability of street food in Bangkok is remarkable. You can enjoy a delicious, authentic meal for just a few dollars. This accessibility makes it possible to try many different dishes and explore the full range of Thai cuisine.

      I highly recommend visiting the Chatuchak Weekend Market, Yaowarat (Chinatown), and the various night markets scattered throughout the city. Each has its own unique character and specialties.

      Bangkok's street food is more than just food; it's a cultural experience that connects you to the heart of the city and its people.
    `,
    likes: 287,
    comments: 35,
  },
  3: {
    title: "Hiking the Inca Trail",
    author: "Alex Thompson",
    date: "Mar 10, 2024",
    category: "Adventure",
    image: "/machu-picchu-mountain-landscape.jpg",
    authorImage: "/author-alex.jpg",
    authorBio: "Adventure seeker and mountaineer documenting epic treks and outdoor expeditions.",
    content: `
      The Inca Trail is one of the most iconic treks in the world, and hiking it is an experience that will stay with you forever. This four-day journey through the Andes Mountains culminates at the breathtaking ruins of Machu Picchu.

      The trail takes you through diverse landscapes, from cloud forests to high mountain passes. You'll encounter ancient Inca ruins along the way, each with its own story to tell about this remarkable civilization.

      Day one starts at Kilometer 82, where you begin your ascent into the mountains. The first day is relatively easy, allowing you to acclimatize to the altitude and get into the rhythm of trekking.

      Day two is the most challenging, with the trail reaching its highest point at Dead Woman's Pass (4,215 meters). The altitude can be tough, but the views from the top are absolutely worth the effort.

      Days three and four take you through increasingly lush vegetation as you descend toward Machu Picchu. You'll pass through several Inca sites, each more impressive than the last.

      The final morning, you wake up early and hike to the Sun Gate, where you get your first glimpse of Machu Picchu. Watching the sunrise illuminate the ancient ruins is a moment of pure magic.

      I recommend hiring a local guide who can share the history and significance of the sites you encounter. The physical challenge of the trek is rewarded by the spiritual and cultural experience of walking in the footsteps of the Incas.

      This trek is truly a bucket-list adventure that everyone should experience at least once in their lifetime.
    `,
    likes: 456,
    comments: 52,
  },
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = articleData[params.id as keyof typeof articleData]
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Array<{ author: string; text: string; date: string }>>([
    { author: "John Doe", text: "Amazing article! I'm definitely adding this to my bucket list.", date: "2 days ago" },
    { author: "Jane Smith", text: "The photos are stunning. Great work!", date: "1 day ago" },
  ])

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, { author: "You", text: comment, date: "just now" }])
      setComment("")
    }
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link href="/articles" className="btn-primary">
            Back to Articles
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Back Button */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Articles
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block mb-4">
              <span className="tag-category">{article.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{article.title}</h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <img
                src={article.authorImage || "/placeholder.svg"}
                alt={article.author}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{article.author}</p>
                <p className="text-sm text-muted-foreground">{article.date}</p>
              </div>
              <button className="btn-primary text-sm">Follow</button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-96 object-cover" />
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-lg leading-relaxed text-foreground space-y-6">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>

          {/* Engagement Section */}
          <div className="card-base p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart size={24} fill={liked ? "currentColor" : "none"} className={liked ? "text-primary" : ""} />
                <span className="font-semibold">{article.likes + (liked ? 1 : 0)}</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle size={24} />
                <span className="font-semibold">{comments.length}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Share:</span>
              <button className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                <Share2 size={20} />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Comments ({comments.length})</h2>

            {/* Add Comment */}
            <div className="card-base p-6 mb-8">
              <div className="flex gap-4">
                <img src="/user-avatar.jpg" alt="Your avatar" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c, index) => (
                <div key={index} className="card-base p-6">
                  <div className="flex gap-4">
                    <img src="/user-avatar.jpg" alt={c.author} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{c.author}</p>
                        <p className="text-xs text-muted-foreground">{c.date}</p>
                      </div>
                      <p className="text-foreground mt-2">{c.text}</p>
                      <button className="text-sm text-primary hover:text-secondary transition-colors mt-2 font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="card-base p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
            <div className="flex gap-6">
              <img
                src={article.authorImage || "/placeholder.svg"}
                alt={article.author}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">About {article.author}</h3>
                <p className="text-foreground mb-4">{article.authorBio}</p>
                <button className="btn-primary text-sm">Follow Author</button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
