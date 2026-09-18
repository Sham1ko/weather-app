"use client";
import { useState, useEffect } from "react";
import MultiDayForecastItem from "./MultiDayForecastItem";
import MultiDayForecastItemSkeleton from "./MultiDayForecastItemSkeleton";
import type { ForecastDayData } from "@/types/weather";

interface MultiDayForecastCardProps {
  isFocused: boolean;
  loading: boolean;
  forecastData?: any;
}

export default function MultiDayForecastCard({
  isFocused,
  loading,
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

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm flex flex-col grow">
      {/* Header */}
      <div className="mb-4">
        <h3
          className={`text-ink font-semibold ${
            isFocused ? "text-xl" : "text-lg"
          }`}
        >
          Прогноз на 5 дней
        </h3>
      </div>

      {/* Forecast List */}
      <div className="flex flex-col gap-2">
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
