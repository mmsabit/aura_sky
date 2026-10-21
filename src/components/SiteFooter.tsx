type FooterColumn = {
  title: string
  links: { label: string; path: string }[]
}

const columns: FooterColumn[] = [
  {
    title: 'Products',
    links: [
      { label: 'Live Radar', path: 'radar-and-map' },
      { label: 'Hourly Forecast', path: 'forecast' },
      { label: 'Weather API', path: 'weather-api' },
      { label: 'Historical Trends', path: 'historical-data' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', path: 'documentation' },
      { label: 'Severe Weather Alerts', path: 'alerts' },
      { label: 'Marine Forecast', path: 'marine-forecast' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', path: 'about-us' },
      { label: 'Sustainability', path: 'sustainability' },
      { label: 'Contact', path: 'contact' },
      { label: 'Privacy Policy', path: 'privacy-policy' },
      { label: 'Terms', path: 'terms' },
    ],
  },
]

const metaLinks = [
  { label: 'Global Stations', ariaLabel: 'Global Network' },
  { label: 'Telemetry Feeds', ariaLabel: 'Telemetry Feeds' },
  { label: 'Satellite Mesh', ariaLabel: 'Satellite Constellation' },
]

const PAGE_LINKS: Record<string, string> = {
  forecast: '/forecast',
  'radar-and-map': '/radar-and-map',
}

function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_12px_rgba(0,0,0,0.02)]">
      <div className="w-full max-w-340 mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl">
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-lg text-headline-lg tracking-tight text-primary">Aura Sky</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Hyper-local atmospheric intelligence and pristine weather forecasting.
            </p>
            <div className="flex items-center gap-space-xs mt-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                All weather sensors operational
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-space-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface">{column.title}</span>
              <nav className="flex flex-col gap-space-xs">
                {column.links.map((link) => {
                  const href = PAGE_LINKS[link.path]

                  return (
                    <a
                      key={link.path}
                      aria-disabled={href ? undefined : true}
                      className={
                        href
                          ? 'font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors'
                          : 'font-body-sm text-body-sm text-on-surface-variant/50 cursor-not-allowed'
                      }
                      data-path={link.path}
                      href={href ?? '#'}
                      onClick={
                        href ? undefined : (event) => event.preventDefault()
                      }
                    >
                      {link.label}
                    </a>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <p className="font-label-md text-label-md">
            © 2025 Aura Sky Meteorological Systems Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-space-md">
            {metaLinks.map((link) => (
              <a
                key={link.label}
                aria-label={link.ariaLabel}
                className="font-label-md text-label-md hover:text-primary transition-colors"
                href="#"
                onClick={(event) => event.preventDefault()}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
