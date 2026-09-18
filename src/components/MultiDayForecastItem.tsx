"use client";

interface MultiDayForecastItemProps {
  date: string;
  day: string;
  icon: string;
  high: number;
  low: number;
  description: string;
  isSelected?: boolean;
}

export default function MultiDayForecastItem({
  date,
  day,
  icon,
  high,
  low,
  description,
  isSelected = false,
}: MultiDayForecastItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "border border-transparent"
      }`}
    >
      {/* Weather Icon */}
      <div className="flex items-center space-x-2.5">
        <div className="text-xl leading-none" aria-hidden="true">{icon}</div>
        <div className="text-gray-800 leading-tight">
          <div className="font-medium">{high}°</div>
          <div className="text-xs text-gray-500">{low}°</div>
        </div>
      </div>

      {/* Date and Day */}
      <div className="text-gray-800 text-right leading-tight">
        <div className="font-medium">{date}</div>
        <div className="text-xs text-gray-500">{day}</div>
      </div>
    </div>
  );
}
