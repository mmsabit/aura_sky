import type { IncomingMessage, ServerResponse } from 'node:http'

export type ApiKeyName = 'WEATHER_API' | 'GEO_API_KEY'

export type RouteConfig = {
  upstream: string
  key: ApiKeyName
  keyParam: string
}

export const ROUTES: Record<string, RouteConfig> = {
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

export async function proxyApiRequest(
  pathname: string,
  search: string,
  method: string = 'GET',
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  // Normalize pathname by stripping trailing slashes
  const cleanPath = pathname.replace(/\/+$/, '')
  const route = ROUTES[cleanPath]

  if (!route) {
    return {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: `Not found: ${cleanPath}` }),
    }
  }

  if (method !== 'GET') {
    return {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const apiKey = process.env[route.key]
  if (!apiKey) {
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error: `Missing ${route.key} environment variable on server`,
      }),
    }
  }

  const params = new URLSearchParams(search)
  params.delete(route.keyParam)
  params.set(route.keyParam, apiKey)

  try {
    const upstream = await fetch(`${route.upstream}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })

    const body = await upstream.text()
    return {
      status: upstream.status,
      headers: {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
      body,
    }
  } catch (error: unknown) {
    return {
      status: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Upstream request failed',
      }),
    }
  }
}

export async function handleNodeRequest(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const result = await proxyApiRequest(url.pathname, url.search, req.method)

  res.statusCode = result.status
  for (const [headerKey, headerVal] of Object.entries(result.headers)) {
    res.setHeader(headerKey, headerVal)
  }
  res.end(result.body)
}

export async function handleWebRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const result = await proxyApiRequest(url.pathname, url.search, request.method)

  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  })
}

// Universal handler compatible with both Node (req, res) and Edge/Web Request
export default async function handler(
  req: IncomingMessage | Request,
  res?: ServerResponse,
) {
  if (res && typeof res.setHeader === 'function') {
    return handleNodeRequest(req as IncomingMessage, res)
  }
  return handleWebRequest(req as Request)
}

