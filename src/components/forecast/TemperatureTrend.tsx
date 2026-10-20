import { useState } from "react"
import TempGraph, { type TemperatureMetric, type TemperaturePoint } from "./TempGraph"
import { useDailyForecast, type DailyEntry } from "../../hooks/useDailyForecast"
import { usePlace } from "../../hooks/usePlace"

const METRICS: { key: TemperatureMetric; label: string }[] = [
  { key: 'max', label: 'High' },
  { key: 'avg', label: 'Average' },
  { key: 'min', label: 'Low' },
]

const METRIC_KEYS = {
  max: 'temperatureMax',
  avg: 'temperatureAvg',
  min: 'temperatureMin',
} as const

function formatDay(iso: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { ...options, timeZone: 'UTC' })
}

function roundTemperature(value?: number) {
  return value === undefined || !Number.isFinite(value) ? null : Math.round(value)
}

function TemperatureTrend() {
  const { place: currentPlace, error: placeError } = usePlace()
  const [metric, setMetric] = useState<TemperatureMetric>('max')

  const city = currentPlace?.city ?? currentPlace?.locality ?? ''
  const { daily, error: forecastError } = useDailyForecast(city)

  const entries = daily ?? []

  const points: TemperaturePoint[] = entries.flatMap((entry) => {
    const max = roundTemperature(entry.values.temperatureMax)
    const avg = roundTemperature(entry.values.temperatureAvg)
    const min = roundTemperature(entry.values.temperatureMin)

    if (max === null || avg === null || min === null) return []

    return [
      {
        label: formatDay(entry.time, { weekday: 'short', day: 'numeric' }),
        max,
        avg,
        min,
      },
    ]
  })

  const warmest = entries.reduce<DailyEntry | null>((best, entry) => {
    const value = entry.values.temperatureMax
    if (value === undefined) return best
    if (!best || (best.values.temperatureMax ?? -Infinity) < value) return entry
    return best
  }, null)

  const coolest = entries.reduce<DailyEntry | null>((best, entry) => {
    const value = entry.values.temperatureMin
    if (value === undefined) return best
    if (!best || (best.values.temperatureMin ?? Infinity) > value) return entry
    return best
  }, null)

  const focusEntry = entries.reduce<DailyEntry | null>((best, entry) => {
    const key = METRIC_KEYS[metric]
    const value = entry.values[key]
    if (value === undefined) return best
    if (!best) return entry
    const bestValue = best.values[key]
    if (bestValue === undefined) return entry
    const isBetter = metric === 'min' ? value < bestValue : value > bestValue
    return isBetter ? entry : best
  }, null)

  const avgValues = entries
    .map((entry) => entry.values.temperatureAvg)
    .filter((value): value is number => value !== undefined && Number.isFinite(value))
  const weeklyAverage = avgValues.length
    ? avgValues.reduce((sum, value) => sum + value, 0) / avgValues.length
    : null

  const summary = [
    {
      icon: 'equalizer',
      label: 'Weekly Average',
      value: weeklyAverage === null ? '—' : `${weeklyAverage.toFixed(1)}°C`,
      tone: 'primary',
    },
    {
      icon: 'wb_sunny',
      label: 'Warmest Day',
      value:
        warmest === null
          ? '—'
          : `${formatDay(warmest.time, { weekday: 'long' })} (${roundTemperature(warmest.values.temperatureMax)}°C)`,
      tone: 'secondary',
    },
    {
      icon: 'mode_night',
      label: 'Coolest Night',
      value:
        coolest === null
          ? '—'
          : `${formatDay(coolest.time, { weekday: 'long' })} (${roundTemperature(coolest.values.temperatureMin)}°C)`,
      tone: 'primary',
    },
  ]

  const focusIndex = focusEntry === null ? -1 : entries.indexOf(focusEntry)
  const calloutLeft =
    focusIndex < 0 || entries.length < 2
      ? 50
      : Math.min(90, Math.max(10, 10 + (focusIndex / (entries.length - 1)) * 80))

  const statusMessage = placeError
    ? 'Location unavailable — cannot load the forecast.'
    : forecastError
      ? 'Forecast unavailable right now.'
      : 'Loading forecast…'

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              7-Day Temperature Forecast
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Daily high, low, and average temperatures
            {city ? ` for ${city}` : ''}
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {METRICS.map((option) => (
            <button
              key={option.key}
              className={
                option.key === metric
                  ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md font-semibold'
                  : 'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'
              }
              onClick={() => setMetric(option.key)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto pt-space-md">
        <div className="min-w-175 relative">
          {focusEntry !== null ? (
            <div
              className="absolute -top-3 -translate-x-1/2 z-20 pointer-events-none transition-transform"
              style={{ left: `${calloutLeft}%` }}
            >
              <div className="flex flex-col gap-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest shadow-xl text-on-surface font-body-sm text-body-sm">
                <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  {formatDay(focusEntry.time, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-3 font-label-md text-label-md">
                  <span>
                    Max:{' '}
                    <strong className="text-on-surface">
                      {roundTemperature(focusEntry.values.temperatureMax)}°C
                    </strong>
                  </span>
                  <span>
                    Min:{' '}
                    <strong className="text-on-surface">
                      {roundTemperature(focusEntry.values.temperatureMin)}°C
                    </strong>
                  </span>
                  <span>
                    Avg:{' '}
                    <strong className="text-primary font-semibold">
                      {roundTemperature(focusEntry.values.temperatureAvg)}°C
                    </strong>
                  </span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 bg-surface-container-lowest rotate-45 mx-auto -mt-1 shadow-sm"></div>
            </div>
          ) : null}

          {points.length > 0 ? (
            <TempGraph data={points} metric={metric} />
          ) : (
            <div className="flex h-64 items-center justify-center font-body-sm text-body-sm text-on-surface-variant">
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-md">
        {summary.map((item) => (
          <div key={item.label} className="flex items-center gap-space-sm p-3.5 rounded-xl bg-surface-container-low">
            <div
              className={`w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm ${
                item.tone === 'secondary' ? 'text-secondary font-bold' : 'text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline font-medium">{item.label}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TemperatureTrend
