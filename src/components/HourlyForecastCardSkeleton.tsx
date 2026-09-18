"use client";

interface HourlyForecastCardSkeletonProps {
  isFocused: boolean;
}

export default function HourlyForecastCardSkeleton({
  isFocused,
}: HourlyForecastCardSkeletonProps) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm flex flex-col grow">
      {/* Header Skeleton */}
      <div className="mb-4">
        <div className="w-32 h-6 bg-line rounded animate-pulse"></div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-3 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="text-center p-1.5 rounded-lg">
            {/* Time Skeleton */}
            <div className="w-8 h-3 bg-line rounded animate-pulse mx-auto mb-0.5"></div>

            {/* Weather Icon Skeleton */}
            <div className="w-7 h-7 bg-line rounded-full animate-pulse mx-auto mb-0.5"></div>

            {/* Temperature Skeleton */}
            <div className="w-8 h-4 bg-line rounded animate-pulse mx-auto mb-0.5"></div>

            {/* Description Skeleton */}
            <div className="w-12 h-3 bg-line rounded animate-pulse mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
