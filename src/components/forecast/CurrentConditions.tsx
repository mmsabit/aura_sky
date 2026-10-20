import { useWeatherData } from "../../hooks/useWeatherData";
import { conditionLabel } from "../../lib/weather";

type Metric = {
  label: string
  icon: string
  value: string
  unit?: string
  progress?: number
  headline?: boolean
}

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
]

function windDirectionLabel(degrees?: number) {
  if (degrees === undefined || !Number.isFinite(degrees)) return ''
  return COMPASS_POINTS[Math.round(degrees / 22.5) % 16]
}

function uvSeverity(uv?: number) {
  if (uv === undefined || !Number.isFinite(uv)) return ''
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
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
  const date = observed.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return `Updated ${ago} • ${date}`
}

function CurrentConditions() {
  const { coords, placeLabel, placeError, forecast, forecastError, locationError } =
    useWeatherData();

  const current = forecast?.current ?? null;
  const values = current?.values ?? {};
  const observedAt = current?.time;

  const precipitationIntensity =
    (values.rainIntensity ?? 0) + (values.sleetIntensity ?? 0) + (values.snowIntensity ?? 0);
  const windSpeedKmh =
    values.windSpeed === undefined ? undefined : values.windSpeed * 3.6;
  const windDirection = windDirectionLabel(values.windDirection);
  const uvValue =
    values.uvIndex === undefined
      ? 'UV —'
      : `UV ${Math.round(values.uvIndex)} • ${uvSeverity(values.uvIndex)}`;

  const metrics: Metric[] = [
    {
      label: 'Humidity',
      icon: 'humidity_percentage',
      value: `${formatMetric(values.humidity)}%`,

    },
    {
      label: 'Air Flow',
      icon: 'air',
      value: formatMetric(windSpeedKmh),
      unit: ['km/h', windDirection].filter(Boolean).join(' '),
    },
    {
      label: 'Precipitation',
      icon: 'water_drop',
      value: formatMetric(precipitationIntensity, 1),
      unit: 'mm/h',
    },
    {
      label: 'Rain Chance',
      icon: 'umbrella',
      value: `${formatMetric(values.precipitationProbability)}%`,
    },
    {
      label: 'Pressure',
      icon: 'speed',
      value: formatMetric(values.pressureSeaLevel),
      unit: 'hPa',
    },
    {
      label: 'UV Index',
      icon: 'nest_eco_leaf',
      value: uvValue,
      headline: true,
    },
  ];

  const displayPlace =
    placeLabel || (locationError || placeError ? 'Location unavailable' : 'Locating…');
  const conditionText = forecastError
    ? 'Weather unavailable'
    : current
      ? conditionLabel(values.weatherCode)
      : 'Fetching conditions…';
  const temperature = values.temperature === undefined ? '—' : Math.round(values.temperature);
  const windSummary =
    windSpeedKmh === undefined
      ? 'Wind unavailable'
      : `${Math.round(windSpeedKmh)} km/h ${windDirection}`.trim();

  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-secondary font-label-md text-label-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
              {formatUpdatedAt(observedAt)}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-outline font-label-md text-label-md">
              <span className="material-symbols-outlined text-[14px] text-secondary">explore</span>
              {coords
                ? `${coords.latitude.toFixed(6)}°, ${coords.longitude.toFixed(6)}°`
                : 'Default location'}
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm pt-space-2xs">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              {displayPlace}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-5 relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-linear-to-br from-secondary-container/20 to-transparent blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Live Telemetry
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">
                {conditionText}
              </span>
            </div>
          </div>

          <div className="my-space-xl relative z-10 flex flex-col">
            <div className="flex items-start">
              <span className="font-display-hero text-display-hero font-light text-on-surface tracking-tighter">
                {temperature}
              </span>
              <span className="font-display-hero text-display-hero text-secondary font-light">°C</span>
            </div>
            <div className="flex items-center gap-space-sm mt-1">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Feels like{' '}
                <strong className="text-on-surface font-semibold">
                  {formatTemperature(values.temperatureApparent)}
                </strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-label-md text-label-md text-secondary font-medium">
                {windSummary}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline font-semibold uppercase">
                  {metric.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-secondary-fixed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{metric.icon}</span>
                </div>
              </div>
              <div className="mt-space-md">
                {metric.headline ? (
                  <div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                    {metric.value}
                  </div>
                ) : (
                  <div className="font-data-metric text-data-metric text-on-surface font-semibold tracking-tight">
                    {metric.value}
                    {metric.unit ? (
                      <span className="font-label-md text-label-md font-normal text-on-surface-variant">
                        {' '}
                        {metric.unit}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
              {metric.progress !== undefined ? (
                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden mt-space-sm">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${metric.progress}%` }}
                  ></div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CurrentConditions
