const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://extra-brooke-yeremiadio-46b2183e.koyeb.app"

const API_TOKEN =
  process.env.NEXT_PUBLIC_API_TOKEN ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM3LCJpYXQiOjE3NjE4MDQ4MzMsImV4cCI6MTc2NDM5NjgzM30.2Ns_buAX6T6puaFsxy7LQuj191q0j7F1o1pzDSEEFKQ"

type ApiListResponse<T> = {
  data: T[]
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
    [key: string]: unknown
  }
}

type ApiSingleResponse<T> = {
  data: T
  meta: Record<string, unknown>
}

export interface ArticleEntity {
  id: number
  documentId: string
  title: string
  description: string
  cover_image_url?: string | null
  createdAt: string
  updatedAt: string
  publishedAt?: string
  locale?: string | null
  user?: {
    id: number
    documentId: string
    username: string
    email: string
  } | null
  category?: {
    id: number
    documentId: string
    name: string
  } | null
  comments?: Array<{
    id: number
    documentId: string
    content: string
    createdAt: string
    user?: {
      username?: string
      email?: string
    } | null
  }>
  localizations?: ArticleEntity[]
}

export interface ArticleListItem {
  id: number
  documentId: string
  title: string
  description: string
  coverImageUrl: string | null
  categoryName: string
  authorName: string
  createdAt: string
}

export interface ArticleDetail extends ArticleListItem {
  body: string
  comments: Array<{
    id: number
    documentId: string
    content: string
    createdAt: string
    user?: {
      username?: string
      email?: string
    } | null
  }>
}

export interface CategoryEntity {
  id: number
  documentId: string
  name: string
  description?: string | null
}

export interface CategoryOption {
  id: number
  documentId: string
  name: string
}

export interface CreateArticlePayload {
  title: string
  description: string
  coverImageUrl?: string
  categoryId?: number
}

export interface CommentEntity {
  id: number
  documentId: string
  content: string
  createdAt: string
  article?: {
    id: number
  }
  user?: {
    id: number
    username: string
    email: string
  } | null
}

export interface CreateCommentPayload {
  articleId: number
  content: string
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

const defaultRevalidate = 60

async function fetchFromApi<T>(path: string, init: RequestInit = {}, revalidate = defaultRevalidate): Promise<T> {
  const headers = new Headers(init.headers ?? {})
  if (!headers.has("Authorization")) {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("travelhub_token") : null
    const token = storedToken || API_TOKEN
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }
  if (!headers.has("Content-Type") && init.method && init.method !== "GET") {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    next: { revalidate },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`API request failed (${response.status}): ${message || response.statusText}`)
  }

  return response.json()
}

function mapArticleToListItem(article: ArticleEntity): ArticleListItem {
  return {
    id: article.id,
    documentId: article.documentId,
    title: article.title,
    description: article.description,
    coverImageUrl: article.cover_image_url ?? null,
    categoryName: article.category?.name ?? "General",
    authorName: article.user?.username ?? "Anonymous",
    createdAt: article.createdAt,
  }
}

export async function getArticlesList(params?: { pageSize?: number; page?: number }): Promise<ArticleListItem[]> {
  const searchParams = new URLSearchParams()
  searchParams.set("populate", "*")
  searchParams.set("sort", "createdAt:desc")
  if (params?.pageSize) {
    searchParams.set("pagination[pageSize]", params.pageSize.toString())
  }
  if (params?.page) {
    searchParams.set("pagination[page]", params.page.toString())
  }

  const response = await fetchFromApi<ApiListResponse<ArticleEntity>>(`/api/articles?${searchParams.toString()}`)

  return response.data.map(mapArticleToListItem)
}

export async function getArticleByDocumentId(documentId: string): Promise<ArticleDetail> {
  const searchParams = new URLSearchParams()
  searchParams.set("populate", "*")

  const response = await fetchFromApi<ApiSingleResponse<ArticleEntity>>(
    `/api/articles/${documentId}?${searchParams.toString()}`,
    {},
    0
  )

  const article = response.data

  return {
    ...mapArticleToListItem(article),
    body: article.description ?? "",
    comments:
      article.comments?.map((comment) => ({
        id: comment.id,
        documentId: comment.documentId,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user ?? null,
      })) ?? [],
  }
}

export async function getCategoriesList(): Promise<CategoryOption[]> {
  const response = await fetchFromApi<ApiListResponse<CategoryEntity>>("/api/categories", {}, 300)

  return response.data.map((category) => ({
    id: category.id,
    documentId: category.documentId,
    name: category.name,
  }))
}

export async function createArticle(payload: CreateArticlePayload): Promise<ArticleEntity> {
  const body = {
    data: {
      title: payload.title,
      description: payload.description,
      cover_image_url: payload.coverImageUrl ?? null,
      ...(payload.categoryId ? { category: payload.categoryId } : {}),
    },
  }

  const response = await fetchFromApi<ApiSingleResponse<ArticleEntity>>(
    "/api/articles",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    0
  )

  return response.data
}

export async function createComment(payload: CreateCommentPayload): Promise<CommentEntity> {
  const body = {
    data: {
      content: payload.content,
      article: payload.articleId,
    },
  }

  const response = await fetchFromApi<ApiSingleResponse<CommentEntity>>(
    "/api/comments",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    0
  )

  return response.data
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryEntity> {
  const body = {
    data: {
      name: payload.name,
      description: payload.description ?? null,
    },
  }

  const response = await fetchFromApi<ApiSingleResponse<CategoryEntity>>(
    "/api/categories",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    0
  )

  return response.data
}
