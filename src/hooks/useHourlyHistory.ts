import { useEffect, useState } from "react"

export type HourlyValues = {
  temperature?: number
  temperatureApparent?: number
}

export type HourlyEntry = {
  time: string
  values: HourlyValues
}

type HistoryResponse = {
  timelines?: {
    hourly?: HourlyEntry[]
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000

let cachedHistory: {
  city: string
  timestamp: number
  request: Promise<HourlyEntry[]>
} | null = null

function fetchHourlyHistory(city: string) {
  const now = Date.now()
  if (
    cachedHistory?.city === city &&
    now - cachedHistory.timestamp < CACHE_TTL_MS
  ) {
    return cachedHistory.request
  }

  const apiKey = import.meta.env.VITE_WEATHER_API
  const params = new URLSearchParams({
    location: city,
    timesteps: '1h',
    apikey: apiKey ?? '',
    units: 'metric',
  })

  const request = (async () => {
    if (!apiKey) throw new Error('Missing VITE_WEATHER_API environment variable')

    const res = await fetch(
      `https://api.tomorrow.io/v4/weather/history/recent?${params.toString()}`,
    )
    if (!res.ok) throw new Error(`Temperature history request failed: ${res.status}`)

    const data: HistoryResponse = await res.json()
    const entries = data.timelines?.hourly ?? []
    if (entries.length === 0) throw new Error('Temperature history response is missing data')

    return entries
  })()

  cachedHistory = { city, timestamp: now, request }
  request.catch(() => {
    if (cachedHistory?.city === city) cachedHistory = null
  })

  return request
}

export function useHourlyHistory(city: string) {
  const [hourly, setHourly] = useState<HourlyEntry[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!city) return

    let active = true

    fetchHourlyHistory(city)
      .then((entries) => {
        if (!active) return
        setHourly(entries)
        setError(false)
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setHourly(null)
        setError(true)
      })

    return () => {
      active = false
    }
  }, [city])

  return { hourly, error }
}
