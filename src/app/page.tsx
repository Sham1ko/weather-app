"use client";
import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import WeatherSearchForm from "@/components/WeatherSearchForm";
import MultiDayForecastCard from "@/components/MultiDayForecastCard";
import HourlyForecastCard from "@/components/HourlyForecastCard";
import LocationWeatherCard from "@/components/LocationWeatherCard";
import RedisStatusBadge from "@/components/RedisStatusBadge";
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
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// Переводит код ответа API в понятный текст с подсказкой, что делать дальше
function getFriendlyErrorMessage(status: number): string {
  if (status === 404) {
    return "Город не найден. Проверьте название и попробуйте ещё раз.";
  }
  if (status === 429) {
    return "Слишком много запросов к сервису погоды. Подождите немного и попробуйте ещё раз.";
  }
  if (status >= 500) {
    return "Сервис погоды временно недоступен. Попробуйте ещё раз чуть позже.";
  }
  return "Не удалось получить погоду. Попробуйте ещё раз чуть позже.";
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
  const [redisAvailable, setRedisAvailable] = useState<boolean | null>(null);
  const [redisEnabled, setRedisEnabled] = useState<boolean | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setIsSubmitted(true);
    setIsFocused(true); // Сразу устанавливаем фокус при начале загрузки

    // Сразу показываем карточку погоды при начале загрузки
    if (!isVisible) {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }

    try {
      // Загружаем данные о погоде и прогнозе одним запросом
      const response = await fetch(
        `/api/weather-data?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error(getFriendlyErrorMessage(response.status));
      }

      const {
        weather: weatherData,
        forecast: forecastData,
        redisAvailable: redisStatus,
        redisEnabled,
      } = await response.json();

      setWeatherData(weatherData);
      setForecastData(forecastData);
      if (typeof redisStatus === "boolean") {
        setRedisAvailable(redisStatus);
      }
      if (typeof redisEnabled === "boolean") {
        setRedisEnabled(redisEnabled);
      }

      // Обрабатываем данные почасового прогноза
      const processedHourlyData = processHourlyForecastData(forecastData);
      setHourlyData(processedHourlyData);

      // isVisible уже установлен в начале функции
    } catch (error) {
      console.error("Ошибка при получении данных о погоде:", error);
      if (error instanceof TypeError) {
        // fetch бросает TypeError при сетевой ошибке (нет соединения и т.п.)
        setError(
          "Нет соединения с сервером. Проверьте подключение к интернету и попробуйте ещё раз."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Что-то пошло не так при загрузке погоды. Попробуйте ещё раз чуть позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 justify-center items-center h-full w-full pb-4">
      {/* Карточка погоды по геолокации видна только до первого поиска */}
      {!isSubmitted && (
        <div className="w-full max-w-md">
          <LocationWeatherCard
            onRedisStatus={({ available, enabled }) => {
              setRedisAvailable(available);
              if (typeof enabled === "boolean") {
                setRedisEnabled(enabled);
              }
            }}
          />
        </div>
      )}

      {redisEnabled !== false && (
        <RedisStatusBadge available={redisAvailable} />
      )}

      <WeatherSearchForm
        onSearch={handleSearch}
        loading={loading}
        isFocused={isFocused}
        isSubmitted={isSubmitted}
      />

      {error && (
        <div
          aria-live="polite"
          className="max-w-3xl w-full md:max-w-lg flex flex-col bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {(weatherData || loading) && (
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl items-stretch">
          <div className="lg:w-2/3 flex flex-col justify-between">
            <WeatherCard
              city={weatherData?.name || ""}
              temperature={weatherData?.main.temp || 0}
              humidity={weatherData?.main.humidity || 0}
              windSpeed={weatherData?.wind.speed || 0}
              description={weatherData?.weather[0].description || ""}
              icon={weatherData?.weather[0].icon || "01d"}
              isVisible={isVisible}
              loading={loading}
            />
            <HourlyForecastCard
              isFocused={isFocused}
              city={weatherData?.name || ""}
              loading={loading}
              error={error}
              hourlyData={hourlyData}
            />
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <MultiDayForecastCard
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
