import { useCallback } from 'react'  // Import from React, not react-router-dom
import { useSearchParams } from 'react-router-dom'  // Import router hooks separately

export const useDashboardNavigate = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const navigateToPage = useCallback((page) => {
    setSearchParams({ page })
  }, [setSearchParams])

  const getCurrentPage = useCallback(() => {
    return searchParams.get('page')
  }, [searchParams])

  return {
    navigateToPage,
    getCurrentPage,
  }
}

export default useDashboardNavigate
