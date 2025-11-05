import { notFound } from "next/navigation"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getArticleByDocumentId, getCategoriesList, type ArticleDetail, type CategoryOption } from "@/lib/api"

import { EditArticleForm } from "./edit-article-form"

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id: documentId } = await params

  if (!documentId || documentId === "undefined") {
    notFound()
  }

  let article: ArticleDetail | null = null
  let categories: CategoryOption[] = []

  try {
    article = await getArticleByDocumentId(documentId)
  } catch (error) {
    console.error(`Failed to load article ${documentId} for editing:`, error)
  }

  if (!article) {
    notFound()
  }

  try {
    categories = await getCategoriesList()
  } catch (error) {
    console.error("Failed to load categories:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Edit Article</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Update the details of your travel story. Revise the title, adjust the category, or refresh the content so
              it stays inspiring.
            </p>
          </div>

          <EditArticleForm article={article} categories={categories} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
