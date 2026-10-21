import logo from '../assets/logo.png'
import avatar from '../assets/avatar.jpg'
import type { Route } from '../hooks/useHashRoute'

const navLinks = [
  { label: 'Forecast', path: 'forecast' },
  { label: 'Radar & Map', path: 'radar-and-map' },
  { label: 'Air Quality', path: 'air-quality' },
  { label: 'Alerts', path: 'alerts' },
] as const

type SiteHeaderProps = {
  activePath: Route
}

function SiteHeader({ activePath }: SiteHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full max-w-[1360px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-lg flex-shrink-0">
          <a className="flex items-center gap-space-xs" data-path="forecast" href="#/forecast">
            <img alt="Aura Sky Logo" className="w-auto object-contain h-10" src={logo} />
          </a>
        </div>

        <div className="hidden xl:flex items-center flex-1 max-w-md">
          <div className="w-full flex items-center justify-between px-space-md py-space-xs rounded bg-surface-container-lowest shadow-[0_2px_12px_rgba(2,132,199,0.04)] focus-within:ring-2 focus-within:ring-secondary/30 transition-all">
            <div className="flex items-center gap-space-xs flex-1">
              <span className="material-symbols-outlined text-outline text-[18px]">search</span>
              <input
                aria-label="Search city or location"
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
                placeholder="Search city or location (e.g. San Francisco, Tokyo)..."
                type="text"
              />
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-space-sm">
          {navLinks.map((link) => {
            const isActive = link.path === activePath
            const isAvailable = link.path === 'forecast' || link.path === 'radar-and-map'

            return (
              <a
                key={link.path}
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={isAvailable ? undefined : true}
                className={
                  isActive
                    ? 'transition-all bg-primary-container text-on-primary-container font-semibold rounded px-space-sm py-1.5'
                    : isAvailable
                      ? 'font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-sm py-1.5 rounded transition-all'
                      : 'font-body-md text-body-md text-on-surface-variant/50 cursor-not-allowed px-space-sm py-1.5 rounded'
                }
                data-path={link.path}
                href={isAvailable ? `#/${link.path}` : '#'}
                onClick={
                  isAvailable ? undefined : (event) => event.preventDefault()
                }
                title={isAvailable ? undefined : 'Coming soon'}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-space-sm flex-shrink-0">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span>
          </button>
          <div className="flex items-center gap-space-xs pl-space-xs cursor-pointer group">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src={avatar} />
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-colors">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
