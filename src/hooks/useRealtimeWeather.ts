import { useEffect, useState } from 'react'
import { fetchRealtime, type RealtimeData } from '../lib/weatherApi'

type RealtimeState = {
  location: string
  data: RealtimeData | null
  error: boolean
}

type RealtimeResult = {
  data: RealtimeData | null
  isLoading: boolean
  error: boolean
}

const EMPTY_STATE: RealtimeState = { location: '', data: null, error: false }

/**
 * Loads current conditions for a `"latitude,longitude"` location key.
 * Pass an empty string to skip the request. State is tagged with the location
 * it came from so switching results doesn't show stale readings.
 */
export function useRealtimeWeather(location: string): RealtimeResult {
  const [state, setState] = useState<RealtimeState>(EMPTY_STATE)

  useEffect(() => {
    if (!location) return

    let active = true

    fetchRealtime(location)
      .then((realtime) => {
        if (!active) return
        setState({ location, data: realtime, error: false })
      })
      .catch((reason) => {
        if (!active) return
        console.error(reason)
        setState({ location, data: null, error: true })
      })

    return () => {
      active = false
    }
  }, [location])

  const isStale = state.location !== location

  return {
    data: location && !isStale ? state.data : null,
    isLoading: Boolean(location) && isStale,
    error: Boolean(location) && !isStale && state.error,
  }
}
