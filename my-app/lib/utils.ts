import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValidImageUrl(url?: string | null): string {
  if (!url) return "/placeholder.svg"
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url
  }
  return "/placeholder.svg"
}

export function pickRandomItems<T>(items: T[], count: number): T[] {
  if (items.length <= count) {
    return [...items]
  }

  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count)
}
