export const config = {
  runtime: 'edge',
}

declare const process: {
  env: Record<string, string | undefined>
}

type RouteConfig = {
  upstream: string
  key: string
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

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const url = new URL(req.url)
  const cleanPath = url.pathname.replace(/\/+$/, '')
  const route = ROUTES[cleanPath]

  if (!route) {
    return new Response(
      JSON.stringify({
        error: `API route not found: ${cleanPath}`,
        availableRoutes: Object.keys(ROUTES),
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }

  const apiKey = process.env[route.key]
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: `Missing environment variable: ${route.key}. Please add it to your Vercel Project Settings > Environment Variables.`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }

  const params = new URLSearchParams(url.search)
  params.delete(route.keyParam)
  params.set(route.keyParam, apiKey)

  try {
    const upstreamRes = await fetch(`${route.upstream}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

    const body = await upstreamRes.text()
    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        'Content-Type':
          upstreamRes.headers.get('content-type') ??
          'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({
        error:
          err instanceof Error ? err.message : 'Upstream API request failed',
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }
}
