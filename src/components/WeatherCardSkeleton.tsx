"use client";

interface WeatherCardSkeletonProps {
  isVisible: boolean;
  isFocused: boolean;
}

export default function WeatherCardSkeleton({
  isVisible,
  isFocused,
}: WeatherCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${isFocused ? "p-8 shadow-lg" : "p-6 shadow-lg"}`}
    >
      {/* City Title and Icon Skeleton */}
      <div className="flex justify-between items-start">
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-10" : "h-8"
          }`}
        >
          <div className="w-48 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "w-16 h-16" : "w-12 h-12"
          }`}
        >
          <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Weather Details Skeleton */}
      <div
        className={`mt-4 space-y-2 transition-all duration-500 ease-in-out ${
          isFocused ? "space-y-4" : "space-y-2"
        }`}
      >
        {/* Temperature Skeleton */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-8" : "h-6"
          }`}
        >
          <div className="w-64 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Description Skeleton */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-7" : "h-5"
          }`}
        >
          <div className="w-56 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Humidity Skeleton */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-7" : "h-5"
          }`}
        >
          <div className="w-40 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Wind Speed Skeleton */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "h-7" : "h-5"
          }`}
        >
          <div className="w-44 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
