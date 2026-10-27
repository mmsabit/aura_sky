import { loadEnv } from 'vite'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'
import { ROUTES, handleNodeRequest } from './apiHandler.ts'

/**
 * Dev/preview middleware for the weather + geocoding APIs.
 *
 * Populates process.env with WEATHER_API and GEO_API_KEY from .env and
 * delegates /api/* calls to the same apiHandler used on Vercel.
 */
export function apiProxy(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const cleanPath = url.pathname.replace(/\/+$/, '')
    const route = ROUTES[cleanPath]

    if (!route) {
      next()
      return
    }

    handleNodeRequest(req, res).catch((err) => {
      console.error(`[api-proxy] ${url.pathname} failed:`, err)
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
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
