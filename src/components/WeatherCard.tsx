"use client";
"use client";
import { useEffect, useState } from "react";
import {
  capitalizeFirst,
  formatUpdatedAt,
  getWeatherIcon,
  getWindDirection,
} from "@/utils/weatherUtils";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";

interface WeatherCardProps {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  fetchedAt?: number | null;
  onRefresh?: () => void;
  isVisible: boolean;
  loading: boolean;
}

export default function WeatherCard({
  city,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  windDeg,
  description,
  icon,
  fetchedAt,
  onRefresh,
  isVisible,
  loading,
}: WeatherCardProps) {
  // Тикаем каждые 30 секунд, чтобы «Обновлено N мин назад» не устаревало
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (loading) {
    return <WeatherCardSkeleton />;
  }

  return (
    <div className="flex flex-col grow bg-surface rounded-2xl border border-line p-5 shadow-sm">
      {/* Заголовок и иконка */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg text-gray-900 truncate">
            {city}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {capitalizeFirst(description)}
          </p>
          {typeof fetchedAt === "number" && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <span>Обновлено {formatUpdatedAt(fetchedAt, now)}</span>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label="Обновить данные"
                  title="Обновить"
                  className="rounded p-0.5 text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-4xl leading-none shrink-0" aria-hidden="true">
          {getWeatherIcon(icon)}
        </div>
      </div>

      {/* Температура и компактные детали в одну строку */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-4xl font-semibold text-gray-900 leading-none">
            {Math.round(temperature)}°C
          </div>
          <div className="text-sm text-gray-500 mt-1.5">
            Ощущается как {Math.round(feelsLike)}°
          </div>
        </div>
        <div className="flex gap-2">
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-1.5 text-center">
            <div className="text-[11px] text-gray-500 leading-tight">
              Влажность
            </div>
            <div className="text-sm font-medium text-gray-800">
              {humidity}%
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-1.5 text-center">
            <div className="text-[11px] text-gray-500 leading-tight">Ветер</div>
            <div className="text-sm font-medium text-gray-800">
              {Math.round(windSpeed * 3.6)} км/ч {getWindDirection(windDeg)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
