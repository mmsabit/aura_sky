import CurrentConditions from './CurrentConditions'
import PrecipitationRecords from './PrecipitationRecords'
import SevenDayForecast from './SevenDayForecast'
import TemperatureTrend from './TemperatureTrend'

const ForeCast = () => {
    return (
         <main className="w-full flex-1 bg-background pt-20">
        <div className="flex w-full flex-col">
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute -top-40 right-1/4 h-130 w-130 rounded-full bg-secondary-container/15 blur-3xl"></div>
            <div className="pointer-events-none absolute top-96 -left-20 h-120 w-120 rounded-full bg-secondary-fixed/40 blur-3xl"></div>

            <div className="relative mx-auto w-full max-w-340 px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl lg:py-space-2xl flex flex-col gap-space-2xl">
              <CurrentConditions />
              <TemperatureTrend />
              <PrecipitationRecords />
              <SevenDayForecast />
            </div>
          </div>
        </div>
      </main>
    );
};

export default ForeCast;