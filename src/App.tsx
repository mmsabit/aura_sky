import ForeCast from './components/forecast/ForeCast'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'


function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <SiteHeader />
        <ForeCast/>
      <SiteFooter />
    </div>
  )
}

export default App
