interface WeatherCardSkeletonProps {
  isVisible: boolean;
}

export default function WeatherCardSkeleton({
  isVisible,
}: WeatherCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full p-8 shadow-lg ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* City Title and Icon Skeleton */}
      <div className="flex justify-between items-start">
        <div className="transition-all duration-500 ease-in-out h-10">
          <div className="w-48 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="transition-all duration-500 ease-in-out w-16 h-16">
          <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Weather Details Skeleton */}
      <div className="mt-4 space-y-2 transition-all duration-500 ease-in-out">
        {/* Temperature Skeleton */}
        <div className="transition-all duration-500 ease-in-out h-8">
          <div className="w-64 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Description Skeleton */}
        <div className="transition-all duration-500 ease-in-out h-7">
          <div className="w-56 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Humidity Skeleton */}
        <div className="transition-all duration-500 ease-in-out h-7">
          <div className="w-40 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Wind Speed Skeleton */}
        <div className="transition-all duration-500 ease-in-out h-7">
          <div className="w-44 h-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
