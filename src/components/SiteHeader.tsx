import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import LocationSearch from './search/LocationSearch'
import type { Route } from '../hooks/useRoute'

const navLinks = [
  { label: 'Forecast', path: 'forecast' },
  { label: 'Radar & Map', path: 'radar-and-map' },
] as const

type SiteHeaderProps = {
  activePath: Route
}

function SiteHeader({ activePath }: SiteHeaderProps) {
  const [menuState, setMenuState] = useState({ path: activePath, open: false })
  const menuOpen = menuState.path === activePath && menuState.open
  const setMenuOpen = (open: boolean) => setMenuState({ path: activePath, open })

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full max-w-340 mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-sm lg:gap-space-lg">
        <div className="flex items-center gap-space-lg shrink-0">
          <a className="flex items-center gap-space-xs" data-path="forecast" href="/forecast">
            <img alt="Aura Sky Logo" className="w-auto object-contain h-10" src={logo} />
          </a>
        </div>

        <div className="hidden xl:flex items-center flex-1 max-w-md">
          <LocationSearch />
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
                href={isAvailable ? `/${link.path}` : '#'}
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

        <div className="flex items-center gap-1 sm:gap-space-sm shrink-0 xl:hidden">
          <a
            aria-label="Search locations"
            className="inline-flex h-10 w-10 items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors xl:hidden"
            href="/search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </a>
          <button
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors lg:hidden"
            onClick={() =>
              setMenuState((current) => ({
                path: activePath,
                open: current.path === activePath ? !current.open : true,
              }))
            }
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-xl shadow-lg">
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-340 flex-col gap-1 px-margin py-space-md md:px-margin-tablet"
            id="mobile-nav"
          >
            {navLinks.map((link) => {
              const isActive = link.path === activePath

              return (
                <a
                  key={link.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'flex items-center gap-space-sm rounded-lg bg-primary-container px-space-sm py-3 font-body-md text-body-md font-semibold text-on-primary-container'
                      : 'flex items-center gap-space-sm rounded-lg px-space-sm py-3 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface'
                  }
                  href={`/${link.path}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {link.path === 'forecast' ? 'partly_cloudy_day' : 'map'}
                  </span>
                  {link.label}
                </a>
              )
            })}
            <a
              className="flex items-center gap-space-sm rounded-lg px-space-sm py-3 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
              href="/search"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Search locations
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default SiteHeader
