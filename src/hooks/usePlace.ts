import { createCachedRequest } from "../lib/requestCache"

export type Place = {
  city?: string
  locality?: string
  principalSubdivision?: string
}

export const DEFAULT_PLACE: Place = {
  city: 'New York',
  locality: 'New York',
  principalSubdivision: 'New York',
}

const GEOCODE_TTL_MS = 60 * 60 * 1000

const geocodeCache = createCachedRequest<Place>('reverse-geocode', GEOCODE_TTL_MS)

export function reverseGeocode(latitude: number, longitude: number) {
  // Round so GPS jitter (and other callers using raw coordinates) hit the same cache entry.
  const roundedLatitude = latitude.toFixed(3)
  const roundedLongitude = longitude.toFixed(3)
  const key = `${roundedLatitude},${roundedLongitude}`

  return geocodeCache(key, () => {
    const params = new URLSearchParams({
      latitude: roundedLatitude,
      longitude: roundedLongitude,
      key: import.meta.env.VITE_GEO_API_KEY,
    })

    return fetch(
      `https://api-bdc.net/data/reverse-geocode?${params.toString()}`,
    ).then((res) => {
      if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`)
      return res.json() as Promise<Place>
    })
  })
}
