import {
  cacheWeatherPayload,
  fetchOpenWeather,
  respondWithWeatherError,
} from "@/lib/openweather";
import {
  isRedisAvailable,
  isRedisEnabled,
  safeRedisGet,
} from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "Город не указан" }, { status: 400 });
  }

  const cacheKey = `weather:${city.toLowerCase()}`;

  // refresh=1 — принудительное обновление по запросу пользователя:
  // пропускаем свежий кэш, но после загрузки перезаписываем его
  const bypassCache = searchParams.get("refresh") === "1";

  if (!bypassCache) {
    const cached = await safeRedisGet(cacheKey);
    if (cached) {
      console.log("Cached data found for city:", city);
      return NextResponse.json({
        ...JSON.parse(cached),
        redisAvailable: isRedisAvailable(),
      });
    }
  }

  try {
    // Загружаем данные о погоде и прогнозе параллельно
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetchOpenWeather("/weather", { q: city }),
      fetchOpenWeather("/forecast", { q: city }),
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Ошибка получения данных о погоде" },
        { status: weatherResponse.status }
      );
    }

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Ошибка получения прогноза" },
        { status: forecastResponse.status }
      );
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    // fetchedAt попадает в кэш, чтобы после cache-hit клиент знал возраст данных
    const fetchedAt = Date.now();
    const payload = JSON.stringify({
      weather: weatherData,
      forecast: forecastData,
      fetchedAt,
    });
    await cacheWeatherPayload(cacheKey, payload);

    return NextResponse.json({
      weather: weatherData,
      forecast: forecastData,
      fetchedAt,
      redisAvailable: isRedisAvailable(),
      redisEnabled: isRedisEnabled(),
    });
  } catch (error) {
    return respondWithWeatherError(error, `${cacheKey}:stale`);
  }
}
