"use client";
import { useState, useEffect } from "react";
import ForecastDay from "./ForecastDay";
import type { WeatherForecast } from "@/types/weather";

interface WeatherForecastProps {
  isFocused: boolean;
  city: string;
  loading: boolean;
  error: string | null;
}

export default function WeatherForecast({
  isFocused,
  city,
  loading,
  error,
}: WeatherForecastProps) {
  const [forecastData, setForecastData] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `/api/forecast?city=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка API: ${response.status}`);
        }

        const data = await response.json();

        // Импортируем утилиту для обработки данных
        const { processForecastData } = await import("@/utils/weatherUtils");
        const processedData = processForecastData(data);

        setForecastData(processedData);
      } catch (error) {
        console.error("Ошибка при получении прогноза:", error);
      }
    };

    if (city && !loading) {
      fetchForecast();
    }
  }, [city, loading]);

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full ${
          isFocused ? "p-8 scale-100 shadow-2xl" : "p-6 scale-90 shadow-lg"
        }`}
      >
        <div className="text-gray-600 text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          Загрузка прогноза...
        </div>
      </div>
    );
  }

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
      <div className="space-y-2 flex-1 overflow-y-auto">
        {forecastData.map((day, index) => (
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
