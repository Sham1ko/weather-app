import {
  isRedisAvailable,
  isRedisEnabled,
  safeRedisGet,
  safeRedisSet,
} from "@/lib/redis";
import { NextResponse } from "next/server";

const OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5";
const REQUEST_TIMEOUT_MS = 8000;
const STALE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 дней

/**
 * Ошибка сетевой недоступности OpenWeatherMap (DNS, TCP, TLS, таймаут).
 * Отличается от ошибок самого API (404 город не найден, 401 ключ и т.д.).
 */
export class WeatherServiceUnavailableError extends Error {
  constructor() {
    super("Сервис погоды временно недоступен. Попробуйте позже.");
    this.name = "WeatherServiceUnavailableError";
  }
}

/**
 * Запрос к OpenWeatherMap с таймаутом и типизированной сетевой ошибкой.
 * Ответы API с любым HTTP-статусом возвращаются как есть — их обрабатывает маршрут.
 */
export async function fetchOpenWeather(
  pathname: string,
  params: Record<string, string>
): Promise<Response> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    throw new Error("API ключ не настроен");
  }

  const url = new URL(`${OPENWEATHER_API_BASE}${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "ru");

  try {
    return await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    // Сюда попадают DNS-сбои, недоступность хоста и срабатывание таймаута.
    console.error(`OpenWeatherMap недоступен (${pathname}):`, error);
    throw new WeatherServiceUnavailableError();
  }
}

/**
 * Единая обработка ошибок маршрутов погоды:
 * сервис недоступен → 503 с понятным сообщением (+ устаревший кэш, если есть),
 * всё остальное → 500.
 */
export async function respondWithWeatherError(
  error: unknown,
  staleCacheKey?: string
) {
  if (error instanceof WeatherServiceUnavailableError) {
    if (staleCacheKey) {
      const stale = await safeRedisGet(staleCacheKey);
      if (stale) {
        console.warn(
          "Отдаём устаревший кэш из-за недоступности OpenWeatherMap:",
          staleCacheKey
        );
        return NextResponse.json({
          ...JSON.parse(stale),
          redisAvailable: isRedisAvailable(),
          redisEnabled: isRedisEnabled(),
          stale: true,
        });
      }
    }
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  if (error instanceof Error && error.message === "API ключ не настроен") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.error("Ошибка API:", error);
  return NextResponse.json(
    { error: "Внутренняя ошибка сервера" },
    { status: 500 }
  );
}

/** Записывает данные в два ключа: часовой (свежий) и недельный (аварийный). */
export async function cacheWeatherPayload(
  cacheKey: string,
  payload: string
): Promise<void> {
  await Promise.all([
    safeRedisSet(cacheKey, payload, { EX: 3600 }),
    safeRedisSet(`${cacheKey}:stale`, payload, { EX: STALE_TTL_SECONDS }),
  ]);
}
