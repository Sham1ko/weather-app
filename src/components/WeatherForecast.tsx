"use client";
import { useState, useEffect } from "react";
import ForecastDay from "./ForecastDay";
import ForecastDaySkeleton from "./ForecastDaySkeleton";
import type { WeatherForecast } from "@/types/weather";

interface WeatherForecastProps {
  isFocused: boolean;
  city: string;
  loading: boolean;
  error: string | null;
  forecastData?: any;
}

export default function WeatherForecast({
  isFocused,
  city,
  loading,
  error,
  forecastData: rawForecastData,
}: WeatherForecastProps) {
  const [forecastData, setForecastData] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    if (rawForecastData) {
      // Импортируем утилиту для обработки данных
      import("@/utils/weatherUtils").then(({ processForecastData }) => {
        const processedData = processForecastData(rawForecastData);
        setForecastData(processedData);
      });
    }
  }, [rawForecastData]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
        <div className="text-red-600 text-center py-2 text-sm">
          Ошибка загрузки прогноза: {error}
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
          Forecast
        </h3>
      </div>

      {/* Forecast List */}
      <div className="flex flex-col gap-1.5">
        {loading
          ? // Показываем skeleton во время загрузки
            Array.from({ length: 5 }).map((_, index) => (
              <ForecastDaySkeleton
                key={`skeleton-${index}`}
                isSelected={index === 0}
              />
            ))
          : forecastData.map((day, index) => (
              <ForecastDay
                key={`${day.date}-${day.day}`}
                date={day.date}
                day={day.day}
                icon={day.icon}
                high={day.high}
                low={day.low}
                description={day.description}
                isSelected={index === 0} // Выделяем первый день
              />
            ))}
      </div>
    </div>
  );
}
