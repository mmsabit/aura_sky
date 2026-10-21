import { createCachedRequest } from './requestCache'

export type GeoResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  countryCode?: string
  admin1?: string
  admin2?: string
  timezone?: string
  population?: number
  elevation?: number
}

type GeoResponse = {
  results?: GeoResult[]
}

const GEOCODE_TTL_MS = 60 * 60 * 1000

const searchCache = createCachedRequest<GeoResult[]>('location-search', GEOCODE_TTL_MS)

/**
 * Forward-geocodes a free-text place name into candidate locations.
 * Uses the keyless Open-Meteo geocoding API so the search box can offer
 * several matches; the chosen match is then detailed via Tomorrow.io.
 */
export function searchLocations(query: string) {
  const trimmed = query.trim()
  const key = trimmed.toLowerCase()

  return searchCache(key, async () => {
    const params = new URLSearchParams({
      name: trimmed,
      count: '8',
      language: 'en',
      format: 'json',
    })

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    )
    if (!res.ok) throw new Error(`Location search failed: ${res.status}`)

    const data = (await res.json()) as GeoResponse
    return data.results ?? []
  })
}

export function formatPlaceLabel(place: GeoResult) {
  return [place.admin1, place.country].filter(Boolean).join(', ')
}

export function formatCoordinates(latitude: number, longitude: number) {
  const lat = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`
  const lon = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`
  return `${lat}, ${lon}`
}
