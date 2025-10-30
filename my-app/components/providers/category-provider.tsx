"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { getCategoriesList, type CategoryOption } from "@/lib/api"

interface CategoryContextValue {
  categories: CategoryOption[]
  refreshCategories: () => Promise<void>
  setCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>
  isLoading: boolean
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined)

interface CategoryProviderProps {
  children: React.ReactNode
  initialCategories?: CategoryOption[]
}

export function CategoryProvider({ children, initialCategories = [] }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const list = await getCategoriesList()
      setCategories(list)
    } catch (error) {
      console.error("Failed to refresh categories:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialCategories.length === 0) {
      void refreshCategories()
    }
  }, [initialCategories.length, refreshCategories])

  const value = useMemo(
    () => ({
      categories,
      refreshCategories,
      setCategories,
      isLoading,
    }),
    [categories, refreshCategories, isLoading]
  )

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}
