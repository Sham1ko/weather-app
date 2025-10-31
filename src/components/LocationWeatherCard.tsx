"use client";
import { useState, useEffect } from "react";
import { getWeatherIcon } from "@/utils/weatherUtils";

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

export default function LocationWeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Ошибка при получении погоды:", err);
        setError("Не удалось загрузить погоду");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherByLocation();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md animate-pulse">
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
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="text-4xl">
          {getWeatherIcon(weather.weather[0].icon)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{weather.name}</h3>
          <p className="text-gray-600 text-sm capitalize">
            {weather.weather[0].description}
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
