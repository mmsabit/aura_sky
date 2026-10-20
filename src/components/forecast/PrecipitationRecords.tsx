const views = ['Rainfall (mm)', 'Snowfall (cm)', 'Combined View']

const stats = [
  {
    label: 'Total Rainfall',
    value: '24.9 mm',
    note: '-22% vs 10-yr average (32mm)',
    noteClass: 'text-primary font-semibold',
  },
  {
    label: 'Measurable Rain Days',
    value: '5 Days',
    note: 'Normal range (4–6 days)',
    noteClass: 'text-on-surface-variant font-medium',
  },
  {
    label: 'Snowfall Recorded',
    value: '0.0 cm',
    note: 'Elev. threshold not reached',
    noteClass: 'text-on-surface-variant font-medium',
  },
  {
    label: 'Longest Dry Streak',
    value: '12 Days',
    note: 'Oct 11 – Oct 22 active',
    noteClass: 'text-secondary font-medium',
  },
]

function PrecipitationRecords() {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">cloud_sync</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Monthly Precipitation &amp; Snowfall Records
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Historical rainfall volume, precipitation probability, and snowfall accumulation over the past 30
            days
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {views.map((view, index) => (
            <button
              key={view}
              className={
                index === 0
                  ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md font-semibold'
                  : 'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'
              }
              type="button"
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-space-sm p-3 rounded-lg bg-surface-container-low text-secondary font-body-sm text-body-sm">
        <span className="material-symbols-outlined text-[18px]">info</span>
        <span>
          Atmospheric River system passed through North Coast during <strong>Oct 8–10</strong>, providing 74%
          of the monthly total moisture.
        </span>
      </div>

      <div className="relative w-full overflow-x-auto pt-space-xs">
        <div className="min-w-[680px]">
          <svg
            className="w-full h-64 overflow-visible"
            fill="none"
            viewBox="0 0 800 230"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line stroke="#F1F5F9" strokeWidth="1" x1="50" x2="780" y1="20" y2="20"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="10" textAnchor="end" x="35" y="24">
              25mm / 100%
            </text>
            <line stroke="#F1F5F9" strokeWidth="1" x1="50" x2="780" y1="70" y2="70"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="10" textAnchor="end" x="35" y="74">
              18mm / 75%
            </text>
            <line stroke="#F1F5F9" strokeWidth="1" x1="50" x2="780" y1="120" y2="120"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="10" textAnchor="end" x="35" y="124">
              10mm / 50%
            </text>
            <line stroke="#F1F5F9" strokeWidth="1" x1="50" x2="780" y1="170" y2="170"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="10" textAnchor="end" x="35" y="174">
              3mm / 25%
            </text>
            <line stroke="#E2E8F0" strokeWidth="1" x1="50" x2="780" y1="200" y2="200"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="10" textAnchor="end" x="35" y="204">
              0mm / 0%
            </text>

            <line stroke="#BAE6FD" strokeDasharray="4 4" strokeWidth="1" x1="50" x2="780" y1="135" y2="135"></line>
            <text
              fill="#00668A"
              fontFamily="Inter"
              fontSize="10"
              fontWeight="500"
              textAnchor="end"
              x="775"
              y="130"
            >
              Historical Normal (8mm/wk)
            </text>

            <rect
              className="hover:fill-secondary-container transition-colors"
              fill="#BAE6FD"
              height="34"
              rx="6"
              width="64"
              x="110"
              y="166"
            ></rect>
            <text fill="#00668A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="142" y="158">
              4.2 mm
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="11" fontWeight="500" textAnchor="middle" x="142" y="218">
              Week 1 (Oct 1-7)
            </text>

            <rect
              className="hover:opacity-90 transition-opacity"
              fill="#0284C7"
              height="135"
              rx="6"
              width="64"
              x="290"
              y="65"
            ></rect>
            <text fill="#0284C7" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" textAnchor="middle" x="322" y="55">
              18.6 mm
            </text>
            <text fill="#0284C7" fontFamily="Inter" fontSize="11" fontWeight="600" textAnchor="middle" x="322" y="218">
              Week 2 (Oct 8-14)
            </text>

            <rect fill="#F0F9FF" height="24" rx="4" width="144" x="250" y="12"></rect>
            <text fill="#00668A" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="322" y="28">
              Atmospheric River Event
            </text>

            <rect
              className="hover:fill-secondary-container transition-colors"
              fill="#BAE6FD"
              height="18"
              rx="4"
              width="64"
              x="470"
              y="182"
            ></rect>
            <text fill="#00668A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="502" y="174">
              2.1 mm
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="11" fontWeight="500" textAnchor="middle" x="502" y="218">
              Week 3 (Oct 15-21)
            </text>

            <rect fill="#CBD5E1" height="2" rx="1" width="64" x="650" y="198"></rect>
            <text fill="#94A3B8" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="682" y="190">
              0.0 mm
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="11" fontWeight="500" textAnchor="middle" x="682" y="218">
              Week 4 (Oct 22-28)
            </text>

            <path
              d="M 142,150 C 220,150 250,30 322,30 C 400,30 430,165 502,165 C 570,165 620,192 682,192"
              fill="none"
              stroke="#38BDF8"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>
            <circle cx="142" cy="150" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="322" cy="30" fill="#38BDF8" r="4" stroke="#FFFFFF" strokeWidth="2"></circle>
            <circle cx="502" cy="165" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="682" cy="192" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-outline font-medium">{stat.label}</span>
            <div className="my-1">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">{stat.value}</span>
            </div>
            <span className={`font-label-sm text-label-sm ${stat.noteClass}`}>{stat.note}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PrecipitationRecords
