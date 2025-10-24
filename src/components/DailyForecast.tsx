"use client";
import { getWeatherIcon } from "@/utils/weatherUtils";
import type { HourlyForecast } from "@/types/weather";

interface DailyForecastProps {
  isFocused: boolean;
  city: string;
  loading: boolean;
  error: string | null;
  hourlyData?: HourlyForecast[];
}

export default function DailyForecast({
  isFocused,
  city,
  loading,
  error,
  hourlyData = [],
}: DailyForecastProps) {
  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full ${
          isFocused ? "p-6 scale-100 shadow-2xl" : "p-4 scale-90 shadow-lg"
        }`}
      >
        <div className="text-gray-600 text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
          Загрузка почасового прогноза...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl transition-all duration-500 ease-in-out transform h-full ${
          isFocused ? "p-6 scale-100 shadow-2xl" : "p-4 scale-90 shadow-lg"
        }`}
      >
        <div className="text-red-600 text-center py-2 text-sm">
          Ошибка загрузки: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full flex flex-col ${
        isFocused ? "p-6 scale-100 shadow-2xl" : "p-4 scale-90 shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3
          className={`text-gray-800 font-bold transition-all duration-500 ease-in-out ${
            isFocused ? "text-xl" : "text-lg"
          }`}
        >
          Прогноз на день
        </h3>
      </div>

      {/* Hourly Forecast */}
      <div className="flex-1 flex items-center">
        {hourlyData.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 w-full">
            {hourlyData.map((hour, index) => (
              <div
                key={index}
                className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-xs text-gray-500 mb-1">{hour.time}</div>
                <div className="text-lg mb-1">{getWeatherIcon(hour.icon)}</div>
                <div className="text-sm font-medium text-gray-800">
                  {hour.temp}°
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {hour.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 w-full">
            Нет данных о почасовом прогнозе
          </div>
        )}
      </div>
    </div>
  );
}
