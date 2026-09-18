"use client";
import { useState, useEffect } from "react";
import { capitalizeFirst } from "@/utils/weatherUtils";
import WeatherIcon from "@/components/WeatherIcon";
import { useI18n } from "@/i18n/LocaleProvider";

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

interface RedisStatus {
  available: boolean;
  enabled?: boolean;
}

interface LocationWeatherCardProps {
  onRedisStatus?: (status: RedisStatus) => void;
}

export default function LocationWeatherCard({
  onRedisStatus,
}: LocationWeatherCardProps) {
  const { locale, t } = useI18n();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Инкремент в обработчике «Повторить» запускает effect заново
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchWeatherByLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Используем Vercel geolocation для определения города пользователя
        const response = await fetch(`/api/weather-by-location?lang=${locale}`);

        if (!response.ok) {
          setError("Не удалось загрузить погоду");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setWeather(data.weather);
        if (typeof data.redisAvailable === "boolean") {
          onRedisStatus?.({
            available: data.redisAvailable,
            enabled: data.redisEnabled,
          });
        }
      } catch (err) {
        console.error("Ошибка при получении погоды:", err);
        setError("Не удалось загрузить погоду");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherByLocation();
    // locale: при смене языка перезапрашиваем, чтобы описания
    // пришли на новом языке
  }, [retryCount, locale]);

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          {/* иконка 40px, как WeatherIcon */}
          <div className="w-10 h-10 bg-line rounded-full"></div>
          <div className="flex-1">
            {/* name: text-lg = 28px, description: text-sm = 20px */}
            <div className="w-28 h-7 bg-line rounded"></div>
            <div className="w-32 h-5 bg-line rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        aria-live="polite"
        className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line p-6 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-ink-muted"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
          <path d="m2 2 20 20" />
        </svg>
        <p className="font-medium text-ink">{t("location.failedTitle")}</p>
        <p className="text-sm text-ink-secondary">
          {t("location.failedHint")}
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-1 inline-flex items-center justify-center bg-primary hover:bg-primary-strong text-white font-medium rounded-[10px] transition-colors focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300 text-sm px-4 py-2"
        >
          {t("location.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="shrink-0" aria-hidden="true">
          <WeatherIcon
            code={weather.weather[0].icon}
            size={40}
            className="text-ink-secondary"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{weather.name}</h3>
          <p className="text-ink-secondary text-sm">
            {capitalizeFirst(weather.weather[0].description)}
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
