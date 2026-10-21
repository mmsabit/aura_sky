import { lazy, Suspense, useEffect } from 'react'
import ForeCast from './components/forecast/ForeCast'
import Loading from './components/Loading'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { useRoute } from './hooks/useRoute'
import { WeatherProvider } from './hooks/WeatherProvider'

const RadarMap = lazy(() => import('./pages/RadarMap'))
const SearchResults = lazy(() => import('./pages/SearchResults'))

function App() {
  const route = useRoute()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <SiteHeader activePath={route} />
      <Suspense
        fallback={
          <main className="w-full flex-1 bg-background pt-20">
            <Loading fullPage label="Loading page…" />
          </main>
        }
      >
        {route === 'radar-and-map' ? (
          <RadarMap />
        ) : route === 'search' ? (
          <SearchResults />
        ) : (
          <WeatherProvider>
            <ForeCast />
          </WeatherProvider>
        )}
      </Suspense>
      <SiteFooter />
    </div>
  )
}

export default App
