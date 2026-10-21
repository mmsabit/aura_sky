import { useState } from 'react'
import LocationSearch from '../components/search/LocationSearch'
import { useSearchQuery } from '../hooks/useRoute'
import { useLocationSearch } from '../hooks/useLocationSearch'
import { useRealtimeWeather } from '../hooks/useRealtimeWeather'
import {
  formatCoordinates,
  formatPlaceLabel,
  type GeoResult,
} from '../lib/geocoding'
import {
  conditionLabel,
  uvSeverity,
  weatherIcon,
  windDirectionLabel,
} from '../lib/weather'

const POPULAR_PLACES = ['Toronto', 'London', 'Tokyo', 'New York', 'Sydney', 'Dubai']

type DetailMetric = {
  label: string
  icon: string
  value: string
  hint?: string
}

function formatMetric(value: number | undefined, digits = 0) {
  return value === undefined || !Number.isFinite(value) ? '—' : value.toFixed(digits)
}

function formatTemperature(value?: number) {
  return value === undefined || !Number.isFinite(value) ? '—' : `${Math.round(value)}°C`
}

function formatUpdatedAt(iso?: string) {
  if (!iso) return 'Awaiting telemetry'

  const observed = new Date(iso)
  if (Number.isNaN(observed.getTime())) return 'Awaiting telemetry'

  const minutes = Math.max(0, Math.round((Date.now() - observed.getTime()) / 60000))
  const ago = minutes < 1 ? 'just now' : `${minutes} min${minutes === 1 ? '' : 's'} ago`
  return `Updated ${ago}`
}

function formatLocalTime(timezone?: string) {
  if (!timezone) return ''

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date())
  } catch {
    return ''
  }
}

function PopularPlaces() {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
          Try a popular city
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Pick a place to see its live conditions, or search for any city above.
        </p>
      </div>
      <div className="flex flex-wrap gap-space-xs">
        {POPULAR_PLACES.map((place) => (
          <a
            key={place}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-space-md py-2 font-label-md text-label-md font-semibold text-secondary transition-colors hover:bg-secondary-fixed"
            href={`/search?q=${encodeURIComponent(place)}`}
          >
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {place}
          </a>
        ))}
      </div>
    </section>
  )
}

type ResultCardProps = {
  isSelected: boolean
  place: GeoResult
  onSelect: () => void
}

function ResultCard({ isSelected, place, onSelect }: ResultCardProps) {
  const localTime = formatLocalTime(place.timezone)

  return (
    <button
      aria-pressed={isSelected}
      className={
        isSelected
          ? 'w-full rounded-xl border border-secondary bg-secondary-fixed/40 p-space-md text-left shadow-sm transition-all'
          : 'w-full rounded-xl border border-transparent bg-surface-container-lowest p-space-md text-left shadow-sm transition-all hover:border-secondary/40 hover:shadow-md'
      }
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-headline-sm text-headline-sm text-on-surface">
            {place.name}
          </span>
          <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
            {formatPlaceLabel(place) || 'Location'}
          </span>
        </div>
        <span
          className={
            isSelected
              ? 'material-symbols-outlined shrink-0 text-[18px] text-secondary'
              : 'material-symbols-outlined shrink-0 text-[18px] text-outline'
          }
        >
          {isSelected ? 'check_circle' : 'chevron_right'}
        </span>
      </div>

      <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 font-label-md text-label-md text-outline">
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">explore</span>
          {formatCoordinates(place.latitude, place.longitude)}
        </span>
        {localTime ? (
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {localTime} local
          </span>
        ) : null}
      </div>
    </button>
  )
}

