import { useState, type FormEvent } from 'react'
import { useSearchQuery } from '../../hooks/useRoute'
import { navigate } from '../../lib/navigation'

type LocationSearchProps = {
  variant?: 'header' | 'page'
  autoFocus?: boolean
}

/**
 * Location search box. Submitting navigates to `/search?q=<query>`,
 * which renders the detailed results page.
 */
function LocationSearch({ variant = 'header', autoFocus = false }: LocationSearchProps) {
  const activeQuery = useSearchQuery()
  const [value, setValue] = useState(activeQuery)
  const [syncedQuery, setSyncedQuery] = useState(activeQuery)

  // Keep the input in sync when the route query changes (back/forward, links)
  // without an effect that would re-render twice.
  if (activeQuery !== syncedQuery) {
    setSyncedQuery(activeQuery)
    setValue(activeQuery)
  }

  const trimmed = value.trim()
  const isPage = variant === 'page'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      aria-label="Search locations"
      className={
        isPage
          ? 'w-full flex items-center gap-space-xs rounded-xl bg-surface-container-lowest pl-space-md pr-space-xs py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-secondary/30 transition-all'
          : 'w-full flex items-center gap-space-xs rounded-lg bg-surface-container-lowest pl-space-md pr-1 py-1 shadow-[0_2px_12px_rgba(2,132,199,0.04)] focus-within:ring-2 focus-within:ring-secondary/30 transition-all'
      }
      onSubmit={handleSubmit}
      role="search"
    >
      <span className="material-symbols-outlined shrink-0 text-outline text-[20px]">search</span>
      <input
        aria-label="Search city or location"
        autoFocus={autoFocus}
        className={
          isPage
            ? 'w-full min-w-0 bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none'
            : 'w-full min-w-0 bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none'
        }
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          isPage
            ? 'Search any city or location (e.g. San Francisco, Tokyo)…'
            : 'Search city or location…'
        }
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label="Clear search"
          className="shrink-0 p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          onClick={() => setValue('')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      ) : null}
      <button
        aria-label="Search location"
        className={
          isPage
            ? 'shrink-0 inline-flex items-center gap-space-xs rounded-lg bg-primary-container px-space-md py-space-sm font-label-md text-label-md font-semibold text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-50'
            : 'shrink-0 inline-flex items-center gap-space-xs rounded bg-primary-container px-space-sm py-2 font-label-md text-label-md font-semibold text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-50'
        }
        disabled={!trimmed}
        type="submit"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        <span className={isPage ? 'inline' : 'hidden sm:inline'}>Search</span>
      </button>
    </form>
  )
}

export default LocationSearch
