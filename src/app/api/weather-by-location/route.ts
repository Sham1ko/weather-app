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
import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { city } = geolocation(request);

  // Если город не определен, используем Алматы по умолчанию
  const targetCity = city || "Almaty";

  const cacheKey = `weatherByLocation:${targetCity.toLowerCase()}`;

  try {
    const cached = await safeRedisGet(cacheKey);

    if (cached) {
      console.log("Cached data found for city:", targetCity);
      return NextResponse.json({
        ...JSON.parse(cached),
        redisAvailable: isRedisAvailable(),
        redisEnabled: isRedisEnabled(),
      });
    }

    // Получаем только текущую погоду (без прогноза)
    const weatherResponse = await fetchOpenWeather("/weather", {
      q: targetCity,
    });

    if (!weatherResponse.ok) {
      // Если не удалось получить погоду для определенного города, пробуем Алматы
      if (city && city !== "Алматы") {
        const almatyResponse = await fetchOpenWeather("/weather", {
          q: "Алматы",
        });
        if (almatyResponse.ok) {
          const weatherData = await almatyResponse.json();
          return NextResponse.json({
            weather: weatherData,
            redisAvailable: isRedisAvailable(),
            redisEnabled: isRedisEnabled(),
          });
        }
      }

      const errorData = await weatherResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Ошибка получения данных о погоде" },
        { status: weatherResponse.status }
      );
    }

    const weatherData = await weatherResponse.json();

    await cacheWeatherPayload(
      cacheKey,
      JSON.stringify({ weather: weatherData })
    );

    return NextResponse.json({
      weather: weatherData,
      redisAvailable: isRedisAvailable(),
      redisEnabled: isRedisEnabled(),
    });
  } catch (error) {
    return respondWithWeatherError(error, `${cacheKey}:stale`);
  }
}
