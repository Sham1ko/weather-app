import redis from "@/lib/redis";
import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { city } = geolocation(request);

    // Если город не определен, используем Алматы по умолчанию
    const targetCity = city || "Almaty";

    const cacheKey = `weatherByLocation:${targetCity.toLowerCase()}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("Cached data found for city:", targetCity);
      return NextResponse.json(JSON.parse(cached));
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API ключ не настроен" },
        { status: 500 }
      );
    }

    // Получаем только текущую погоду (без прогноза)
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        targetCity
      )}&appid=${apiKey}&units=metric&lang=ru`
    );

    if (!weatherResponse.ok) {
      // Если не удалось получить погоду для определенного города, пробуем Алматы
      if (city && city !== "Алматы") {
        const almatyResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Алматы&appid=${apiKey}&units=metric&lang=ru`
        );
        if (almatyResponse.ok) {
          const weatherData = await almatyResponse.json();
          return NextResponse.json({ weather: weatherData });
        }
      }

      const errorData = await weatherResponse.json();
      return NextResponse.json(
        { error: errorData.message || "Ошибка получения данных о погоде" },
        { status: weatherResponse.status }
      );
    }

    const weatherData = await weatherResponse.json();

    await redis.set(cacheKey, JSON.stringify({ weather: weatherData }), {
      EX: 3600,
    });

    return NextResponse.json({
      weather: weatherData,
    });
  } catch (error) {
    console.error("Ошибка API:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
