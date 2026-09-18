"use client";

interface MultiDayForecastItemSkeletonProps {
  isSelected?: boolean;
}

export default function MultiDayForecastItemSkeleton({
  isSelected = false,
}: MultiDayForecastItemSkeletonProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${
        isSelected
          ? "bg-primary-soft border border-indigo-100 dark:border-indigo-900"
          : "border border-transparent"
      }`}
    >
      {/* Weather Icon Skeleton: 22px, как WeatherIcon */}
      <div className="flex items-center space-x-2.5">
        <div className="w-[22px] h-[22px] bg-line rounded-full animate-pulse"></div>
        <div className="leading-tight">
          {/* high: строка 20px, low: ~15px, без отступов — как в item */}
          <div className="w-8 h-5 bg-line rounded animate-pulse"></div>
          <div className="w-6 h-4 bg-line rounded animate-pulse"></div>
        </div>
      </div>

      {/* Date and Day Skeleton */}
      <div className="text-right leading-tight">
        <div className="w-16 h-5 bg-line rounded animate-pulse ml-auto"></div>
        <div className="w-12 h-4 bg-line rounded animate-pulse ml-auto"></div>
      </div>
    </div>
  );
}
