"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Save, Trash2 } from "lucide-react"

import { createCategory, deleteArticle, updateArticle, type ArticleDetail, type CategoryOption } from "@/lib/api"
import { getStoredUser, hasStoredToken } from "@/lib/auth"
import { getValidImageUrl } from "@/lib/utils"
import { useCategories } from "@/components/providers/category-provider"

interface EditArticleFormProps {
  article: ArticleDetail
  categories: CategoryOption[]
}

export function EditArticleForm({ article, categories }: EditArticleFormProps) {
  const router = useRouter()
  const { categories: sharedCategories, setCategories: setSharedCategories, refreshCategories } = useCategories()

  const [title, setTitle] = useState(article.title)
  const [coverImageUrl, setCoverImageUrl] = useState(article.coverImageUrl ?? "")
  const [categoryId, setCategoryId] = useState(article.categoryId ? String(article.categoryId) : "")
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories.length ? categories : sharedCategories)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categoryError, setCategoryError] = useState("")
  const [description, setDescription] = useState(article.body ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [authStatusChecked, setAuthStatusChecked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const ensureCategoryPresence = () => {
      if (!article.categoryId || !article.categoryDocumentId || !article.categoryName) {
        return
      }

      setCategoryOptions((prev) => {
        const exists = prev.some((category) => category.id === article.categoryId)
        if (exists) return prev
        return [
          ...prev,
          {
            id: article.categoryId,
            documentId: article.categoryDocumentId,
            name: article.categoryName,
          },
        ]
      })
    }

    ensureCategoryPresence()
  }, [article.categoryDocumentId, article.categoryId, article.categoryName])

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryOptions(categories)
      if (sharedCategories.length === 0) {
        setSharedCategories(categories)
      }
    }
  }, [categories, setSharedCategories, sharedCategories.length])

  useEffect(() => {
    if (sharedCategories.length > 0) {
      setCategoryOptions(sharedCategories)
    }
  }, [sharedCategories])

  useEffect(() => {
    const checkAccess = () => {
      const authenticated = hasStoredToken()
      setIsAuthenticated(authenticated)
      const storedUser = getStoredUser()
      const owner =
        !!storedUser &&
        ((article.authorDocumentId && storedUser.documentId === article.authorDocumentId) ||
          (article.authorId && storedUser.id === article.authorId))
      setIsOwner(owner)
      setAuthStatusChecked(true)
    }

    checkAccess()
    window.addEventListener("storage", checkAccess)
    return () => window.removeEventListener("storage", checkAccess)
  }, [article.authorDocumentId, article.authorId])

  const coverPreview = useMemo(() => getValidImageUrl(coverImageUrl || null), [coverImageUrl])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setErrorMessage("Please sign in to update this article.")
      return
    }
    if (!isOwner) {
      setErrorMessage("You are not authorized to edit this article.")
      return
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please provide both a title and a story for your article.")
      return
    }

    const confirmed = window.confirm("Are you sure you want to update this article?")
    if (!confirmed) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const updated = await updateArticle(article.documentId, {
        title: title.trim(),
        description: description.trim(),
        coverImageUrl: coverImageUrl.trim() || null,
        categoryId: categoryId ? Number(categoryId) : null,
      })

      setSuccessMessage("Article updated successfully. Redirecting...")
      setTimeout(() => {
        const targetId = updated.documentId || String(updated.id)
        router.push(targetId ? `/articles/${targetId}` : `/articles/${article.documentId}`)
      }, 900)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update the article. Please try again."
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteArticle = async () => {
    if (isSubmitting || isDeleting) {
      return
    }

    const confirmed = window.confirm(
      "Deleting this article is permanent. Do you want to continue?"
    )
    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setDeleteError("")

    try {
      await deleteArticle(article.documentId)
      router.push("/articles")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete the article. Please try again."
      setDeleteError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!authStatusChecked) {
    return (
      <div className="card-base p-8">
        <p className="text-muted-foreground text-sm">Checking your access...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="card-base p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">Sign in to edit this article</h2>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to update your article. Sign in to continue or create a new account.
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

  if (!isOwner) {
    return (
      <div className="card-base p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">You cannot edit this article</h2>
        <p className="text-muted-foreground mb-6">
          Only the original author can edit this post. If you believe this is an error, try refreshing the page or
          contact support.
        </p>
        <Link href={`/articles/${article.documentId}`} className="btn-primary text-center w-full sm:w-auto">
          Back to Article
        </Link>
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
            placeholder="Update your headline"
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
              placeholder="Refine the story of this journey."
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
              {coverPreview && (
                <div className="mt-3 rounded-lg overflow-hidden border border-border max-h-48">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
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
                            setCategoryOptions((prev) => [...prev, option])
                            setSharedCategories((prev) => [...prev, option])
                            await refreshCategories()
                            setCategoryId(String(category.id))
                            setIsCreatingCategory(false)
                            setNewCategoryName("")
                            setCategoryError("")
                          } catch (error) {
                            const message =
                              error instanceof Error
                                ? error.message
                                : "Failed to create category. Please try again."
                            setCategoryError(message)
                          }
                        }}
                        className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save category
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingCategory(false)
                          setNewCategoryName("")
                          setCategoryError("")
                        }}
                        className="btn-outline text-sm px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                    {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {(errorMessage || successMessage || deleteError) && (
          <div className="space-y-2">
            {errorMessage && (
              <div className="text-sm text-destructive" role="alert">
                {errorMessage}
              </div>
            )}
            {deleteError && (
              <div className="text-sm text-destructive" role="alert">
                {deleteError}
              </div>
            )}
            {successMessage && (
              <div className="text-sm text-emerald-600" role="status">
                {successMessage}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => router.back()} className="btn-outline px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDeleteArticle}
              disabled={isDeleting}
              className="btn-destructive inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>

          <Link href={`/articles/${article.documentId}`} className="text-sm text-primary hover:text-secondary font-medium">
            View article
          </Link>
        </div>
      </form>
    </div>
  )
}
