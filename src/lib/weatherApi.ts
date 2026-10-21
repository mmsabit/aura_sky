import { createCachedRequest } from './requestCache'

export type WeatherValues = {
  temperature?: number
  temperatureApparent?: number
  humidity?: number
  precipitationProbability?: number
  rainIntensity?: number
  sleetIntensity?: number
  snowIntensity?: number
  pressureSeaLevel?: number
  windSpeed?: number
  windDirection?: number
  uvIndex?: number
  weatherCode?: number
}

export type DailyValues = {
  temperatureMax?: number
  temperatureMin?: number
  temperatureAvg?: number
  rainAccumulationSum?: number
  snowAccumulationSum?: number
  precipitationProbabilityMax?: number
  weatherCodeMax?: number
}

export type HourlyEntry = {
  time: string
  values: WeatherValues
}

export type DailyEntry = {
  time: string
  values: DailyValues
}

export type ForecastData = {
  current: HourlyEntry | null
  daily: DailyEntry[]
  locationName?: string
}

type ForecastResponse = {
  timelines?: {
    hourly?: HourlyEntry[]
    daily?: DailyEntry[]
  }
  location?: {
    name?: string
  }
}

type HistoryResponse = {
  timelines?: {
    hourly?: HourlyEntry[]
  }
}

const forecastCache = createCachedRequest<ForecastData>('forecast')
const historyCache = createCachedRequest<HourlyEntry[]>('history')

function readApiKey() {
  const apiKey = import.meta.env.VITE_WEATHER_API
  if (!apiKey) throw new Error('Missing VITE_WEATHER_API environment variable')
  return apiKey
}

function closestToNow(entries: HourlyEntry[]) {
  if (entries.length === 0) return null

  const now = Date.now()
  return entries.reduce((closest, entry) => {
    const entryTime = new Date(entry.time).getTime()
    const closestTime = new Date(closest.time).getTime()

    if (Number.isNaN(entryTime)) return closest
    if (Number.isNaN(closestTime)) return entry

    return Math.abs(entryTime - now) < Math.abs(closestTime - now) ? entry : closest
  })
}

async function loadForecast(location: string): Promise<ForecastData> {
  const params = new URLSearchParams({
    location,
    timesteps: '1h,1d',
    apikey: readApiKey(),
    units: 'metric',
  })

  const res = await fetch(
    `https://api.tomorrow.io/v4/weather/forecast?${params.toString()}`,
  )
  if (!res.ok) throw new Error(`Forecast request failed: ${res.status}`)

  const data: ForecastResponse = await res.json()
  const hourly = data.timelines?.hourly ?? []
  const daily = data.timelines?.daily ?? []

  if (hourly.length === 0 && daily.length === 0) {
    throw new Error('Forecast response is missing data')
  }

  return {
    current: closestToNow(hourly),
    daily,
    locationName: data.location?.name,
  }
}

async function loadHistory(location: string): Promise<HourlyEntry[]> {
  const params = new URLSearchParams({
    location,
    timesteps: '1h',
    apikey: readApiKey(),
    units: 'metric',
  })

  const res = await fetch(
    `https://api.tomorrow.io/v4/weather/history/recent?${params.toString()}`,
  )
  if (!res.ok) throw new Error(`Temperature history request failed: ${res.status}`)

  const data: HistoryResponse = await res.json()
  const hourly = data.timelines?.hourly ?? []
  if (hourly.length === 0) throw new Error('Temperature history response is missing data')

  return hourly
}

export function fetchForecast(location: string) {
  return forecastCache(location, () => loadForecast(location))
}

export function fetchHistory(location: string) {
  return historyCache(location, () => loadHistory(location))
}
