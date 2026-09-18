"use client";
import { useState, useEffect } from "react";
import { capitalizeFirst } from "@/utils/weatherUtils";
import WeatherIcon from "@/components/WeatherIcon";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface RedisStatus {
  available: boolean;
  enabled?: boolean;
}

interface LocationWeatherCardProps {
  onRedisStatus?: (status: RedisStatus) => void;
}

export default function LocationWeatherCard({
  onRedisStatus,
}: LocationWeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Инкремент в обработчике «Повторить» запускает effect заново
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchWeatherByLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Используем Vercel geolocation для определения города пользователя
        const response = await fetch("/api/weather-by-location");

        if (!response.ok) {
          setError("Не удалось загрузить погоду");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setWeather(data.weather);
        if (typeof data.redisAvailable === "boolean") {
          onRedisStatus?.({
            available: data.redisAvailable,
            enabled: data.redisEnabled,
          });
        }
      } catch (err) {
        console.error("Ошибка при получении погоды:", err);
        setError("Не удалось загрузить погоду");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherByLocation();
  }, [retryCount]);

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        aria-live="polite"
        className="bg-surface rounded-2xl border border-line p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">
              Не удалось определить город
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Разрешите доступ к геолокации или найдите город вручную
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="shrink-0 text-sm font-medium text-primary hover:text-primary-strong focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300 rounded-lg px-3 py-2"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="shrink-0" aria-hidden="true">
          <WeatherIcon
            code={weather.weather[0].icon}
            size={40}
            className="text-ink-secondary"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{weather.name}</h3>
          <p className="text-gray-600 text-sm">
            {capitalizeFirst(weather.weather[0].description)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            {Math.round(weather.main.temp)}°C
          </p>
        </div>
      </div>
    </div>
  );
}
