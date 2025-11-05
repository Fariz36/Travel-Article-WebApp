"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react"

import { createComment, deleteArticle, type ArticleDetail } from "@/lib/api"
import { getStoredUser, hasStoredToken } from "@/lib/auth"
import { getValidImageUrl } from "@/lib/utils"

interface ArticleContentProps {
  article: ArticleDetail
}

interface DisplayComment {
  id: string
  author: string
  authorEmail?: string
  date: string
  text: string
  documentId?: string
}

function formatDate(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(isoDate))
  } catch {
    return ""
  }
}

export function ArticleContent({ article }: ArticleContentProps) {
  const router = useRouter()
  const initialComments = useMemo<DisplayComment[]>(
    () =>
      article.comments.map((comment) => ({
        id: comment.documentId ?? String(comment.id),
        documentId: comment.documentId,
        author: comment.user?.username ?? comment.user?.email?.split("@")[0] ?? "Community Member",
        authorEmail: comment.user?.email ?? undefined,
        date: formatDate(comment.createdAt),
        text: comment.content,
      })),
    [article.comments]
  )

  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(() => Math.max(24, initialComments.length * 4))
  const [commentInput, setCommentInput] = useState("")
  const [comments, setComments] = useState<DisplayComment[]>(initialComments)
  const [currentUrl, setCurrentUrl] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserName, setCurrentUserName] = useState("You")
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getStoredUser>>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [commentSuccess, setCommentSuccess] = useState("")
  const [isDeletingArticle, setIsDeletingArticle] = useState(false)
  const [articleError, setArticleError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }
  }, [])

  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  useEffect(() => {
    const hydrateAuth = () => {
      const authenticated = hasStoredToken()
      setIsAuthenticated(authenticated)
      const storedUser = getStoredUser()
      if (storedUser) {
        setCurrentUser(storedUser)
        setCurrentUserName(storedUser.username ?? storedUser.email?.split("@")[0] ?? "You")
      } else {
        setCurrentUser(null)
        setCurrentUserName("You")
      }
    }

    hydrateAuth()
    window.addEventListener("storage", hydrateAuth)
    return () => window.removeEventListener("storage", hydrateAuth)
  }, [])

  const handleToggleLike = () => {
    setLiked((prev) => !prev)
    setLikesCount((prev) => prev + (liked ? -1 : 1))
  }

  const handleAddComment = () => {
    const trimmed = commentInput.trim()
    if (!isAuthenticated) {
      setCommentError("Please sign in to join the discussion.")
      return
    }

    if (!trimmed) {
      return
    }

    void submitComment(trimmed)
  }

  const submitComment = async (content: string) => {
    if (isSubmittingComment) return

    setIsSubmittingComment(true)
    setCommentError("")
    setCommentSuccess("")

    try {
      const created = await createComment({
        articleId: article.id,
        content,
      })

      const newComment: DisplayComment = {
        id: created.documentId ?? String(created.id),
        documentId: created.documentId,
        author: currentUserName,
        authorEmail: created.user?.email,
        date: formatDate(created.createdAt),
        text: created.content,
      }

      setComments((prev) => [newComment, ...prev])
      setCommentSuccess("Your comment has been posted.")
      setCommentInput("")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to post comment. Please try again in a moment."
      setCommentError(message)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const formattedDate = formatDate(article.createdAt)
  const isArticleOwner = useMemo(() => {
    if (!currentUser) return false
    if (article.authorDocumentId && currentUser.documentId && article.authorDocumentId === currentUser.documentId) {
      return true
    }
    if (article.authorId && currentUser.id && article.authorId === currentUser.id) {
      return true
    }
    return false
  }, [article.authorDocumentId, article.authorId, currentUser])
  const authorBio = "We are gathering more details about this author. Check back soon for their full travel story."
  const coverImageSrc = getValidImageUrl(article.coverImageUrl)
  const authorAvatarSrc = getValidImageUrl(null)
  const placeholderAvatarSrc = getValidImageUrl(null)

  const handleDeleteArticle = async () => {
    if (!isArticleOwner || isDeletingArticle) {
      return
    }

    const confirmed = window.confirm("Are you sure you want to delete this article? This action cannot be undone.")
    if (!confirmed) {
      return
    }

    setIsDeletingArticle(true)
    setArticleError("")

    try {
      await deleteArticle(article.documentId)
      router.push("/articles")
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete article. Please try again."
      setArticleError(message)
    } finally {
      setIsDeletingArticle(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-linear-to-b from-muted/40 to-background pt-24 pb-12">
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
              <span className="tag-category">{article.categoryName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{article.title}</h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <Image
                src={authorAvatarSrc}
                alt={article.authorName}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-border object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{article.authorName}</p>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-3">
                {isArticleOwner ? (
                  <>
                    <Link
                      href={`/articles/${article.documentId}/edit`}
                      className="btn-outline text-sm inline-flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Edit Article
                    </Link>
                    <button
                      type="button"
                      onClick={handleDeleteArticle}
                      disabled={isDeletingArticle}
                      className="btn-outline text-sm cursor-pointer inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      {isDeletingArticle ? "Deleting..." : "Delete"}
                    </button>
                  </>
                ) : (
                  <button className="btn-primary text-sm">Follow</button>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-12 h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={coverImageSrc}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            {articleError && <div className="mb-4 text-sm text-destructive">{articleError}</div>}
            <div className="text-lg leading-relaxed text-foreground space-y-6">
              {article.body
                .split(/\n{2,}/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          {/* Engagement Section */}
          <div className="card-base p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button
                onClick={handleToggleLike}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart size={24} fill={liked ? "currentColor" : "none"} className={liked ? "text-primary" : ""} />
                <span className="font-semibold">{likesCount}</span>
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
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
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
              {isAuthenticated ? (
                <div className="flex gap-4">
                  <Image
                    src={placeholderAvatarSrc}
                    alt={currentUserName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-border object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentInput}
                      onChange={(event) => setCommentInput(event.target.value)}
                      placeholder="Share your thoughts about this article..."
                      className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                      {(commentError || commentSuccess) && (
                        <p className={commentError ? "text-destructive text-sm" : "text-emerald-600 text-sm"}>
                          {commentError || commentSuccess}
                        </p>
                      )}
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setCommentInput("")}
                          disabled={isSubmittingComment || commentInput.trim().length === 0}
                          className="btn-outline px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleAddComment}
                          disabled={isSubmittingComment || commentInput.trim().length === 0}
                          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm"
                        >
                          {isSubmittingComment ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                              Posting...
                            </>
                          ) : (
                            "Post Comment"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">Join the conversation</p>
                    <p className="text-sm text-muted-foreground">
                      Sign in to share your travel tips or ask the author a question.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/login" className="btn-primary text-sm px-4 py-2">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-outline text-sm px-4 py-2">
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="card-base p-6">
                  <div className="flex gap-4">
                    <Image
                      src={placeholderAvatarSrc}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-border object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{comment.date}</p>
                      </div>
                      <p className="text-foreground mt-2">{comment.text}</p>
                      <button className="text-sm text-primary hover:text-secondary transition-colors mt-2 font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="card-base p-6 text-center text-muted-foreground">
                  Be the first to share your thoughts about this destination.
                </div>
              )}
            </div>
          </div>

          {/* Author Bio */}
          <div className="card-base p-8 bg-linear-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
            <div className="flex gap-6">
              <Image
                src={authorAvatarSrc}
                alt={article.authorName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border border-border object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">About {article.authorName}</h3>
                <p className="text-foreground mb-4">{authorBio}</p>
                <button className="btn-primary text-sm">Follow Author</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
