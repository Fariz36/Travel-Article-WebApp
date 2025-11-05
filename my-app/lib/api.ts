const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://extra-brooke-yeremiadio-46b2183e.koyeb.app"

type ApiListResponse<T> = {
  data: T[]
  meta: {
    pagination?: ApiPagination
    [key: string]: unknown
  }
}

type ApiSingleResponse<T> = {
  data: T
  meta: Record<string, unknown>
}

export type ApiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
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

export interface ArticlesListQueryParams {
  pageSize?: number
  page?: number
  categoryName?: string
  searchQuery?: string
}

export interface ArticlesListQueryResult {
  articles: ArticleListItem[]
  pagination: ApiPagination | null
}

const defaultRevalidate = 60

async function resolveAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("travelhub_token")
  }

  try {
    const { cookies } = await import("next/headers")
    const Cookie = await cookies();
    return Cookie.get("travelhub_token")?.value ?? null
  } catch (error) {
    console.warn("Failed to read auth token from cookies on the server:", error)
    return null
  }
}

async function fetchFromApi<T>(path: string, init: RequestInit = {}, revalidate = defaultRevalidate): Promise<T> {
  const headers = new Headers(init.headers ?? {})
  if (!headers.has("Authorization")) {
    const token = await resolveAuthToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }
  if (!headers.has("Content-Type") && init.method && init.method !== "GET") {
    headers.set("Content-Type", "application/json")
  }

  // console.log("CALLING API : ", `${API_BASE_URL}${path}`, "with authorization : ", headers.get("Authorization"));

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
  const result = await fetchArticlesList(params)
  return result.articles
}

export async function fetchArticlesList(params?: ArticlesListQueryParams): Promise<ArticlesListQueryResult> {
  const searchParams = new URLSearchParams()
  searchParams.set("populate", "*")
  searchParams.set("sort", "createdAt:desc")
  if (params?.pageSize) {
    searchParams.set("pagination[pageSize]", params.pageSize.toString())
  }
  if (params?.page) {
    searchParams.set("pagination[page]", params.page.toString())
  }
  if (params?.categoryName) {
    searchParams.set("filters[category][name][$eqi]", params.categoryName)
  }
  const trimmedQuery = params?.searchQuery?.trim()
  if (trimmedQuery) {
    searchParams.set("filters[title][$contains]", trimmedQuery)
  }

  const response = await fetchFromApi<ApiListResponse<ArticleEntity>>(`/api/articles?${searchParams.toString()}`)

  return {
    articles: response.data.map(mapArticleToListItem),
    pagination: response.meta.pagination ?? null,
  }
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

  const commentDocumentIds =
    article.comments?.map((comment) => comment.documentId).filter((id): id is string => Boolean(id)) ?? []

  const comments = await fetchCommentsWithUsers(commentDocumentIds)

  return {
    ...mapArticleToListItem(article),
    body: article.description ?? "",
    comments:
      comments.map((comment) => ({
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

async function fetchCommentWithUser(documentId: string): Promise<CommentEntity | null> {
  try {
    const response = await fetchFromApi<ApiSingleResponse<CommentEntity>>(
      `/api/comments/${documentId}?populate[user]=*`,
      {},
      0
    )
    return response.data ?? null
  } catch (error) {
    console.error(`Failed to load comment ${documentId}:`, error)
    return null
  }
}

export async function fetchCommentsWithUsers(documentIds: string[]): Promise<CommentEntity[]> {
  if (documentIds.length === 0) {
    return []
  }

  const results = await Promise.all(documentIds.map((documentId) => fetchCommentWithUser(documentId)))

  return results.filter((comment): comment is CommentEntity => comment !== null)
}
