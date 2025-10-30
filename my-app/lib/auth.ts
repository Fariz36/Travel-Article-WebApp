const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://extra-brooke-yeremiadio-46b2183e.koyeb.app"

const AUTH_COOKIE_KEY = "travelhub_token"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

interface StrapiErrorResponse {
  error?: {
    status?: number
    name?: string
    message?: string
    details?: unknown
  }
  message?: string
}

export interface AuthSuccessResponse {
  jwt: string
  user: {
    id: number
    documentId?: string
    username: string
    email: string
    provider?: string
    confirmed?: boolean
    blocked?: boolean
  }
}

async function postAuth<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let errorMessage = "Unable to reach the authentication service."

    try {
      const errorBody = (await response.json()) as StrapiErrorResponse
      errorMessage =
        errorBody?.error?.message ??
        errorBody?.message ??
        `Request failed with status ${response.status}`
    } catch {
      // response body not JSON; keep default error message
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE_KEY}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; sameSite=Lax`
}

export async function loginUser(credentials: { identifier: string; password: string }): Promise<AuthSuccessResponse> {
  const data = await postAuth<AuthSuccessResponse>("/api/auth/local", credentials)
  if (typeof window !== "undefined") {
    localStorage.setItem("travelhub_token", data.jwt)
    localStorage.setItem("travelhub_user", JSON.stringify(data.user))
    setAuthCookie(data.jwt)
  }
  return data
}

export async function registerUser(payload: {
  username: string
  email: string
  password: string
}): Promise<AuthSuccessResponse> {
  return postAuth<AuthSuccessResponse>("/api/auth/local/register", payload)
}

export function getStoredUser() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("travelhub_user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function hasStoredToken() {
  if (typeof window !== "undefined" && localStorage.getItem("travelhub_token")) {
    return true
  }
  if (typeof document !== "undefined") {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${AUTH_COOKIE_KEY}=`))
  }
  return false
}

export function clearStoredUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("travelhub_token")
    localStorage.removeItem("travelhub_user")
  }
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; sameSite=Lax`
  }
}
