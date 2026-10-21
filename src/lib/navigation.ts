const NAVIGATION_EVENT = 'aura-sky:navigate'

/**
 * Client-side navigation that keeps real URLs (no `#` fragments).
 * Pushes a new history entry and notifies subscribed route hooks.
 */
export function navigate(path: string) {
  const current = `${window.location.pathname}${window.location.search}`
  if (path === current) return

  window.history.pushState({}, '', path)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

/** Re-runs `listener` on back/forward and on programmatic `navigate` calls. */
export function subscribeToNavigation(listener: () => void) {
  window.addEventListener('popstate', listener)
  window.addEventListener(NAVIGATION_EVENT, listener)

  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener(NAVIGATION_EVENT, listener)
  }
}
