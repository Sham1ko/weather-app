interface HourlyForecastCardSkeletonProps {
  isFocused: boolean;
}

export default function HourlyForecastCardSkeleton({
  isFocused,
}: HourlyForecastCardSkeletonProps) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm flex flex-col grow">
      {/* Header Skeleton: размер как у реального заголовка (text-xl/text-lg) */}
      <div className="mb-4">
        <div
          className={`w-32 bg-line rounded animate-pulse ${
            isFocused ? "h-8" : "h-7"
          }`}
        ></div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-3 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="text-center p-1.5 rounded-lg">
            {/* Time: text-xs = 16px */}
            <div className="w-8 h-4 bg-line rounded animate-pulse mx-auto mb-0.5"></div>

            {/* Weather Icon: 22px, как WeatherIcon */}
            <div className="w-[22px] h-[22px] bg-line rounded-full animate-pulse mx-auto mb-0.5"></div>

            {/* Temperature: text-base leading-tight = 20px */}
            <div className="w-8 h-5 bg-line rounded animate-pulse mx-auto"></div>

            {/* Description: ~14px */}
            <div className="w-12 h-3.5 bg-line rounded animate-pulse mx-auto mt-0.5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
