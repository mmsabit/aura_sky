export const config = {
  runtime: 'edge',
}

declare const process: {
  env: Record<string, string | undefined>
}

const UPSTREAM = 'https://api-bdc.net/data/reverse-geocode'
const UPSTREAM_TIMEOUT_MS = 15_000

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const apiKey = process.env.GEO_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          'Missing GEO_API_KEY environment variable. Please add it to your Vercel Project Settings > Environment Variables.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }

  const url = new URL(req.url)
  const params = new URLSearchParams(url.search)
  params.delete('key')
  params.set('key', apiKey)

  try {
    const upstreamRes = await fetch(`${UPSTREAM}?${params.toString()}`, {
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
          err instanceof Error ? err.message : 'Upstream geocode request failed',
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }
}

