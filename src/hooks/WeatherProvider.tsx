import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useGeolocated } from 'react-geolocated'
import {
  fetchForecast,
  fetchHistory,
  type ForecastData,
  type HourlyEntry,
} from '../lib/weatherApi'
import { DEFAULT_PLACE, reverseGeocode, type Place } from './usePlace'
import { WeatherContext, type WeatherContextValue } from './useWeatherData'

const GEOLOCATION_OPTIONS = { userDecisionTimeout: 8000 }
const FALLBACK_CITY = DEFAULT_PLACE.city ?? 'New York'

export function WeatherProvider({ children }: { children: ReactNode }) {
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated(GEOLOCATION_OPTIONS)

  const { latitude, longitude } = coords ?? {}
  const hasCoords = latitude !== undefined && longitude !== undefined

  // Round coordinates so tiny GPS updates don't trigger extra requests.
  const latitudeKey = hasCoords ? latitude.toFixed(3) : null
  const longitudeKey = hasCoords ? longitude.toFixed(3) : null
  const coordsKey =
    latitudeKey !== null && longitudeKey !== null
      ? `${latitudeKey},${longitudeKey}`
      : null

  const locationError =
    !isGeolocationAvailable ||
    !isGeolocationEnabled ||
    positionError !== undefined
  const locationKey = coordsKey ?? (locationError ? FALLBACK_CITY : null)

  const [place, setPlace] = useState<Place | null>(null)
  const [placeError, setPlaceError] = useState(false)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [forecastError, setForecastError] = useState(false)
  const [history, setHistory] = useState<HourlyEntry[] | null>(null)
  const [historyError, setHistoryError] = useState(false)

  // Resolve the city name in parallel with the weather requests.
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

  useEffect(() => {
    if (!locationKey) return

    let active = true

    fetchForecast(locationKey)
      .then((data) => {
        if (!active) return
        setForecast(data)
        setForecastError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setForecast(null)
        setForecastError(true)
      })

    return () => {
      active = false
    }
  }, [locationKey])

  useEffect(() => {
    if (!locationKey) return

    let active = true

    fetchHistory(locationKey)
      .then((entries) => {
        if (!active) return
        setHistory(entries)
        setHistoryError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setHistory(null)
        setHistoryError(true)
      })

    return () => {
      active = false
    }
  }, [locationKey])

  const resolvedPlace = place ?? (locationError ? DEFAULT_PLACE : null)
  const city = resolvedPlace?.city ?? resolvedPlace?.locality ?? ''
  const placeLabel = city
    ? [city, resolvedPlace?.principalSubdivision].filter(Boolean).join(', ')
    : ''

  const value = useMemo<WeatherContextValue>(
    () => ({
      coords: hasCoords ? { latitude, longitude } : null,
      city,
      placeLabel,
      forecast,
      history,
      forecastError,
      historyError,
      locationError,
      placeError,
    }),
    [
      hasCoords,
      latitude,
      longitude,
      city,
      placeLabel,
      forecast,
      history,
      forecastError,
      historyError,
      locationError,
      placeError,
    ],
  )

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}
