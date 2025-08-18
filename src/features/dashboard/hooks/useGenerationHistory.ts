"use client"

import { useState, useMemo } from "react"
import { useGetGenerationHistoryQuery } from "../services/generationHistoryApi"
import { skipToken } from "@reduxjs/toolkit/query"

interface UseGenerationHistoryProps {
  projectId?: number | null
  initialSize?: number
}

export function useGenerationHistory({ projectId, initialSize = 20 }: UseGenerationHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialSize)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetGenerationHistoryQuery(
    projectId
      ? { id: projectId, size: pageSize, page: currentPage }
      : skipToken
  )

  // Filtrage local des logos selon status et recherche
  const filteredLogos = useMemo(() => {
    if (!response?.logos || !Array.isArray(response.logos)) {
      return []
    }

    let filtered = response.logos

    if (statusFilter !== "all") {
      filtered = filtered.filter((logo) => {
        if (!logo) return false
        return logo.approved === (statusFilter === "active")
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((logo) => {
        if (!logo) return false
        return logo.name.toLowerCase().includes(query)
      })
    }

    return filtered
  }, [response, statusFilter, searchQuery])

  const pagination = useMemo(
    () => ({
      currentPage: response?.page || 1,
      totalPages: response?.totalPages || 1,
      totalElements: response?.total || 0,
    }),
    [response],
  )

  const goToPage = (page: number) => setCurrentPage(page)
  const goToNextPage = () => setCurrentPage((p) => p + 1)
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1))
  const changePageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    logos: filteredLogos,
    originalLogos: response?.logos || [],
    isLoading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    refetch,
  }
}
