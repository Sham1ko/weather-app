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
      <div
        className={`bg-red-50 border border-red-200 rounded-xl transition-all duration-500 ease-in-out transform h-full ${
          isFocused ? "p-8 scale-100 shadow-2xl" : "p-6 scale-90 shadow-lg"
        }`}
      >
        <div className="text-red-600 text-center py-4">
          Ошибка загрузки прогноза: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full flex flex-col ${
        isFocused ? "p-8 scale-100 shadow-2xl" : "p-6 scale-90 shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3
          className={`text-gray-800 font-bold transition-all duration-500 ease-in-out ${
            isFocused ? "text-3xl" : "text-2xl"
          }`}
        >
          Forecast
        </h3>
      </div>

      {/* Forecast List */}
      <div className="flex-1 flex flex-col justify-between gap-2">
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
