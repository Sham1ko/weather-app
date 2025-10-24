"use client";

interface ForecastDaySkeletonProps {
  isSelected?: boolean;
}

export default function ForecastDaySkeleton({
  isSelected = false,
}: ForecastDaySkeletonProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 h-full ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      {/* Weather Icon Skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
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
