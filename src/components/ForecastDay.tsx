"use client";

interface ForecastDayProps {
  date: string;
  day: string;
  icon: string;
  high: number;
  low: number;
  description: string;
  isSelected?: boolean;
}

export default function ForecastDay({
  date,
  day,
  icon,
  high,
  low,
  description,
  isSelected = false,
}: ForecastDayProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 h-full ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      {/* Weather Icon */}
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="text-gray-800">
          <div className="font-medium">{high}°</div>
          <div className="text-sm text-gray-500">{low}°</div>
        </div>
      </div>

      {/* Date and Day */}
      <div className="text-gray-800 text-right">
        <div className="font-medium">{date}</div>
        <div className="text-sm text-gray-500">{day}</div>
      </div>
    </div>
  );
}
