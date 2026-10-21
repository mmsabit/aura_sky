import { useEffect, useState } from 'react'
import { useGeolocated } from 'react-geolocated'
import { DEFAULT_PLACE, reverseGeocode, type Place } from './usePlace'

const GEOLOCATION_OPTIONS = { userDecisionTimeout: 8000 }

export type CurrentLocation = {
  coords: { latitude: number; longitude: number } | null
  /** Rounded coordinates used as a stable key for requests. */
  latitudeKey: string | null
  longitudeKey: string | null
  city: string
  placeLabel: string
  locationError: boolean
  placeError: boolean
}

/**
 * Resolves the visitor's coordinates and a human-readable place name.
 * This only uses the browser Geolocation API and the reverse-geocode
 * service, not the weather API.
 */
export function useCurrentLocation(): CurrentLocation {
  const { coords, isGeolocationAvailable, positionError } =
    useGeolocated(GEOLOCATION_OPTIONS)

  const { latitude, longitude } = coords ?? {}
  const hasCoords = latitude !== undefined && longitude !== undefined

  // Round coordinates so tiny GPS updates don't trigger extra requests.
  const latitudeKey = hasCoords ? latitude.toFixed(3) : null
  const longitudeKey = hasCoords ? longitude.toFixed(3) : null

  // react-geolocated also clears `isGeolocationEnabled` for its internal
  // "user decision" timeout, so only treat unsupported or denied as failures.
  const locationError = !isGeolocationAvailable || positionError !== undefined

  const [place, setPlace] = useState<Place | null>(null)
  const [placeError, setPlaceError] = useState(false)

  useEffect(() => {
    if (latitudeKey === null || longitudeKey === null) return

    let active = true

    reverseGeocode(Number(latitudeKey), Number(longitudeKey))
      .then((data) => {
        if (!active) return
        setPlace(data)
        setPlaceError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setPlace(null)
        setPlaceError(true)
      })

    return () => {
      active = false
    }
  }, [latitudeKey, longitudeKey])

  const resolvedPlace = place ?? (locationError ? DEFAULT_PLACE : null)
  const city = resolvedPlace?.city ?? resolvedPlace?.locality ?? ''
  const placeLabel = city
    ? [city, resolvedPlace?.principalSubdivision].filter(Boolean).join(', ')
    : ''

  return {
    coords: hasCoords ? { latitude, longitude } : null,
    latitudeKey,
    longitudeKey,
    city,
    placeLabel,
    locationError,
    placeError,
  }
}
