export default function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col grow bg-surface rounded-2xl border border-line p-5 shadow-sm">
      {/* Заголовок и иконка */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* city: text-lg = 28px строки */}
          <div className="w-48 h-7 bg-line rounded animate-pulse"></div>
          {/* description: text-sm = 20px строки, без отступа — как в карточке */}
          <div className="w-32 h-5 bg-line rounded animate-pulse"></div>
          {/* обновлено: text-xs = 16px строки + mt-1 */}
          <div className="w-24 h-4 mt-1 bg-line rounded animate-pulse"></div>
        </div>
        <div className="w-10 h-10 bg-line rounded-full animate-pulse"></div>
      </div>

      {/* Температура и статы */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          {/* температура: text-4xl leading-none = 36px */}
          <div className="w-24 h-9 bg-line rounded animate-pulse"></div>
          {/* ощущается как: text-sm = 20px + mt-1.5 */}
          <div className="w-32 h-5 mt-1.5 bg-line rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          {/* чипы-пилюли, как в карточке */}
          <div className="w-20 h-12 bg-line rounded-full animate-pulse"></div>
          <div className="w-28 h-12 bg-line rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
