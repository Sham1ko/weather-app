"use client";
import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";
import WeatherSearchForm from "@/components/WeatherSearchForm";
import WeatherForecast from "@/components/WeatherForecast";
import DailyForecast from "@/components/DailyForecast";
import { processHourlyForecastData } from "@/utils/weatherUtils";
import {
  mockWeatherData,
  mockForecastData,
  mockHourlyData,
} from "@/utils/mockData";
import type { HourlyForecast } from "@/types/weather";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setIsSubmitted(true);

    // Сразу показываем карточку погоды при начале загрузки
    if (!isVisible) {
      setTimeout(() => {
        setIsVisible(true);
        // Устанавливаем фокус на карточку погоды
        setTimeout(() => {
          setIsFocused(true);
        }, 200);
      }, 100);
    }

    try {
      // Загружаем данные о погоде и прогнозе одним запросом
      const response = await fetch(
        `/api/weather-data?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка API: ${response.status}`);
      }

      const { weather: weatherData, forecast: forecastData } =
        await response.json();

      setWeatherData(weatherData);
      setForecastData(forecastData);

      // Обрабатываем данные почасового прогноза
      const processedHourlyData = processHourlyForecastData(forecastData);
      setHourlyData(processedHourlyData);

      // isVisible уже установлен в начале функции
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

  const handleMock = () => {
    setLoading(true);
    setError(null);
    setIsSubmitted(true);

    // Сразу показываем карточку погоды при начале загрузки
    if (!isVisible) {
      setTimeout(() => {
        setIsVisible(true);
        // Устанавливаем фокус на карточку погоды
        setTimeout(() => {
          setIsFocused(true);
        }, 200);
      }, 100);
    }

    // Имитируем задержку загрузки
    setTimeout(() => {
      setWeatherData(mockWeatherData);
      setForecastData(mockForecastData);
      setHourlyData(mockHourlyData);

      setLoading(false);
    }, 4000);
  };

  return (
    <main className="container flex flex-col gap-10 justify-center items-center mx-auto h-full pb-10">
      <WeatherSearchForm
        onSearch={handleSearch}
        onMock={handleMock}
        loading={loading}
        isFocused={isFocused}
        isSubmitted={isSubmitted}
      />

      {error && (
        <div className="max-w-3xl w-full md:max-w-lg flex flex-col bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {(weatherData || loading) && (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
          <div className="lg:w-3/4 flex flex-col gap-4 h-full">
            <div className="flex-1">
              {loading ? (
                <WeatherCardSkeleton
                  isVisible={isVisible}
                  isFocused={isFocused}
                />
              ) : weatherData ? (
                <WeatherCard
                  city={weatherData.name}
                  temperature={weatherData.main.temp}
                  humidity={weatherData.main.humidity}
                  windSpeed={weatherData.wind.speed}
                  description={weatherData.weather[0].description}
                  icon={weatherData.weather[0].icon}
                  isVisible={isVisible}
                  isFocused={isFocused}
                />
              ) : null}
            </div>
            <div className="flex-1">
              <DailyForecast
                isFocused={isFocused}
                city={weatherData?.name || ""}
                loading={loading}
                error={error}
                hourlyData={hourlyData}
              />
            </div>
          </div>
          <div className="lg:w-1/4 h-full">
            <WeatherForecast
              isFocused={isFocused}
              city={weatherData?.name || ""}
              loading={loading}
              error={error}
              forecastData={forecastData}
            />
          </div>
        </div>
      )}
    </main>
  );
}
