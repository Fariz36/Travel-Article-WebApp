"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">TravelHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/articles" className="text-foreground hover:text-primary transition-colors font-medium">
              Explore
            </Link>
            <Link href="/articles" className="text-foreground hover:text-primary transition-colors font-medium">
              Articles
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-primary font-semibold hover:text-secondary transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Get Started
            </Link>
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
            <Link href="/articles" className="block py-2 text-foreground hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/articles" className="block py-2 text-foreground hover:text-primary transition-colors">
              Articles
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <Link href="/login" className="flex-1 text-center py-2 text-primary font-semibold">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
