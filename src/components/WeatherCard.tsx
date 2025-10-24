"use client";
import { getWeatherIcon } from "@/utils/weatherUtils";

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isVisible: boolean;
  isFocused: boolean;
}

export default function WeatherCard({
  city,
  temperature,
  humidity,
  windSpeed,
  description,
  icon,
  isVisible,
  isFocused,
}: WeatherCardProps) {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 transition-all duration-500 ease-in-out transform h-full ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${isFocused ? "p-8 scale-100 shadow-2xl" : "p-6 scale-90 shadow-lg"}`}
    >
      <div className="flex justify-between items-start">
        <h2
          className={`font-medium transition-all duration-500 ease-in-out ${
            isFocused ? "text-4xl" : "text-2xl"
          }`}
        >
          Погода в {city}
        </h2>
        <div
          className={`transition-all duration-500 ease-in-out ${
            isFocused ? "text-6xl" : "text-4xl"
          }`}
        >
          {getWeatherIcon(icon)}
        </div>
      </div>
      <div
        className={`mt-4 space-y-2 transition-all duration-500 ease-in-out ${
          isFocused ? "space-y-4" : "space-y-2"
        }`}
      >
        <p
          className={`text-gray-700 transition-all duration-500 ease-in-out ${
            isFocused ? "text-2xl" : "text-lg"
          }`}
        >
          <span className="font-medium">Температура:</span>{" "}
          {Math.round(temperature)}°C
        </p>
        <p
          className={`text-gray-500 transition-all duration-500 ease-in-out ${
            isFocused ? "text-lg" : "text-sm"
          }`}
        >
          <span className="font-medium">Описание:</span> {description}
        </p>
        <p
          className={`text-gray-500 transition-all duration-500 ease-in-out ${
            isFocused ? "text-lg" : "text-sm"
          }`}
        >
          <span className="font-medium">Влажность:</span> {humidity}%
        </p>
        <p
          className={`text-gray-500 transition-all duration-500 ease-in-out ${
            isFocused ? "text-lg" : "text-sm"
          }`}
        >
          <span className="font-medium">Ветер:</span>{" "}
          {Math.round(windSpeed * 3.6)} км/ч
        </p>
      </div>
    </div>
  );
}
