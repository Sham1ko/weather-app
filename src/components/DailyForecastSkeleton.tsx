"use client";

interface DailyForecastSkeletonProps {
  isFocused: boolean;
}

export default function DailyForecastSkeleton({
  isFocused,
}: DailyForecastSkeletonProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full flex flex-col ${
        isFocused ? "p-6 shadow-2xl" : "p-4 shadow-lg"
      }`}
    >
      {/* Header Skeleton */}
      <div className="mb-4">
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-7" : "h-6"
          }`}
        >
          <div className="w-32 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="flex-1 flex items-center">
        <div className="grid grid-cols-4 gap-2 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center p-2 rounded-lg">
              {/* Time Skeleton */}
              <div className="w-8 h-3 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>

              {/* Weather Icon Skeleton */}
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mx-auto mb-1"></div>

              {/* Temperature Skeleton */}
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>

              {/* Description Skeleton */}
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
