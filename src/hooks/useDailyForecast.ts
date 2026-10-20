import { useEffect, useState } from "react"

export type DailyValues = {
  temperatureMax?: number
  temperatureMin?: number
  temperatureAvg?: number
  rainAccumulationSum?: number
  snowAccumulationSum?: number
  precipitationProbabilityMax?: number
}

export type DailyEntry = {
  time: string
  values: DailyValues
}

type ForecastResponse = {
  timelines?: {
    daily?: DailyEntry[]
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000

let cachedForecast: {
  city: string
  timestamp: number
  request: Promise<DailyEntry[]>
} | null = null

function fetchDailyForecast(city: string) {
  const now = Date.now()
  if (
    cachedForecast?.city === city &&
    now - cachedForecast.timestamp < CACHE_TTL_MS
  ) {
    return cachedForecast.request
  }

  const apiKey = import.meta.env.VITE_WEATHER_API
  const params = new URLSearchParams({
    location: city,
    timesteps: '1d',
    apikey: apiKey ?? '',
    units: 'metric',
  })

  const request = (async () => {
    if (!apiKey) throw new Error('Missing VITE_WEATHER_API environment variable')

    const res = await fetch(
      `https://api.tomorrow.io/v4/weather/forecast?${params.toString()}`,
    )
    if (!res.ok) throw new Error(`Forecast request failed: ${res.status}`)

    const data: ForecastResponse = await res.json()
    const entries = data.timelines?.daily ?? []
    if (entries.length === 0) throw new Error('Forecast response is missing daily data')

    return entries
  })()

  cachedForecast = { city, timestamp: now, request }
  request.catch(() => {
    if (cachedForecast?.city === city) cachedForecast = null
  })

  return request
}

export function useDailyForecast(city: string) {
  const [daily, setDaily] = useState<DailyEntry[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!city) return

    let active = true

    fetchDailyForecast(city)
      .then((entries) => {
        if (!active) return
        setDaily(entries)
        setError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setDaily(null)
        setError(true)
      })

    return () => {
      active = false
    }
  }, [city])

  return { daily, error }
}
