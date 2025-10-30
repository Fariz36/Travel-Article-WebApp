"use client"

import { Suspense } from "react"
import LoginContent from "@/components/login"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginContent />
    </Suspense>
  )
}
