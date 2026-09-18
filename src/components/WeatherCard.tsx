"use client";
import { capitalizeFirst, getWeatherIcon } from "@/utils/weatherUtils";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isVisible: boolean;
  loading: boolean;
}

export default function WeatherCard({
  city,
  temperature,
  humidity,
  windSpeed,
  description,
  icon,
  isVisible,
  loading,
}: WeatherCardProps) {
  if (loading) {
    return <WeatherCardSkeleton />;
  }

  return (
    <div className="flex flex-col grow bg-white rounded-xl border border-gray-200 p-4 shadow-lg">
      {/* Заголовок и иконка */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg text-gray-900 truncate">
            {city}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {capitalizeFirst(description)}
          </p>
        </div>
        <div className="text-4xl leading-none shrink-0">
          {getWeatherIcon(icon)}
        </div>
      </div>

      {/* Температура и компактные детали в одну строку */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-4xl font-semibold text-gray-900 leading-none">
          {Math.round(temperature)}°C
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
              {Math.round(windSpeed * 3.6)} км/ч
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
