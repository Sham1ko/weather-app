"use client";
import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import WeatherSearchForm from "@/components/WeatherSearchForm";
import WeatherForecast from "@/components/WeatherForecast";
import DailyForecast from "@/components/DailyForecast";
import { processHourlyForecastData } from "@/utils/weatherUtils";
import type { HourlyForecast } from "@/types/weather";

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
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    // Не сбрасываем isVisible и isFocused для сохранения layout
    // setWeatherData(null);
    // setHourlyData([]);
    // setIsVisible(false);
    // setIsFocused(false);

    try {
      // Загружаем данные о погоде и прогнозе параллельно
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
      ]);

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(
          errorData.error || `Ошибка API: ${weatherResponse.status}`
        );
      }

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(
          errorData.error || `Ошибка прогноза: ${forecastResponse.status}`
        );
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeatherData(weatherData);

      // Обрабатываем данные почасового прогноза
      const processedHourlyData = processHourlyForecastData(forecastData);
      setHourlyData(processedHourlyData);

      // Устанавливаем состояния только если они еще не установлены
      if (!isVisible) {
        setTimeout(() => {
          setIsVisible(true);
          // Устанавливаем фокус на карточку погоды
          setTimeout(() => {
            setIsFocused(true);
          }, 200);
        }, 100);
      }
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
    <main className="container flex flex-col gap-10 justify-center items-center mx-auto h-full pb-10">
      <WeatherSearchForm
        onSearch={handleSearch}
        loading={loading}
        isFocused={isFocused}
        isSubmitted={!!weatherData}
      />

      {error && (
        <div className="max-w-3xl w-full md:max-w-lg flex flex-col bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {weatherData && (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
          <div className="lg:w-3/4 flex flex-col gap-4 h-full">
            <div className="flex-1">
              <WeatherCard
                city={weatherData.name}
                temperature={weatherData.main.temp}
                humidity={weatherData.main.humidity}
                windSpeed={weatherData.wind.speed}
                description={weatherData.weather[0].description}
                isVisible={isVisible}
                isFocused={isFocused}
              />
            </div>
            <div className="flex-1">
              <DailyForecast
                isFocused={isFocused}
                city={weatherData.name}
                loading={loading}
                error={error}
                hourlyData={hourlyData}
              />
            </div>
          </div>
          <div className="lg:w-1/4 h-full">
            <WeatherForecast
              isFocused={isFocused}
              city={weatherData.name}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </main>
  );
}
