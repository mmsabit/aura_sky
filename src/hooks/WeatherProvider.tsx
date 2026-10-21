import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  fetchForecast,
  fetchHistory,
  type ForecastData,
  type HourlyEntry,
} from '../lib/weatherApi'
import { useCurrentLocation } from './useCurrentLocation'
import { WeatherContext, type WeatherContextValue } from './useWeatherData'

export function WeatherProvider({ children }: { children: ReactNode }) {
  const {
    coords,
    latitudeKey,
    longitudeKey,
    city,
    placeLabel,
    locationError,
    placeError,
  } = useCurrentLocation()

  const coordsKey =
    latitudeKey !== null && longitudeKey !== null
      ? `${latitudeKey},${longitudeKey}`
      : null

  // Only fall back to the default city when geolocation truly failed (unsupported or
  // denied). react-geolocated also clears `isGeolocationEnabled` for its internal
  // "user decision" timeout, and treating that as a failure fetched the fallback city
  // first and the real location afterwards, doubling the weather requests.
  const locationKey = coordsKey ?? (locationError ? city || 'New York' : null)

  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [forecastError, setForecastError] = useState(false)
  const [history, setHistory] = useState<HourlyEntry[] | null>(null)
  const [historyError, setHistoryError] = useState(false)

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

  const value = useMemo<WeatherContextValue>(
    () => ({
      coords,
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
      coords,
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
