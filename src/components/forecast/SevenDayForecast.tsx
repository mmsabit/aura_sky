type ForecastDay = {
  day: string
  icon: string
  high: number
  low: number
  condition: string
  precipChance?: number
  highlight?: boolean
  wideOnMobile?: boolean
}

const forecast: ForecastDay[] = [
  {
    day: 'Mon, Oct 20',
    icon: 'partly_cloudy_day',
    high: 19,
    low: 12,
    condition: 'Sun & Cloud',
  },
  { day: 'Tue, Oct 21', icon: 'wb_sunny', high: 21, low: 13, condition: 'Clear Sunny' },
  { day: 'Wed, Oct 22', icon: 'clear_day', high: 23, low: 14, condition: 'Crisp Clear' },
  {
    day: 'Thu, Oct 23',
    icon: 'rainy',
    high: 17,
    low: 12,
    condition: 'Scattered Rain',
    precipChance: 40,
    highlight: true,
  },
  { day: 'Fri, Oct 24', icon: 'filter_drama', high: 18, low: 11, condition: 'Partly Cloudy' },
  { day: 'Sat, Oct 25', icon: 'sunny', high: 20, low: 13, condition: 'Mild Sunny' },
  {
    day: 'Sun, Oct 26',
    icon: 'wb_sunny',
    high: 22,
    low: 14,
    condition: 'Clear Horizon',
    wideOnMobile: true,
  },
]

function SevenDayForecast() {
  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">calendar_view_week</span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
            7-Day Forward Extended Horizon
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline font-medium hidden sm:inline-block">
          High-resolution ensemble model forecast
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-space-md">
        {forecast.map((day) => (
          <div
            key={day.day}
            className={`p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center justify-between gap-space-sm ${
              day.highlight ? 'relative overflow-hidden' : ''
            } ${day.wideOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}
          >
            {day.precipChance ? (
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
    </section>
  )
}

export default SevenDayForecast
