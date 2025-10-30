"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Menu, X, LogOut, User } from "lucide-react"

import { clearStoredUser, getStoredUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface StoredUser {
  username?: string
  email?: string
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    setUser(getStoredUser())

    const handleStorage = () => {
      setUser(getStoredUser())
    }

    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleSignOut = useCallback(() => {
    clearStoredUser()
    setUser(null)
  }, [])

  const userName = useMemo(() => {
    if (!user) return null
    return user.username || user.email?.split("@")[0] || "Traveller"
  }, [user])

  const navLinks = useMemo(() => {
    const links = [
      { href: "/articles", label: "Explore" },
      { href: "/articles", label: "Articles" },
      { href: "/about", label: "About" },
    ]

    if (userName) {
      links.push({ href: "/articles/create", label: "Create" })
    }

    return links
  }, [userName])

  const authActions = userName ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-foreground">
        <User size={18} className="text-primary" />
        <span className="text-sm font-medium">{userName}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  ) : (
    <>
      <Link href="/login" className="text-primary font-semibold hover:text-secondary transition-colors">
        Sign In
      </Link>
      <Link href="/register" className="btn-primary text-sm">
        Get Started
      </Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">TravelHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={cn("hidden md:flex items-center gap-4", userName ? "text-sm" : undefined)}>
            {authActions}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}-mobile`}
                href={link.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              {userName ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                    <User size={18} className="text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-destructive text-destructive py-2 text-sm font-semibold"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" className="flex-1 text-center py-2 text-primary font-semibold">
                    Sign In
                  </Link>
                  <Link href="/register" className="flex-1 btn-primary text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
