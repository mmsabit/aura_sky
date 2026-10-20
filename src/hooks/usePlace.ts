import { useEffect, useState } from "react"
import { useGeolocated } from "react-geolocated"

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

const GEOLOCATION_OPTIONS = { userDecisionTimeout: 8000 }

let cachedGeocode: { key: string; request: Promise<Place> } | null = null

export function reverseGeocode(latitude: number, longitude: number) {
  const key = `${latitude},${longitude}`
  if (cachedGeocode?.key === key) return cachedGeocode.request

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    key: import.meta.env.VITE_GEO_API_KEY,
  })

  const request = fetch(`https://api-bdc.net/data/reverse-geocode?${params.toString()}`).then(
    (res) => {
      if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`)
      return res.json() as Promise<Place>
    },
  )

  cachedGeocode = { key, request }
  request.catch(() => {
    if (cachedGeocode?.key === key) cachedGeocode = null
  })

  return request
}

export function usePlace() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled, positionError } =
    useGeolocated(GEOLOCATION_OPTIONS)
  const latitude = coords?.latitude
  const longitude = coords?.longitude

  const [place, setPlace] = useState<Place | null>(null)
  const [error, setError] = useState(false)

  const geolocationFailed =
    !isGeolocationAvailable || !isGeolocationEnabled || positionError !== undefined

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return

    let active = true

    reverseGeocode(latitude, longitude)
      .then((data) => {
        if (!active) return
        setPlace(data)
        setError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setError(true)
      })

    return () => {
      active = false
    }
  }, [latitude, longitude])

  const resolvedPlace = place ?? (geolocationFailed ? DEFAULT_PLACE : null)

  return { coords, place: resolvedPlace, error }
}
