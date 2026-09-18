"use client";

interface MultiDayForecastItemSkeletonProps {
  isSelected?: boolean;
}

export default function MultiDayForecastItemSkeleton({
  isSelected = false,
}: MultiDayForecastItemSkeletonProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-xl ${
        isSelected
          ? "bg-primary-soft border border-indigo-100"
          : "border border-transparent"
      }`}
    >
      {/* Weather Icon Skeleton */}
      <div className="flex items-center space-x-2.5">
        <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-1">
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-6 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Date and Day Skeleton */}
      <div className="text-right space-y-1">
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse ml-auto"></div>
      </div>
    </div>
  );
}
