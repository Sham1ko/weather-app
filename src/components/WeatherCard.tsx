"use client";
import { getWeatherIcon } from "@/utils/weatherUtils";
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
    return <WeatherCardSkeleton isVisible={isVisible} />;
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full p-8 shadow-lg ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex justify-between items-start">
        <h2 className="font-medium transition-all duration-500 ease-in-out text-4xl">
          Погода в {city}
        </h2>
        <div className="transition-all duration-500 ease-in-out text-6xl">
          {getWeatherIcon(icon)}
        </div>
      </div>
      <div className="mt-4 space-y-2 transition-all duration-500 ease-in-out">
        <p className="text-gray-700 transition-all duration-500 ease-in-out text-2xl">
          <span className="font-medium">Температура:</span>{" "}
          {Math.round(temperature)}°C
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Описание:</span> {description}
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Влажность:</span> {humidity}%
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Ветер:</span>{" "}
          {Math.round(windSpeed * 3.6)} км/ч
        </p>
      </div>
    </div>
  );
}
