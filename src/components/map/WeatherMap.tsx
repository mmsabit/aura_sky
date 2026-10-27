import { useMemo, useState } from 'react'
import Loading from '../Loading'

type WeatherMapProps = {
  latitude: number
  longitude: number
  placeLabel: string
}

const WINDY_EMBED_URL = 'https://embed.windy.com/embed2.html'

function buildWindyUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    lat: latitude.toFixed(4),
    lon: longitude.toFixed(4),
    detailMode: 'false',
    zoom: '7',
    level: 'surface',
    overlay: 'wind',
    product: 'ecmwf',
    menu: '',
    message: '',
    marker: 'true',
    calendar: 'now',
    pressure: '',
    type: 'map',
    location: 'coordinates',
    detail: '',
    metricWind: 'default',
    metricTemp: 'default',
    radarRange: '-1',
  })

  return `${WINDY_EMBED_URL}?${params.toString()}`
}

function WeatherMap({ latitude, longitude, placeLabel }: WeatherMapProps) {
  const [reloadToken, setReloadToken] = useState(0)
  const [loadedSrc, setLoadedSrc] = useState('')

  const src = useMemo(
    () => buildWindyUrl(latitude, longitude),
    [latitude, longitude],
  )
  const iframeKey = `${src}-${reloadToken}`

  return (
    <section
      aria-labelledby="weather-map-title"
      className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col gap-space-md lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
            Interactive weather map
          </span>
          <h2
            className="font-headline-md text-headline-md text-on-surface"
            id="weather-map-title"
          >
            Wind, rain and temperature
          </h2>
          <p className="max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
            Centered on {placeLabel}. Use the Windy controls in the map to switch
            between wind, rain, temperature, pressure and other layers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-secondary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-container"></span>
            Live
          </span>
          <button
            aria-label="Recenter the map on my current location"
            className="inline-flex items-center gap-1.5 rounded bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            onClick={() => setReloadToken((token) => token + 1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              my_location
            </span>
            Recenter
          </button>
        </div>
      </div>

      <div className="relative z-0 h-96 w-full overflow-hidden rounded-lg bg-surface-container-low sm:h-128 lg:h-162.5">
        {loadedSrc !== iframeKey ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-container-low">
            <Loading compact label="Loading weather map…" />
          </div>
        ) : null}
        <iframe
          allowFullScreen
          className="h-full w-full border-0"
          height="650"
          key={iframeKey}
          loading="lazy"
          onLoad={() => setLoadedSrc(iframeKey)}
          src={src}
          title={`Windy weather map for ${placeLabel}`}
          width="100%"
        />
      </div>

      <p className="font-label-sm text-label-sm text-outline">
        Weather map by{' '}
        <a
          className="text-secondary hover:underline"
          href="https://www.windy.com"
          rel="noreferrer"
          target="_blank"
        >
          Windy.com
        </a>{' '}
        · Forecast model: ECMWF
      </p>
    </section>
  )
}

export default WeatherMap
