"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import WeatherCard from "@/components/WeatherCard";
import WeatherSearchForm from "@/components/WeatherSearchForm";
import MultiDayForecastCard from "@/components/MultiDayForecastCard";
import HourlyForecastCard from "@/components/HourlyForecastCard";
import LocationWeatherCard from "@/components/LocationWeatherCard";
import RedisStatusBadge from "@/components/RedisStatusBadge";
import { useI18n } from "@/i18n/LocaleProvider";
import { processHourlyForecastData } from "@/utils/weatherUtils";
import type {
  HourlyForecast,
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
} from "@/types/weather";

// Обновляет адрес страницы, не создавая дубликаты в истории:
// повторный поиск и кнопка «Обновить» URL не меняют
function syncUrl(city: string | null) {
  const url = city ? `/?city=${encodeURIComponent(city)}` : "/";
  if (window.location.pathname + window.location.search !== url) {
    window.history.pushState(null, "", url);
  }
}

// Ключи словаря с текстами ошибок: храним ключ, а не текст —
// формулировка берётся на языке интерфейса в момент отрисовки
type ErrorKey =
  | "error.notFound"
  | "error.rateLimited"
  | "error.unavailable"
  | "error.generic"
  | "error.connection"
  | "error.unknown";

// Переводит код ответа API в ключ словаря с подсказкой, что делать дальше
function getErrorKey(status: number): ErrorKey {
  if (status === 404) {
    return "error.notFound";
  }
  if (status === 429) {
    return "error.rateLimited";
  }
  if (status >= 500) {
    return "error.unavailable";
  }
  return "error.generic";
}

