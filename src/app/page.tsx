"use client";
import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import WeatherSearchForm from "@/components/WeatherSearchForm";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setIsVisible(false);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка API: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);

      // Добавляем небольшую задержку для плавной анимации
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    } catch (error) {
      console.error("Ошибка при получении данных о погоде:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при загрузке данных"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container flex flex-col gap-10 justify-center items-center mx-auto h-[calc(100vh-64px)]">
      <WeatherSearchForm onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="max-w-3xl w-full md:max-w-lg flex flex-col bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {weatherData && (
        <WeatherCard
          city={weatherData.name}
          temperature={weatherData.main.temp}
          humidity={weatherData.main.humidity}
          windSpeed={weatherData.wind.speed}
          description={weatherData.weather[0].description}
          isVisible={isVisible}
        />
      )}
    </main>
  );
}
