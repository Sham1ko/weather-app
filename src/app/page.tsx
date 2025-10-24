"use client";
import { useState } from "react";
import WeatherCard from "@/components/WeatherCard";

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
  const [city, setCity] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!city.trim()) return;

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
      <form
        className="max-w-3xl w-full md:max-w-lg flex flex-col bg-white rounded-xl border border-gray-200 backdrop-blur-md p-10"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="large-input"
          className="text-4xl flex justify-center mb-5"
        >
          Search city
        </label>
        <input
          type="text"
          id="large-input"
          className="p-4 border border-gray-300 rounded-lg"
          placeholder="Enter city"
          value={city}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Загрузка..." : "Search"}
        </button>
      </form>

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