export default function Home() {
  const { locale, t } = useI18n();
  // nonce меняется при сбросе на главную, чтобы перемонтировать форму
  // и очистить введённый город
  const [searchNonce, setSearchNonce] = useState(0);
  // Город, который сейчас показан: источник сравнения для URL-навигации
  const currentCityRef = useRef<string | null>(null);
  // Зеркало локали для обработчиков, живущих вне рендера
  const localeRef = useRef(locale);
  const [weatherData, setWeatherData] =
    useState<OpenWeatherCurrentResponse | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [forecastData, setForecastData] =
    useState<OpenWeatherForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [redisAvailable, setRedisAvailable] = useState<boolean | null>(null);
  const [redisEnabled, setRedisEnabled] = useState<boolean | null>(null);
  // Момент последнего обновления данных (timestamp из ответа API)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  const handleSearch = async (
    city: string,
    options?: { bypassCache?: boolean }
  ) => {
    setLoading(true);
    setError(null);
    currentCityRef.current = city;
    syncUrl(city);
    // Сбрасываем данные прошлого запроса, чтобы при ошибке не показывать
    // старый город вместе с сообщением об ошибке
    setWeatherData(null);
    setForecastData(null);
    setHourlyData([]);
    setFetchedAt(null);
    setIsSubmitted(true);
    setIsFocused(true); // Сразу устанавливаем фокус при начале загрузки

    try {
      // Загружаем данные о погоде и прогнозе одним запросом;
      // bypassCache=1 заставляет сервер игнорировать свежий кэш
      const params = new URLSearchParams({ city });
      params.set("lang", localeRef.current);
      if (options?.bypassCache) {
        params.set("refresh", "1");
      }
      const response = await fetch(`/api/weather-data?${params.toString()}`);

      if (!response.ok) {
        setError(getErrorKey(response.status));
        return;
      }

      const {
        weather: weatherData,
        forecast: forecastData,
        fetchedAt,
        redisAvailable: redisStatus,
        redisEnabled,
      } = await response.json();

      setWeatherData(weatherData);
      setForecastData(forecastData);
      if (typeof fetchedAt === "number") {
        setFetchedAt(fetchedAt);
      }
      if (typeof redisStatus === "boolean") {
        setRedisAvailable(redisStatus);
      }
      if (typeof redisEnabled === "boolean") {
        setRedisEnabled(redisEnabled);
      }

      // Обрабатываем данные почасового прогноза
      const processedHourlyData = processHourlyForecastData(
        forecastData,
        localeRef.current
      );
      setHourlyData(processedHourlyData);
    } catch (error) {
      console.error("Ошибка при получении данных о погоде:", error);
      if (error instanceof TypeError) {
        // fetch бросает TypeError при сетевой ошибке (нет соединения и т.п.)
        setError("error.connection");
      } else {
        setError("error.unknown");
      }
    } finally {
      setLoading(false);
    }
  };

  // Обновление по кнопке в карточке: повторный запрос с обходом кэша
  const handleRefresh = () => {
    if (weatherData?.name && !loading) {
      handleSearch(weatherData.name, { bypassCache: true });
    }
  };

  // Клик по лого: полный сброс к стартовому экрану
  const handleHomeClick = () => {
    setLoading(false);
    setError(null);
    currentCityRef.current = null;
    syncUrl(null);
    setWeatherData(null);
    setForecastData(null);
    setHourlyData([]);
    setFetchedAt(null);
    setIsSubmitted(false);
    setIsFocused(false);
    setRedisAvailable(null);
    setRedisEnabled(null);
    setSearchNonce((nonce) => nonce + 1);
  };

  // URL — источник правды для навигации: шареная ссылка запускает поиск,
  // назад/вперёд переключают города, сброс лого возвращает на "/"
  useEffect(() => {
    const applyUrl = () => {
      const city = new URLSearchParams(window.location.search).get("city");
      if (city && city !== currentCityRef.current) {
        currentCityRef.current = city;
        handleSearch(city);
      } else if (!city && currentCityRef.current !== null) {
        currentCityRef.current = null;
        handleHomeClick();
      }
    };

    applyUrl();
    window.addEventListener("popstate", applyUrl);
    return () => window.removeEventListener("popstate", applyUrl);
    // handleSearch/handleHomeClick читают только сеттеры и ref —
    // замыкание первого рендера не устаревает
  }, []);

  // Обновляем ref для обработчиков, живущих вне рендера
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  // Смена языка: перезапрашиваем текущий город, чтобы описания API
  // пришли на новом языке (из Redis-кэша — мгновенно)
  useEffect(() => {
    if (currentCityRef.current) {
      handleSearch(currentCityRef.current);
    }
    // handleSearch читает только сеттеры и ref — замыкание не устаревает
  }, [locale]);

  return (
    <>
      <Header onHomeClick={handleHomeClick} loading={loading} />
      <main className="flex flex-col gap-5 justify-center items-center h-full w-full pb-6">
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

      {/* Статус кэша показываем только после поиска: до него это шум для пользователя */}
      {isSubmitted && redisEnabled !== false && (
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
          className="max-w-3xl w-full md:max-w-lg flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg p-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 mt-0.5 text-rose-500 dark:text-rose-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p className="text-rose-600 dark:text-rose-400 text-sm">{t(error)}</p>
        </div>
      )}

      {(weatherData || loading) && (
        <div className="flex flex-col lg:flex-row gap-5 w-full max-w-5xl items-stretch">
          <div className="lg:w-2/3 flex flex-col justify-between gap-5">
            <WeatherCard
              city={weatherData?.name || ""}
              temperature={weatherData?.main.temp || 0}
              feelsLike={weatherData?.main.feels_like ?? 0}
              humidity={weatherData?.main.humidity || 0}
              windSpeed={weatherData?.wind.speed || 0}
              windDeg={weatherData?.wind.deg ?? 0}
              description={weatherData?.weather[0].description || ""}
              icon={weatherData?.weather[0].icon || "01d"}
              fetchedAt={fetchedAt}
              onRefresh={handleRefresh}
              loading={loading}
            />
            <HourlyForecastCard
              isFocused={isFocused}
              loading={loading}
              hourlyData={hourlyData}
            />
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <MultiDayForecastCard
              isFocused={isFocused}
              loading={loading}
              forecastData={forecastData}
            />
          </div>
        </div>
      )}
      </main>
    </>
  );
}
