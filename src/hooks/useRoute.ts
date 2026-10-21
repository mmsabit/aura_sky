import { useEffect, useState } from 'react'
import { navigate, subscribeToNavigation } from '../lib/navigation'

export type Route = 'forecast' | 'radar-and-map' | 'search'

const DEFAULT_ROUTE: Route = 'forecast'

function readRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/radar-and-map') return 'radar-and-map'
  if (path === '/search') return 'search'
  return DEFAULT_ROUTE
}

function readSearchQuery() {
  if (readRoute() !== 'search') return ''

  return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
}

/**
 * Resolves the current route from the pathname (`/forecast`, `/radar-and-map`,
 * `/search`) and keeps it in sync with history navigation.
 *
 * Internal links use real paths and are intercepted below, so clicks stay
 * client-side while the address bar shows a clean URL without hashes.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const handleNavigation = () => setRoute(readRoute())
    const unsubscribe = subscribeToNavigation(handleNavigation)

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return

      event.preventDefault()
      navigate(href)
    }

    document.addEventListener('click', handleClick)

    return () => {
      unsubscribe()
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return route
}

/** Reads the `q` value from `/search?q=...` and keeps it in sync with history. */
export function useSearchQuery() {
  const [query, setQuery] = useState(readSearchQuery)

  useEffect(() => {
    const handleNavigation = () => setQuery(readSearchQuery())
    return subscribeToNavigation(handleNavigation)
  }, [])

  return query
}
