import { loadEnv } from 'vite'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'
import type { ServerResponse } from 'node:http'

type ApiKeyName = 'WEATHER_API' | 'GEO_API_KEY'

type RouteConfig = {
  upstream: string
  key: ApiKeyName
  keyParam: string
}

const ROUTES: Record<string, RouteConfig> = {
  '/api/weather/forecast': {
    upstream: 'https://api.tomorrow.io/v4/weather/forecast',
    key: 'WEATHER_API',
    keyParam: 'apikey',
  },
  '/api/weather/history': {
    upstream: 'https://api.tomorrow.io/v4/weather/history/recent',
    key: 'WEATHER_API',
    keyParam: 'apikey',
  },
  '/api/weather/realtime': {
    upstream: 'https://api.tomorrow.io/v4/weather/realtime',
    key: 'WEATHER_API',
    keyParam: 'apikey',
  },
  '/api/geo/reverse-geocode': {
    upstream: 'https://api-bdc.net/data/reverse-geocode',
    key: 'GEO_API_KEY',
    keyParam: 'key',
  },
}

const UPSTREAM_TIMEOUT_MS = 15_000

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

/**
 * Dev/preview middleware for local Vite server.
 */
export function apiProxy(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '')
  const readKey = (name: ApiKeyName) => process.env[name] ?? env[name] ?? ''

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const cleanPath = url.pathname.replace(/\/+$/, '')
    const route = ROUTES[cleanPath]

    if (!route) {
      next()
      return
    }

    if (req.method !== 'GET') {
      sendJson(res, 405, { error: 'Method not allowed' })
      return
    }

    const apiKey = readKey(route.key)
    if (!apiKey) {
      sendJson(res, 500, {
        error: `Missing ${route.key} environment variable in .env`,
      })
      return
    }

    const params = new URLSearchParams(url.search)
    params.delete(route.keyParam)
    params.set(route.keyParam, apiKey)

    fetch(`${route.upstream}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
      .then(async (upstream) => {
        const body = await upstream.text()
        res.statusCode = upstream.status
        res.setHeader(
          'Content-Type',
          upstream.headers.get('content-type') ??
            'application/json; charset=utf-8',
        )
        res.setHeader('Cache-Control', 'no-store')
        res.end(body)
      })
      .catch((error: unknown) => {
        console.error(`[api-proxy] ${url.pathname} failed:`, error)
        sendJson(res, 502, {
          error:
            error instanceof Error ? error.message : 'Upstream request failed',
        })
      })
  }

  return {
    name: 'aura-sky-api-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(middleware)
    },
  }
}
