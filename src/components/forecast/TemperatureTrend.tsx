import { useState } from "react"
import TempGraph, { type TemperatureMetric, type TemperaturePoint } from "./TempGraph"
import Loading from "../Loading"
import { useWeatherData } from "../../hooks/useWeatherData"
import type { HourlyEntry } from "../../lib/weatherApi"

const METRICS: { key: TemperatureMetric; label: string }[] = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'apparent', label: 'Feels like' },
]

const METRIC_KEYS = {
  temperature: 'temperature',
  apparent: 'temperatureApparent',
} as const

function formatDay(iso: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, options)
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function formatHour(iso: string) {
  return `${formatDay(iso, { weekday: 'short' })} ${formatTime(iso)}`
}

function roundTemperature(value?: number) {
  return value === undefined || !Number.isFinite(value) ? null : Math.round(value)
}

function TemperatureTrend() {
  const { city, history, historyError, historyLoading, locationError } = useWeatherData()
  const [metric, setMetric] = useState<TemperatureMetric>('temperature')

  const entries = history ?? []

  const points: TemperaturePoint[] = entries.flatMap((entry) => {
    const temperature = roundTemperature(entry.values.temperature)
    const apparent = roundTemperature(entry.values.temperatureApparent)

    if (temperature === null || apparent === null) return []

    return [
      {
        label: formatTime(entry.time),
        temperature,
        apparent,
      },
    ]
  })

  const warmest = entries.reduce<HourlyEntry | null>((best, entry) => {
    const value = entry.values.temperature
    if (value === undefined) return best
    if (!best || (best.values.temperature ?? -Infinity) < value) return entry
    return best
  }, null)

  const coolest = entries.reduce<HourlyEntry | null>((best, entry) => {
    const value = entry.values.temperature
    if (value === undefined) return best
    if (!best || (best.values.temperature ?? Infinity) > value) return entry
    return best
  }, null)

  const focusEntry = entries.reduce<HourlyEntry | null>((best, entry) => {
    const key = METRIC_KEYS[metric]
    const value = entry.values[key]
    if (value === undefined) return best
    if (!best) return entry
    const bestValue = best.values[key]
    if (bestValue === undefined) return entry
    return value > bestValue ? entry : best
  }, null)

  const temperatureValues = entries
    .map((entry) => entry.values.temperature)
    .filter((value): value is number => value !== undefined && Number.isFinite(value))
  const averageTemperature = temperatureValues.length
    ? temperatureValues.reduce((sum, value) => sum + value, 0) / temperatureValues.length
    : null

  const summary = [
    {
      icon: 'equalizer',
      label: '24h Average',
      value: averageTemperature === null ? '—' : `${averageTemperature.toFixed(1)}°C`,
      tone: 'primary',
    },
    {
      icon: 'wb_sunny',
      label: 'Warmest Reading',
      value:
        warmest === null
          ? '—'
          : `${formatHour(warmest.time)} (${roundTemperature(warmest.values.temperature)}°C)`,
      tone: 'secondary',
    },
    {
      icon: 'mode_night',
      label: 'Coolest Reading',
      value:
        coolest === null
          ? '—'
          : `${formatHour(coolest.time)} (${roundTemperature(coolest.values.temperature)}°C)`,
      tone: 'primary',
    },
  ]

  const focusIndex = focusEntry === null ? -1 : entries.indexOf(focusEntry)
  const calloutLeft =
    focusIndex < 0 || entries.length < 2
      ? 50
      : Math.min(90, Math.max(10, 10 + (focusIndex / (entries.length - 1)) * 80))

  const statusMessage = locationError
    ? 'Location unavailable — cannot load the history.'
    : historyError
      ? 'Temperature history unavailable right now.'
      : 'No temperature history available.'

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Past 24 Hours Temperature History
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Hourly observed temperature and feels-like readings
            {city ? ` for ${city}` : ''}
          </p>
        </div>
        <div className="inline-flex shrink-0 p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {METRICS.map((option) => (
            <button
              key={option.key}
              className={
                option.key === metric
                  ? 'shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md font-semibold'
                  : 'shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'
              }
              onClick={() => setMetric(option.key)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full pt-space-md">
        {focusEntry !== null ? (
          <div
            className="pointer-events-none z-20 mb-space-sm w-fit max-w-full md:absolute md:-top-3 md:mb-0 md:max-w-none md:-translate-x-1/2"
            style={{ left: `clamp(8.5rem, ${calloutLeft}%, calc(100% - 8.5rem))` }}
          >
            <div className="flex flex-col gap-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest shadow-xl text-on-surface font-body-sm text-body-sm">
              <div className="flex flex-wrap items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                {formatDay(focusEntry.time, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                · {formatTime(focusEntry.time)}
              </div>
              <div className="flex items-center gap-3 font-label-md text-label-md">
                <span>
                  Temp:{' '}
                  <strong className="text-on-surface">
                    {roundTemperature(focusEntry.values.temperature)}°C
                  </strong>
                </span>
                <span>
                  Feels:{' '}
                  <strong className="text-primary font-semibold">
                    {roundTemperature(focusEntry.values.temperatureApparent)}°C
                  </strong>
                </span>
              </div>
            </div>
            <div className="hidden md:block w-2.5 h-2.5 bg-surface-container-lowest rotate-45 mx-auto -mt-1 shadow-sm"></div>
          </div>
        ) : null}

        <div className="h-64 sm:h-72 lg:h-80">
          {points.length > 0 ? (
            <TempGraph data={points} metric={metric} />
          ) : historyLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loading compact label="Loading temperature history…" />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center font-body-sm text-body-sm text-on-surface-variant">
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
