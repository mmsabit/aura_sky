import { useEffect, useState } from 'react'
import { searchLocations, type GeoResult } from '../lib/geocoding'

type SearchState = {
  query: string
  results: GeoResult[]
  error: boolean
}

type LocationSearchState = {
  results: GeoResult[]
  isLoading: boolean
  error: boolean
}

const EMPTY_STATE: SearchState = { query: '', results: [], error: false }

/**
 * Geocodes the current search query into a list of matching places.
 * State is tagged with the query it belongs to so stale results are never
 * shown while a new search is in flight.
 */
export function useLocationSearch(query: string): LocationSearchState {
  const [state, setState] = useState<SearchState>(EMPTY_STATE)

  useEffect(() => {
    if (!query) return

    let active = true

    searchLocations(query)
      .then((places) => {
        if (!active) return
        setState({ query, results: places, error: false })
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setState({ query, results: [], error: true })
      })

    return () => {
      active = false
    }
  }, [query])

  const isStale = state.query !== query

  return {
    results: query && !isStale ? state.results : [],
    isLoading: Boolean(query) && isStale,
    error: Boolean(query) && !isStale && state.error,
  }
}
