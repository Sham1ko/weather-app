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
    return <WeatherCardSkeleton />;
  }

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 h-full p-8 shadow-lg">
      <div className="flex justify-between items-start">
        <h2 className="font-medium text-4xl">Weather in {city}</h2>
        <div className="text-6xl">{getWeatherIcon(icon)}</div>
      </div>
      <div className="mt-4 space-y-2 transition-all duration-500 ease-in-out">
        <p className="text-gray-700 transition-all duration-500 ease-in-out text-2xl">
          <span className="font-medium">Temperature:</span>{" "}
          {Math.round(temperature)}°C
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Description:</span> {description}
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Humidity:</span> {humidity}%
        </p>
        <p className="text-gray-500 transition-all duration-500 ease-in-out text-lg">
          <span className="font-medium">Wind:</span>{" "}
          {Math.round(windSpeed * 3.6)} km/h
        </p>
      </div>
    </div>
  );
}
