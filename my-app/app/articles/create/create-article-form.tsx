"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FilePlus, Loader2 } from "lucide-react"

import { createArticle, createCategory, type CategoryOption } from "@/lib/api"
import { hasStoredToken } from "@/lib/auth"
import { getValidImageUrl } from "@/lib/utils"
import { useCategories } from "@/components/providers/category-provider"

interface CreateArticleFormProps {
  categories: CategoryOption[]
}

export function CreateArticleForm({ categories }: CreateArticleFormProps) {
  const { categories: sharedCategories, setCategories: setSharedCategories, refreshCategories } = useCategories()
  const [title, setTitle] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories.length ? categories : sharedCategories)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categoryError, setCategoryError] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(hasStoredToken())
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryOptions(categories)
      if (sharedCategories.length === 0) {
        setSharedCategories(categories)
      }
    }
  }, [categories, sharedCategories.length, setSharedCategories])

  useEffect(() => {
    if (sharedCategories.length > 0) {
      setCategoryOptions(sharedCategories)
    }
  }, [sharedCategories])

  const coverPreview = useMemo(() => getValidImageUrl(coverImageUrl || null), [coverImageUrl])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setErrorMessage("Please sign in before creating a new article.")
      return
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please provide a title and description for your article.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const created = await createArticle({
        title: title.trim(),
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim() || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      })

      setSuccessMessage("Article published successfully. Redirecting...")
      setTimeout(() => {
        router.push(created.documentId ? `/articles/${created.documentId}` : "/articles")
      }, 900)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish the article. Please try again."
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="card-base p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to share your adventure?</h2>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to create a new article. Sign in to continue or create a new account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/login" className="btn-primary text-center">
            Sign In
          </Link>
          <Link href="/register" className="btn-outline text-center">
            Create an Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card-base p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
            Article Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="A memorable headline for your journey"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.5fr,1fr]">
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
              Story
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Share your travel experience with vivid details, tips, and highlights."
              className="w-full min-h-[200px] resize-y px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
              required
            />
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="coverImageUrl" className="block text-sm font-semibold text-foreground mb-2">
                Cover Image URL
              </label>
              <input
                id="coverImageUrl"
                type="url"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-semibold text-foreground mb-2">
                Category
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((category) => (
                  <option key={category.documentId} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="mt-3 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingCategory((prev) => !prev)
                    setCategoryError("")
                  }}
                  className="text-sm font-semibold text-primary hover:text-secondary transition-colors"
                >
                  {isCreatingCategory ? "Cancel new category" : "Add new category"}
                </button>

                {isCreatingCategory && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(event) => {
                        setNewCategoryName(event.target.value)
                        setCategoryError("")
                      }}
                      placeholder="Enter new category name"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newCategoryName.trim()) {
                            setCategoryError("Category name cannot be empty.")
                            return
                          }
                          try {
                            const category = await createCategory({ name: newCategoryName.trim() })
                            const option = {
                              id: category.id,
                              documentId: category.documentId,
                              name: category.name,
                            }
                            setCategoryOptions((prev) => [option, ...prev])
                            setSharedCategories((prev) => [option, ...prev.filter((item) => item.id !== option.id)])
                            void refreshCategories()
                            setCategoryId(String(category.id))
                            setNewCategoryName("")
                            setIsCreatingCategory(false)
                            setCategoryError("")
                          } catch (error) {
                            const message =
                              error instanceof Error ? error.message : "Failed to create category. Please try again."
                            setCategoryError(message)
                          }
                        }}
                        disabled={newCategoryName.trim().length === 0}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Save Category
                      </button>
                      {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
                    </div>
                  </div>
                )}
              </div>

              {categoryOptions.length === 0 && !isCreatingCategory && (
                <p className="mt-2 text-xs text-muted-foreground">
                  No categories available yet. You can create one above or publish without selecting a category.
                </p>
              )}
            </div>

            <div>
              <p className="block text-sm font-semibold text-foreground mb-2">Cover Preview</p>
              <div className="relative h-40 rounded-lg overflow-hidden border border-border bg-muted">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div className="text-sm">
            {errorMessage && <p className="text-destructive">{errorMessage}</p>}
            {successMessage && <p className="text-emerald-600">{successMessage}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <Link href="/articles" className="btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <FilePlus size={18} />
                Publish Article
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
