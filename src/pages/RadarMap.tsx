import WeatherMap from '../components/map/WeatherMap'
import { useCurrentLocation } from '../hooks/useCurrentLocation'

const FALLBACK_CENTER = { latitude: 40.7128, longitude: -74.006 }

function RadarMap() {
  const { coords, placeLabel, placeError, locationError } = useCurrentLocation()

  const displayPlace =
    placeLabel ||
    (locationError || placeError ? 'Location unavailable' : 'Locating…')
  const center = coords ?? FALLBACK_CENTER

  return (
    <main className="w-full flex-1 bg-background pt-20">
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-130 w-130 rounded-full bg-secondary-container/15 blur-3xl"></div>
        <div className="pointer-events-none absolute top-96 -left-20 h-120 w-120 rounded-full bg-secondary-fixed/40 blur-3xl"></div>

        <div className="relative mx-auto flex w-full max-w-340 flex-col gap-space-2xl px-margin py-space-xl md:px-margin-tablet lg:px-margin-desktop lg:py-space-2xl">
          <section className="flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-secondary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-container"></span>
                Live weather map
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-lowest px-3 py-1 font-label-md text-label-md text-outline shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  explore
                </span>
                {coords
                  ? `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`
                  : 'New York, NY'}
              </span>
            </div>

            <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
              <div className="flex flex-col gap-space-xs">
                <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
                  Radar &amp; Map
                </h1>
                <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                  Explore live wind, rain, temperature and pressure layers for{' '}
                  <strong className="font-semibold text-on-surface">
                    {displayPlace}
                  </strong>
                  . The map opens at your current location.
                </p>
              </div>

              <div className="flex flex-col items-start gap-0.5 rounded-xl bg-surface-container-lowest px-space-md py-space-sm shadow-sm lg:items-end">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                  Map center
                </span>
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {displayPlace}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {coords
                    ? `${coords.latitude.toFixed(6)}°, ${coords.longitude.toFixed(6)}°`
                    : 'Fallback location'}
                </span>
              </div>
            </div>
          </section>

          <WeatherMap
            latitude={center.latitude}
            longitude={center.longitude}
            placeLabel={displayPlace}
          />
        </div>
      </div>
    </main>
  )
}

export default RadarMap
