"use client";

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  isVisible: boolean;
}

export default function WeatherCard({
  city,
  temperature,
  humidity,
  windSpeed,
  description,
  isVisible,
}: WeatherCardProps) {
  return (
    <div
      className={`max-w-3xl w-full md:max-w-lg flex flex-col bg-white rounded-xl border border-gray-200 p-10 transition-all duration-500 ease-in-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      <h2 className="text-2xl font-medium">Погода в {city}</h2>
      <div className="mt-4 space-y-2">
        <p className="text-lg text-gray-700">
          <span className="font-medium">Температура:</span>{" "}
          {Math.round(temperature)}°C
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Описание:</span> {description}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Влажность:</span> {humidity}%
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Ветер:</span>{" "}
          {Math.round(windSpeed * 3.6)} км/ч
        </p>
      </div>
    </div>
  );
}
