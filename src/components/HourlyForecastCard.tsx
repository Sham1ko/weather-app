"use client";
import { getWeatherIcon } from "@/utils/weatherUtils";
import HourlyForecastCardSkeleton from "./HourlyForecastCardSkeleton";
import type { HourlyForecast } from "@/types/weather";

interface HourlyForecastCardProps {
  isFocused: boolean;
  city: string;
  loading: boolean;
  error: string | null;
  hourlyData?: HourlyForecast[];
}

export default function HourlyForecastCard({
  isFocused,
  city,
  loading,
  error,
  hourlyData = [],
}: HourlyForecastCardProps) {
  if (loading) {
    return <HourlyForecastCardSkeleton isFocused={isFocused} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
        <div className="text-red-600 text-center py-2 text-sm">
          Ошибка загрузки: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg flex flex-col grow">
      {/* Header */}
      <div className="mb-3">
        <h3
          className={`text-gray-800 font-bold ${
            isFocused ? "text-xl" : "text-lg"
          }`}
        >
          Прогноз на день
        </h3>
      </div>

      {/* Hourly Forecast */}
      {hourlyData.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 w-full">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className="text-center p-1.5 rounded-lg"
            >
              <div className="text-xs text-gray-500 mb-0.5">{hour.time}</div>
              <div className="text-xl leading-none mb-0.5" aria-hidden="true">
                {getWeatherIcon(hour.icon)}
              </div>
              <div className="text-base font-semibold text-gray-800 leading-tight">
                {hour.temp}°
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {hour.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 text-gray-500 w-full text-sm">
          Нет данных о почасовом прогнозе
        </div>
      )}
    </div>
  );
}