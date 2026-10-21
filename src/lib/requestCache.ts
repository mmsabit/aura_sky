const DEFAULT_TTL_MS = 5 * 60 * 1000

type StoredEntry<T> = {
  key: string
  timestamp: number
  data: T
}

type CacheEntry<T> = {
  request: Promise<T>
  timestamp: number
}

/**
 * Creates a request cache that:
 * - dedupes concurrent calls for the same key,
 * - keeps successful responses for `ttlMs`,
 * - survives page reloads within the same browser session (sessionStorage).
 *
 * Use one instance per resource, not per hook/component.
 */
export function createCachedRequest<T>(
  name: string,
  ttlMs = DEFAULT_TTL_MS,
) {
  const entries = new Map<string, CacheEntry<T>>()
  const storageKey = `aura-sky:${name}`

  const readStored = (key: string): StoredEntry<T> | null => {
    if (typeof window === 'undefined') return null

    try {
      const raw = window.sessionStorage.getItem(storageKey)
      if (!raw) return null

      const parsed = JSON.parse(raw) as Partial<StoredEntry<T>>
      if (
        parsed.key !== key ||
        typeof parsed.timestamp !== 'number' ||
        parsed.data === undefined
      ) {
        return null
      }

      if (Date.now() - parsed.timestamp >= ttlMs) {
        window.sessionStorage.removeItem(storageKey)
        return null
      }

      return parsed as StoredEntry<T>
    } catch {
      return null
    }
  }

  const writeStored = (key: string, data: T) => {
    if (typeof window === 'undefined') return

    try {
      window.sessionStorage.setItem(
        storageKey,
        JSON.stringify({ key, timestamp: Date.now(), data }),
      )
    } catch {
      // Ignore quota and privacy-mode errors; the in-memory cache still works.
    }
  }

  return function cachedRequest(
    key: string,
    load: () => Promise<T>,
  ): Promise<T> {
    const cached = entries.get(key)
    if (cached && Date.now() - cached.timestamp < ttlMs) {
      return cached.request
    }

    const stored = readStored(key)
    if (stored) {
      const request = Promise.resolve(stored.data)
      entries.set(key, { request, timestamp: stored.timestamp })
      return request
    }

    const request = load().then((data) => {
      writeStored(key, data)
      return data
    })

    entries.set(key, { request, timestamp: Date.now() })
    request.catch(() => {
      if (entries.get(key)?.request === request) entries.delete(key)
    })

    return request
  }
}
