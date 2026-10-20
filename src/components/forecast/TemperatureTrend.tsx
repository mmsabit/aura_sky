const ranges = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days']

const summary = [
  { icon: 'equalizer', label: 'Weekly Average', value: '19.7°C', tone: 'primary' },
  { icon: 'wb_sunny', label: 'Warmest Day', value: 'Wednesday (24°C)', tone: 'secondary' },
  { icon: 'mode_night', label: 'Coolest Night', value: 'Saturday (10°C)', tone: 'primary' },
]

function TemperatureTrend() {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Past 7 Days Temperature History
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Observed daily high, low, and average thermal variance with diurnal amplitude
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {ranges.map((range, index) => (
            <button
              key={range}
              className={
                index === 0
                  ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md font-semibold'
                  : 'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors'
              }
              type="button"
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto pt-space-md">
        <div className="min-w-[700px] relative">
          <div className="absolute left-[78%] -top-3 -translate-x-1/2 z-20 pointer-events-none transition-transform">
            <div className="flex flex-col gap-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest shadow-xl text-on-surface font-body-sm text-body-sm">
              <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                Saturday, Oct 18
              </div>
              <div className="flex items-center gap-3 font-label-md text-label-md">
                <span>
                  Max: <strong className="text-on-surface">21°C</strong>
                </span>
                <span>
                  Min: <strong className="text-on-surface">12°C</strong>
                </span>
                <span>
                  Avg: <strong className="text-primary font-semibold">16.5°C</strong>
                </span>
              </div>
            </div>
            <div className="w-2.5 h-2.5 bg-surface-container-lowest rotate-45 mx-auto -mt-1 shadow-sm"></div>
          </div>

          <svg
            className="w-full h-72 overflow-visible"
            fill="none"
            viewBox="0 0 840 260"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="skyTempGrad" x1="0" x2="0" y1="0" y2="240">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32"></stop>
                <stop offset="60%" stopColor="#BAE6FD" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="800" y1="30" y2="30"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="11" textAnchor="end" x="25" y="34">
              26°C
            </text>
            <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="800" y1="80" y2="80"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="11" textAnchor="end" x="25" y="84">
              22°C
            </text>
            <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="800" y1="130" y2="130"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="11" textAnchor="end" x="25" y="134">
              18°C
            </text>
            <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="800" y1="180" y2="180"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="11" textAnchor="end" x="25" y="184">
              14°C
            </text>
            <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="800" y1="230" y2="230"></line>
            <text fill="#94A3B8" fontFamily="Inter" fontSize="11" textAnchor="end" x="25" y="234">
              10°C
            </text>

            <line stroke="#F1F5F9" strokeWidth="1" x1="80" x2="80" y1="30" y2="230"></line>
            <line stroke="#F1F5F9" strokeWidth="1" x1="200" x2="200" y1="30" y2="230"></line>
            <line stroke="#F1F5F9" strokeWidth="1" x1="320" x2="320" y1="30" y2="230"></line>
            <line stroke="#F1F5F9" strokeWidth="1" x1="440" x2="440" y1="30" y2="230"></line>
            <line stroke="#F1F5F9" strokeWidth="1" x1="560" x2="560" y1="30" y2="230"></line>
            <line stroke="#BAE6FD" strokeDasharray="3 3" strokeWidth="1.5" x1="680" x2="680" y1="30" y2="230"></line>
            <line stroke="#F1F5F9" strokeWidth="1" x1="780" x2="780" y1="30" y2="230"></line>

            <path
              d="M 80,118 C 140,95 160,80 200,80 C 260,80 280,55 320,55 C 380,55 400,105 440,105 C 500,105 520,130 560,130 C 620,130 640,142 680,142 C 730,142 750,130 780,130 L 780,230 L 80,230 Z"
              fill="url(#skyTempGrad)"
            ></path>
            <path
              d="M 80,118 C 140,95 160,80 200,80 C 260,80 280,55 320,55 C 380,55 400,105 440,105 C 500,105 520,130 560,130 C 620,130 640,142 680,142 C 730,142 750,130 780,130"
              fill="none"
              stroke="#0284C7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></path>
            <path
              d="M 80,205 C 140,192 160,192 200,192 C 260,192 280,168 320,168 C 380,168 400,180 440,180 C 500,180 520,218 560,218 C 620,218 640,230 680,230 C 730,230 750,192 780,192"
              fill="none"
              stroke="#38BDF8"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeWidth="2"
            ></path>

            <circle cx="80" cy="118" fill="#FFFFFF" r="4.5" stroke="#0284C7" strokeWidth="2.5"></circle>
            <text fill="#0F172A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="80" y="106">
              19°
            </text>
            <circle cx="200" cy="80" fill="#FFFFFF" r="4.5" stroke="#0284C7" strokeWidth="2.5"></circle>
            <text fill="#0F172A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="200" y="68">
              22°
            </text>
            <circle cx="320" cy="55" fill="#0284C7" r="5.5" stroke="#FFFFFF" strokeWidth="2"></circle>
            <text fill="#0284C7" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" textAnchor="middle" x="320" y="43">
              24°C
            </text>
            <circle cx="440" cy="105" fill="#FFFFFF" r="4.5" stroke="#0284C7" strokeWidth="2.5"></circle>
            <text fill="#0F172A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="440" y="93">
              20°
            </text>
            <circle cx="560" cy="130" fill="#FFFFFF" r="4.5" stroke="#0284C7" strokeWidth="2.5"></circle>
            <text fill="#0F172A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="560" y="118">
              18°
            </text>
            <circle cx="680" cy="142" fill="#38BDF8" r="6" stroke="#FFFFFF" strokeWidth="2.5"></circle>
            <text fill="#0284C7" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" x="680" y="130">
              17°
            </text>
            <circle cx="780" cy="130" fill="#FFFFFF" r="4.5" stroke="#0284C7" strokeWidth="2.5"></circle>
            <text fill="#0F172A" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="780" y="118">
              18°
            </text>

            <circle cx="80" cy="205" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="200" cy="192" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="320" cy="168" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="440" cy="180" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="560" cy="218" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>
            <circle cx="680" cy="230" fill="#00668A" r="4.5" stroke="#FFFFFF" strokeWidth="2"></circle>
            <circle cx="780" cy="192" fill="#FFFFFF" r="3.5" stroke="#38BDF8" strokeWidth="2"></circle>

            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="80" y="252">
              Mon 13
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="200" y="252">
              Tue 14
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="320" y="252">
              Wed 15
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="440" y="252">
              Thu 16
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="560" y="252">
              Fri 17
            </text>
            <text fill="#0284C7" fontFamily="Inter" fontSize="12" fontWeight="700" textAnchor="middle" x="680" y="252">
              Sat 18
            </text>
            <text fill="#64748B" fontFamily="Inter" fontSize="12" fontWeight="500" textAnchor="middle" x="780" y="252">
              Sun 19
            </text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-md">
        {summary.map((item) => (
          <div key={item.label} className="flex items-center gap-space-sm p-3.5 rounded-xl bg-surface-container-low">
            <div
              className={`w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm ${
                item.tone === 'secondary' ? 'text-secondary font-bold' : 'text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline font-medium">{item.label}</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TemperatureTrend
