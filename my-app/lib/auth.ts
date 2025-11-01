const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://extra-brooke-yeremiadio-46b2183e.koyeb.app"

const SESSION_ENDPOINT = "/api/auth/session"

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

export async function loginUser(credentials: { identifier: string; password: string }): Promise<AuthSuccessResponse> {
  const data = await postAuth<AuthSuccessResponse>("/api/auth/local", credentials)
  if (typeof window !== "undefined") {
    localStorage.setItem("travelhub_token", data.jwt)
    localStorage.setItem("travelhub_user", JSON.stringify(data.user))
    try {
      await fetch(SESSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: data.jwt, remember: true }),
      })
    } catch (error) {
      console.warn("Failed to persist session cookie:", error)
    }
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
  return false
}

export function clearStoredUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("travelhub_token")
    localStorage.removeItem("travelhub_user")
    void fetch(SESSION_ENDPOINT, { method: "DELETE" }).catch((error) => {
      console.warn("Failed to clear session cookie:", error)
    })
  }
}
