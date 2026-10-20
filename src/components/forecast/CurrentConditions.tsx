import { useGeolocated } from "react-geolocated";

type Metric = {
  label: string
  icon: string
  value: string
  unit?: string
  progress?: number
  headline?: boolean
}

const metrics: Metric[] = [
  { label: 'Humidity', icon: 'humidity_percentage', value: '68%', progress: 68 },
  { label: 'Air Flow', icon: 'air', value: '14', unit: 'km/h NW' },
  { label: 'Precipitation', icon: 'water_drop', value: '0.0', unit: 'mm', progress: 2 },
  { label: 'Rain Chance', icon: 'umbrella', value: '15%' },
  { label: 'Snowfall Prob.', icon: 'ac_unit', value: '0%' },
  {
    label: 'UV & Air Quality',
    icon: 'nest_eco_leaf',
    value: 'UV 4 • AQI 28',
    headline: true,
  },
]

function CurrentConditions() {
  const {coords} = useGeolocated({});
  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-secondary font-label-md text-label-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
              Updated 2 mins ago • Sunday, Oct 19
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-outline font-label-md text-label-md">
              <span className="material-symbols-outlined text-[14px] text-secondary">explore</span>
              {coords?.latitude}° N, {coords?.longitude}° W
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm pt-space-2xs">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              San Francisco, California
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md text-primary font-headline-sm text-headline-sm transition-all duration-200"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:rotate-45 transition-transform duration-300">
              near_me
            </span>
            <span>Change Location</span>
          </button>
          <button
            aria-label="Refresh telemetry"
            className="p-2.5 rounded-xl bg-surface-container-lowest shadow-sm text-on-surface-variant hover:text-primary transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">autorenew</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-5 relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-secondary-container/20 to-transparent blur-2xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Live Telemetry
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">
                Coastal Marine Layer
              </span>
            </div>
          </div>

          <div className="my-space-xl relative z-10 flex flex-col">
            <div className="flex items-start">
              <span className="font-display-hero text-display-hero font-light text-on-surface tracking-tighter">
                18
              </span>
              <span className="font-display-hero text-display-hero text-secondary font-light">°C</span>
            </div>
            <div className="flex items-center gap-space-sm mt-1">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Feels like <strong className="text-on-surface font-semibold">17°C</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-label-md text-label-md text-secondary font-medium">
                Partly Cloudy &amp; Fresh Breeze
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
