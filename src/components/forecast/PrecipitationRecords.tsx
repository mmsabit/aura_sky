import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from "recharts"
import { useWeatherData } from "../../hooks/useWeatherData"
import type { DailyEntry } from "../../lib/weatherApi"

type View = 'rain' | 'snow' | 'combined'

type ChartPoint = {
  label: string
  rain: number
  snow: number
}

const VIEWS: { key: View; label: string }[] = [
  { key: 'rain', label: 'Rainfall (mm)' },
  { key: 'snow', label: 'Snowfall (mm)' },
  { key: 'combined', label: 'Combined View' },
]

const MEASURABLE_RAIN_MM = 0.2

function formatDay(iso: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { ...options, timeZone: 'UTC' })
}

function round1(value?: number) {
  return value === undefined || !Number.isFinite(value) ? 0 : Math.round(value * 10) / 10
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function findLongestDryStreak(entries: DailyEntry[]) {
  let longest = { length: 0, start: '', end: '' }
  let current = { length: 0, start: '' }

  entries.forEach((entry) => {
    if (round1(entry.values.rainAccumulationSum) >= MEASURABLE_RAIN_MM) {
      current = { length: 0, start: '' }
      return
    }

    if (current.length === 0) current.start = entry.time
    current.length += 1

    if (current.length > longest.length) {
      longest = { length: current.length, start: current.start, end: entry.time }
    }
  })

  return longest
}

function PrecipitationRecords() {
  const { city, forecast, forecastError, locationError } = useWeatherData()
  const [view, setView] = useState<View>('rain')

  const entries = forecast?.daily ?? []
  const hasData = entries.length > 0

  const points: ChartPoint[] = entries.map((entry) => ({
    label: formatDay(entry.time, { weekday: 'short', day: 'numeric' }),
    rain: round1(entry.values.rainAccumulationSum),
    snow: round1(entry.values.snowAccumulationSum),
  }))

  const totalRain = round1(sum(points.map((point) => point.rain)))
  const totalSnow = round1(sum(points.map((point) => point.snow)))
  const rainDays = points.filter((point) => point.rain >= MEASURABLE_RAIN_MM).length
  const dryStreak = findLongestDryStreak(entries)

  const wettestIndex = points.reduce(
    (best, point, index) => (point.rain > points[best].rain ? index : best),
    0,
  )
  const wettest = points.length > 0 ? points[wettestIndex] : null
  const wettestProbability = wettest
    ? Math.round(entries[wettestIndex].values.precipitationProbabilityMax ?? 0)
    : 0
  const wettestLabel = wettest
    ? formatDay(entries[wettestIndex].time, { weekday: 'long', month: 'short', day: 'numeric' })
    : ''

  const rainDayLabel = `${rainDays} ${rainDays === 1 ? 'Day' : 'Days'}`
  const dryStreakLabel = `${dryStreak.length} ${dryStreak.length === 1 ? 'Day' : 'Days'}`
  const dryStreakNote =
    dryStreak.length > 0
      ? `${formatDay(dryStreak.start, { month: 'short', day: 'numeric' })} – ${formatDay(dryStreak.end, { month: 'short', day: 'numeric' })}`
      : 'No dry days in outlook'

  const stats = [
    {
      label: 'Total Rainfall',
      value: hasData ? `${totalRain.toFixed(1)} mm` : '—',
      note: hasData
        ? `${rainDays} of ${points.length} days with measurable rain`
        : 'Waiting for forecast',
      noteClass:
        hasData && rainDays > 0 ? 'text-primary font-semibold' : 'text-on-surface-variant font-medium',
    },
    {
      label: 'Measurable Rain Days',
      value: hasData ? rainDayLabel : '—',
      note: hasData ? 'At least 0.2 mm per day' : 'Waiting for forecast',
      noteClass: 'text-on-surface-variant font-medium',
    },
    {
      label: 'Snowfall Recorded',
      value: hasData ? `${totalSnow.toFixed(1)} mm` : '—',
      note:
        hasData && totalSnow > 0
          ? 'Accumulated over the outlook'
          : 'No snow in this outlook',
      noteClass: 'text-on-surface-variant font-medium',
    },
    {
      label: 'Longest Dry Streak',
      value: hasData ? dryStreakLabel : '—',
      note: hasData ? dryStreakNote : 'Waiting for forecast',
      noteClass: 'text-secondary font-medium',
    },
  ]

  const statusMessage = locationError
    ? 'Location unavailable — cannot load precipitation data.'
    : forecastError
      ? 'Precipitation forecast unavailable right now.'
      : 'Loading precipitation outlook…'

  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">cloud_sync</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              7-Day Precipitation Outlook
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Daily rainfall and snowfall accumulation
            {city ? ` for ${city}` : ''}
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {VIEWS.map((option) => (
            <button
              key={option.key}
              className={
                option.key === view
                  ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md font-semibold'
                  : 'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'
              }
              onClick={() => setView(option.key)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-space-sm p-3 rounded-lg bg-surface-container-low text-secondary font-body-sm text-body-sm">
        <span className="material-symbols-outlined text-[18px]">info</span>
        {!hasData ? (
          <span>{statusMessage}</span>
        ) : wettest && wettest.rain >= MEASURABLE_RAIN_MM ? (
          <span>
            Wettest day in this outlook: <strong>{wettestLabel}</strong> with{' '}
            {wettest.rain.toFixed(1)} mm of rain ({wettestProbability}% chance).
          </span>
        ) : (
          <span>
            No measurable precipitation is projected over the next {points.length} days.
          </span>
        )}
      </div>

      <div className="relative w-full overflow-x-auto pt-space-xs">
        <div className="min-w-170">
          {hasData ? (
            <BarChart
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '70vh',
                aspectRatio: 2.4,
              }}
              responsive
              data={points}
              margin={{ top: 8, right: 12, left: 0, bottom: 5 }}
              barCategoryGap="28%"
            >
              <CartesianGrid stroke="#e2e7ff" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#707881' }}
              />
              <YAxis
                width="auto"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#707881' }}
                unit=" mm"
                tickFormatter={(value) => `${Math.round(Number(value) * 10) / 10}`}
              />
              <Tooltip
                cursor={{ fill: '#f2f3ff' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e7ff',
                  fontSize: 12,
                }}
              />
              {view === 'rain' ? (
                <Bar
                  dataKey="rain"
                  name="Rainfall"
                  unit=" mm"
                  fill="#006194"
                  radius={[6, 6, 0, 0]}
                  animationDuration={900}
                  animationMatchBy={matchByDataKey('label')}
                />
              ) : null}
              {view === 'snow' ? (
                <Bar
                  dataKey="snow"
                  name="Snowfall"
                  unit=" mm"
                  fill="#40c2fd"
                  radius={[6, 6, 0, 0]}
                  animationDuration={900}
                  animationMatchBy={matchByDataKey('label')}
                />
              ) : null}
              {view === 'combined' ? (
                <>
                  <Bar
                    dataKey="rain"
                    name="Rainfall"
                    unit=" mm"
                    stackId="combined"
                    fill="#006194"
                    radius={[6, 6, 0, 0]}
                    animationDuration={900}
                    animationMatchBy={matchByDataKey('label')}
                  />
                  <Bar
                    dataKey="snow"
                    name="Snowfall"
                    unit=" mm"
                    stackId="combined"
                    fill="#40c2fd"
                    radius={[6, 6, 0, 0]}
                    animationDuration={900}
                    animationMatchBy={matchByDataKey('label')}
                  />
                </>
              ) : null}
            </BarChart>
          ) : (
            <div className="flex h-64 items-center justify-center font-body-sm text-body-sm text-on-surface-variant">
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-outline font-medium">{stat.label}</span>
            <div className="my-1">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{stat.value}</span>
            </div>
            <span className={`font-label-sm text-label-sm ${stat.noteClass}`}>{stat.note}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PrecipitationRecords
