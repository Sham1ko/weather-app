"use client";
import { useState, useEffect } from "react";
import MultiDayForecastItem from "./MultiDayForecastItem";
import MultiDayForecastItemSkeleton from "./MultiDayForecastItemSkeleton";
import type { ForecastDayData } from "@/types/weather";

interface MultiDayForecastCardProps {
  isFocused: boolean;
  city: string;
  loading: boolean;
  error: string | null;
  forecastData?: any;
}

export default function MultiDayForecastCard({
  isFocused,
  city,
  loading,
  error,
  forecastData: rawForecastData,
}: MultiDayForecastCardProps) {
  const [forecastData, setForecastData] = useState<ForecastDayData[]>([]);

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
          Прогноз на 5 дней
        </h3>
      </div>

      {/* Forecast List */}
      <div className="flex flex-col gap-1.5">
        {loading
          ? // Показываем skeleton во время загрузки
            Array.from({ length: 6 }).map((_, index) => (
              <MultiDayForecastItemSkeleton
                key={`skeleton-${index}`}
                isSelected={index === 0}
              />
            ))
          : forecastData.map((day, index) => (
              <MultiDayForecastItem
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
