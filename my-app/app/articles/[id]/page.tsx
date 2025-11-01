import { notFound } from "next/navigation"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getArticleByDocumentId, type ArticleDetail } from "@/lib/api"

import { ArticleContent } from "./article-content"

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id: documentId } = await params

  if (!documentId || documentId === "undefined") {
    notFound()
  }

  let fetchedArticle: ArticleDetail | null = null

  try {
    fetchedArticle = await getArticleByDocumentId(documentId)
  } catch (error) {
    console.error(`Failed to load article ${documentId}:`, error)
  }

  if (!fetchedArticle) {
    notFound()
  }

  const article = fetchedArticle

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ArticleContent article={article} />
      <Footer />
    </main>
  )
}
