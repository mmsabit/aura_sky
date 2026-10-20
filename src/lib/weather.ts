type WeatherCodeInfo = {
  label: string
  icon: string
}

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  1000: { label: 'Clear', icon: 'clear_day' },
  1001: { label: 'Cloudy', icon: 'cloud' },
  1100: { label: 'Mostly Clear', icon: 'partly_cloudy_day' },
  1101: { label: 'Partly Cloudy', icon: 'partly_cloudy_day' },
  1102: { label: 'Mostly Cloudy', icon: 'cloud' },
  2000: { label: 'Fog', icon: 'foggy' },
  2100: { label: 'Light Fog', icon: 'foggy' },
  3000: { label: 'Light Wind', icon: 'air' },
  3001: { label: 'Windy', icon: 'air' },
  3002: { label: 'Strong Wind', icon: 'air' },
  4000: { label: 'Drizzle', icon: 'rainy' },
  4001: { label: 'Rain', icon: 'rainy' },
  4200: { label: 'Light Rain', icon: 'rainy' },
  4201: { label: 'Heavy Rain', icon: 'rainy' },
  5000: { label: 'Snow', icon: 'weather_snowy' },
  5001: { label: 'Flurries', icon: 'weather_snowy' },
  5100: { label: 'Light Snow', icon: 'weather_snowy' },
  5101: { label: 'Heavy Snow', icon: 'weather_snowy' },
  6000: { label: 'Freezing Drizzle', icon: 'ac_unit' },
  6001: { label: 'Freezing Rain', icon: 'ac_unit' },
  6200: { label: 'Light Freezing Rain', icon: 'ac_unit' },
  6201: { label: 'Heavy Freezing Rain', icon: 'ac_unit' },
  7000: { label: 'Ice Pellets', icon: 'ac_unit' },
  7101: { label: 'Heavy Ice Pellets', icon: 'ac_unit' },
  7102: { label: 'Light Ice Pellets', icon: 'ac_unit' },
  8000: { label: 'Thunderstorm', icon: 'thunderstorm' },
}

export function conditionLabel(code?: number) {
  if (code === undefined) return 'Conditions unavailable'
  return WEATHER_CODES[code]?.label ?? 'Unknown conditions'
}

export function weatherIcon(code?: number) {
  if (code === undefined) return 'cloud'
  return WEATHER_CODES[code]?.icon ?? 'cloud'
}