function SearchResults() {
  const query = useSearchQuery()
  const { results, isLoading, error } = useLocationSearch(query)
  const [selection, setSelection] = useState<{ query: string; id: number | null }>({
    query: '',
    id: null,
  })

  // A new query means a new result list; fall back to the best match.
  const selectedId = selection.query === query ? selection.id : null
  const selected =
    results.find((place) => place.id === selectedId) ?? results[0] ?? null
  const realtimeLocation = selected
    ? `${selected.latitude},${selected.longitude}`
    : ''
  const {
    data: realtime,
    isLoading: realtimeLoading,
    error: realtimeError,
  } = useRealtimeWeather(realtimeLocation)

  const values = realtime?.values ?? {}
  const precipitationIntensity =
    (values.rainIntensity ?? 0) + (values.sleetIntensity ?? 0) + (values.snowIntensity ?? 0)
  const windSpeedKmh =
    values.windSpeed === undefined ? undefined : values.windSpeed * 3.6
  const selectedLocalTime = selected ? formatLocalTime(selected.timezone) : ''

  const metrics: DetailMetric[] = [
    {
      label: 'Feels like',
      icon: 'thermostat',
      value: formatTemperature(values.temperatureApparent),
    },
    {
      label: 'Humidity',
      icon: 'humidity_percentage',
      value: `${formatMetric(values.humidity)}%`,
    },
    {
      label: 'Wind',
      icon: 'air',
      value: `${formatMetric(windSpeedKmh)} km/h`,
      hint: windDirectionLabel(values.windDirection),
    },
    {
      label: 'Precipitation',
      icon: 'water_drop',
      value: `${formatMetric(precipitationIntensity, 1)} mm/h`,
    },
    {
      label: 'Rain chance',
      icon: 'umbrella',
      value: `${formatMetric(values.precipitationProbability)}%`,
    },
    {
      label: 'Pressure',
      icon: 'speed',
      value: `${formatMetric(values.pressureSeaLevel)} hPa`,
    },
    {
      label: 'UV index',
      icon: 'nest_eco_leaf',
      value:
        values.uvIndex === undefined
          ? '—'
          : `${Math.round(values.uvIndex)} • ${uvSeverity(values.uvIndex)}`,
    },
    {
      label: 'Cloud cover',
      icon: 'cloud',
      value: `${formatMetric(values.cloudCover)}%`,
    },
    {
      label: 'Visibility',
      icon: 'visibility',
      value: `${formatMetric(values.visibility, 1)} km`,
    },
  ]

  return (
    <main className="w-full flex-1 bg-background pt-20">
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-130 w-130 rounded-full bg-secondary-container/15 blur-3xl"></div>
        <div className="pointer-events-none absolute top-96 -left-20 h-120 w-120 rounded-full bg-secondary-fixed/40 blur-3xl"></div>

        <div className="relative mx-auto flex w-full max-w-340 flex-col gap-space-2xl px-margin py-space-xl md:px-margin-tablet lg:px-margin-desktop lg:py-space-2xl">
          <section className="flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-secondary">
                <span className="material-symbols-outlined text-[14px]">travel_explore</span>
                Location results
              </span>
              <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
                {query ? (
                  <>
                    Live weather for <span className="text-secondary">“{query}”</span>
                  </>
                ) : (
                  'Search any location'
                )}
              </h1>
              <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                {query
                  ? 'Pick a matching place to see its detailed current conditions, or refine your search above.'
                  : 'Type a city, town or region to see detailed live conditions for that place.'}
              </p>
            </div>

            <div className="max-w-2xl">
              <LocationSearch autoFocus={!query} variant="page" />
            </div>
          </section>

          {!query ? <PopularPlaces /> : null}

          {query && isLoading ? (
            <section className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary"></span>
                <span className="font-body-md text-body-md">
                  Searching for “{query}”…
                </span>
              </div>
            </section>
          ) : null}

          {query && !isLoading && error ? (
            <section className="rounded-xl bg-error-container p-space-xl shadow-sm">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-error">error</span>
                <div className="flex flex-col gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-error-container">
                    Location search unavailable
                  </span>
                  <p className="font-body-md text-body-md text-on-error-container">
                    We couldn’t look up “{query}” right now. Check your connection and try
                    again in a moment.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {query && !isLoading && !error && results.length === 0 ? (
            <section className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-outline">search_off</span>
                <div className="flex flex-col gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    No places found for “{query}”
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Check the spelling, add a country (e.g. “Paris, France”), or try a
                    nearby larger city.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {query && !isLoading && !error && results.length > 0 ? (
            <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
              <section className="flex flex-col gap-space-md lg:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Matching places
                  </h2>
                  <span className="rounded-full bg-surface-container-low px-space-sm py-1 font-label-md text-label-md text-outline">
                    {results.length}
                  </span>
                </div>
                <div className="flex flex-col gap-space-sm">
                  {results.map((place) => (
                    <ResultCard
                      isSelected={selected?.id === place.id}
                      key={place.id}
                      onSelect={() => setSelection({ query, id: place.id })}
                      place={place}
                    />
                  ))}
                </div>
              </section>

              <section className="lg:col-span-8">
                {selected ? (
                  <div className="relative flex flex-col gap-space-xl overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-linear-to-br from-secondary-container/20 to-transparent blur-2xl"></div>

                    <div className="relative z-10 flex flex-col justify-between gap-space-sm sm:flex-row sm:items-start">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                          Current conditions
                        </span>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                          {selected.name}
                        </h2>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {[formatPlaceLabel(selected), selected.timezone]
                            .filter(Boolean)
                            .join(' • ') || 'Location'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-label-md text-label-md text-outline">
                          <span className="material-symbols-outlined text-[14px]">
                            explore
                          </span>
                          {formatCoordinates(selected.latitude, selected.longitude)}
                        </span>
                      </div>

                      <div className="flex flex-col items-start gap-1 sm:items-end">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-secondary">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-container"></span>
                          {realtimeLoading ? 'Fetching live data…' : formatUpdatedAt(realtime?.time)}
                        </span>
                        {selectedLocalTime ? (
                          <span className="font-label-md text-label-md text-outline">
                            {selectedLocalTime} local time
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {realtimeError ? (
                      <div className="relative z-10 flex items-start gap-space-sm rounded-xl bg-error-container p-space-md">
                        <span className="material-symbols-outlined text-error">error</span>
                        <div className="flex flex-col gap-1">
                          <span className="font-headline-sm text-headline-sm text-on-error-container">
                            Live conditions unavailable
                          </span>
                          <p className="font-body-md text-body-md text-on-error-container">
                            Tomorrow.io didn’t return a reading for this place. It may be
                            temporarily rate limited — try again in a minute or choose
                            another match.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {!realtimeError ? (
                      <>
                        <div className="relative z-10 flex flex-wrap items-center gap-space-lg">
                          <div className="flex items-center gap-space-md">
                            <span className="material-symbols-outlined text-[56px] text-secondary">
                              {weatherIcon(values.weatherCode)}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-display-hero text-display-hero font-light leading-none tracking-tighter text-on-surface">
                                {values.temperature === undefined
                                  ? '—'
                                  : Math.round(values.temperature)}
                              </span>
                              <span className="font-body-md text-body-md text-on-surface-variant">
                                °C
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-headline-md text-headline-md text-on-surface">
                              {realtimeLoading
                                ? 'Loading conditions…'
                                : conditionLabel(values.weatherCode)}
                            </span>
                            <span className="font-body-md text-body-md text-on-surface-variant">
                              Feels like{' '}
                              <strong className="font-semibold text-on-surface">
                                {formatTemperature(values.temperatureApparent)}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-3">
                          {metrics.map((metric) => (
                            <div
                              className="flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md"
                              key={metric.label}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                                  {metric.label}
                                </span>
                                <span className="material-symbols-outlined text-[18px] text-secondary">
                                  {metric.icon}
                                </span>
                              </div>
                              <div className="mt-space-sm">
                                <span className="font-data-metric text-data-metric font-semibold tracking-tight text-on-surface">
                                  {metric.value}
                                </span>
                                {metric.hint ? (
                                  <span className="ml-1 font-label-md text-label-md text-on-surface-variant">
                                    {metric.hint}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}

                    <span className="relative z-10 font-label-md text-label-md text-outline">
                      Live reading from Tomorrow.io • Location search by Open-Meteo
                    </span>
                  </div>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default SearchResults
