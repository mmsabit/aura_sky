import { useEffect, useState } from 'react'

export type Route = 'forecast' | 'radar-and-map'

const DEFAULT_ROUTE: Route = 'forecast'

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [path] = raw.split(/[/?]/)
  return path === 'radar-and-map' ? 'radar-and-map' : DEFAULT_ROUTE
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}
