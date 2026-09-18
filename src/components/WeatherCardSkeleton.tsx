export default function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col grow bg-surface rounded-2xl border border-line p-5 shadow-sm">
      {/* Заголовок и иконка */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="w-48 h-5 bg-line rounded animate-pulse"></div>
          <div className="w-32 h-4 mt-1.5 bg-line rounded animate-pulse"></div>
          <div className="w-24 h-3 mt-1 bg-line rounded animate-pulse"></div>
        </div>
        <div className="w-10 h-10 bg-line rounded-full animate-pulse"></div>
      </div>

      {/* Температура и статы */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="w-24 h-9 bg-line rounded animate-pulse"></div>
          <div className="w-32 h-3 mt-1.5 bg-line rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-12 bg-line rounded-lg animate-pulse"></div>
          <div className="w-24 h-12 bg-line rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
