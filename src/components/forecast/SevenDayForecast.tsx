import { useWeatherData } from "../../hooks/useWeatherData"
import { conditionLabel, weatherIcon } from "../../lib/weather"

type ForecastDay = {
  day: string
  icon: string
  high: number
  low: number
  condition: string
  precipChance?: number
  highlight?: boolean
}

function formatDay(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function SevenDayForecast() {
  const { city, forecast: forecastData, forecastError, locationError } = useWeatherData()

  const entries = forecastData?.daily ?? []
  const maxProbability = entries.reduce(
    (max, entry) => Math.max(max, entry.values.precipitationProbabilityMax ?? 0),
    0,
  )
  const highlightIndex =
    maxProbability >= 40
      ? entries.findIndex(
          (entry) => (entry.values.precipitationProbabilityMax ?? 0) === maxProbability,
        )
      : -1

  const forecast: ForecastDay[] = entries.flatMap((entry, index) => {
    const high = entry.values.temperatureMax
    const low = entry.values.temperatureMin
    if (high === undefined || low === undefined) return []

    return [
      {
        day: formatDay(entry.time),
        icon: weatherIcon(entry.values.weatherCodeMax),
        high: Math.round(high),
        low: Math.round(low),
        condition: conditionLabel(entry.values.weatherCodeMax),
        precipChance:
          entry.values.precipitationProbabilityMax === undefined
            ? undefined
            : Math.round(entry.values.precipitationProbabilityMax),
        highlight: index === highlightIndex,
      },
    ]
  })

  const statusMessage = locationError
    ? 'Location unavailable — cannot load the forecast.'
    : forecastError
      ? 'Forecast unavailable right now.'
      : 'Loading 7-day forecast…'

  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">calendar_view_week</span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
            7-Day Forecast
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline font-medium hidden sm:inline-block">
          High-resolution ensemble model forecast
          {city ? ` · ${city}` : ''}
        </span>
      </div>

      {forecast.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-space-md">
          {forecast.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className={`p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center justify-between gap-space-sm ${
                day.highlight ? 'relative overflow-hidden' : ''
              } ${index === forecast.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              {day.precipChance !== undefined && day.precipChance > 0 ? (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary-fixed text-primary absolute top-2 right-2">
                  {day.precipChance}%
                </span>
              ) : null}
              <span className="font-label-md text-label-md font-semibold text-on-surface">{day.day}</span>
              <div
                className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center ${
                  day.highlight ? 'text-primary' : 'text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[28px]">{day.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">{day.high}°</span>
                <span className="font-label-sm text-label-sm text-outline">Low: {day.low}°</span>
              </div>
              <span
                className={`font-label-sm text-label-sm ${
                  day.highlight ? 'text-secondary font-medium' : 'text-on-surface-variant'
                }`}
              >
                {day.condition}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant shadow-sm">
          {statusMessage}
        </div>
      )}
    </section>
  )
}

export default SevenDayForecast
