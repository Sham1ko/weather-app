"use client";

import WeatherIcon from "@/components/WeatherIcon";

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
      className={`flex items-center justify-between px-3 py-2 rounded-xl ${
        isSelected
          ? "bg-primary-soft border border-indigo-100"
          : "border border-transparent"
      }`}
    >
      {/* Weather Icon */}
      <div className="flex items-center space-x-2.5">
        <div aria-hidden="true">
          <WeatherIcon
            code={icon}
            size={22}
            className="text-ink-secondary"
          />
        </div>
        <div className="text-ink leading-tight">
          <div className="font-medium">{high}°</div>
          <div className="text-xs text-ink-secondary">{low}°</div>
        </div>
      </div>

      {/* Date and Day */}
      <div className="text-ink text-right leading-tight">
        <div className="font-medium">{date}</div>
        <div className="text-xs text-ink-secondary">{day}</div>
      </div>
    </div>
  );
}
