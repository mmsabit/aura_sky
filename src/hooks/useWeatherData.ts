import { createContext, useContext } from 'react'
import type { ForecastData, HourlyEntry } from '../lib/weatherApi'

export type WeatherContextValue = {
  coords: { latitude: number; longitude: number } | null
  city: string
  placeLabel: string
  forecast: ForecastData | null
  history: HourlyEntry[] | null
  forecastError: boolean
  historyError: boolean
  locationError: boolean
  placeError: boolean
}

export const WeatherContext = createContext<WeatherContextValue | null>(null)

export function useWeatherData() {
  const value = useContext(WeatherContext)
  if (!value) throw new Error('useWeatherData must be used within a WeatherProvider')
  return value
}
