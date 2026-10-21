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
  const [forecastKey, setForecastKey] = useState<string | null>(null)
  const [forecastFailed, setForecastFailed] = useState(false)
  const [history, setHistory] = useState<HourlyEntry[] | null>(null)
  const [historyKey, setHistoryKey] = useState<string | null>(null)
  const [historyFailed, setHistoryFailed] = useState(false)

  useEffect(() => {
    if (!locationKey) return

    let active = true

    fetchForecast(locationKey)
      .then((data) => {
        if (!active) return
        setForecast(data)
        setForecastFailed(false)
        setForecastKey(locationKey)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setForecast(null)
        setForecastFailed(true)
        setForecastKey(locationKey)
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
        setHistoryFailed(false)
        setHistoryKey(locationKey)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setHistory(null)
        setHistoryFailed(true)
        setHistoryKey(locationKey)
      })

    return () => {
      active = false
    }
  }, [locationKey])

  // Data is tagged with the location it belongs to, so switching location
  // immediately hides the previous reading and shows the loader until the
  // new request resolves.
  const forecastReady = forecastKey === locationKey
  const historyReady = historyKey === locationKey
  const activeForecast = forecastReady ? forecast : null
  const activeHistory = historyReady ? history : null
  const forecastLoading = locationKey === null || !forecastReady
  const historyLoading = locationKey === null || !historyReady
  const forecastError = forecastReady && forecastFailed
  const historyError = historyReady && historyFailed

  const value = useMemo<WeatherContextValue>(
    () => ({
      coords,
      city,
      placeLabel,
      forecast: activeForecast,
      history: activeHistory,
      forecastLoading,
      historyLoading,
      forecastError,
      historyError,
      locationError,
      placeError,
    }),
    [
      coords,
      city,
      placeLabel,
      activeForecast,
      activeHistory,
      forecastLoading,
      historyLoading,
      forecastError,
      historyError,
      locationError,
      placeError,
    ],
  )

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}
