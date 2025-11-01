import { NextResponse } from "next/server"

const TOKEN_COOKIE_KEY = "travelhub_token"
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

type SetSessionPayload = {
  token?: string
  remember?: boolean
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SetSessionPayload
  const token = body.token?.trim()

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: TOKEN_COOKIE_KEY,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: body.remember === false ? undefined : THIRTY_DAYS_IN_SECONDS,
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: TOKEN_COOKIE_KEY,
    value: "",
    path: "/",
    maxAge: 0,
  })

  return response
}
