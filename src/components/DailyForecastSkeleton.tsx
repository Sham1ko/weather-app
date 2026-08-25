"use client";

interface DailyForecastSkeletonProps {
  isFocused: boolean;
}

export default function DailyForecastSkeleton({
  isFocused,
}: DailyForecastSkeletonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg flex flex-col">
      {/* Header Skeleton */}
      <div className="mb-3">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="text-center p-1.5 rounded-lg">
            {/* Time Skeleton */}
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse mx-auto mb-0.5"></div>

            {/* Weather Icon Skeleton */}
            <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse mx-auto mb-0.5"></div>

            {/* Temperature Skeleton */}
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse mx-auto mb-0.5"></div>

            {/* Description Skeleton */}
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
