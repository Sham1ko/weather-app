import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "Город не указан" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API ключ не настроен" },
        { status: 500 }
      );
    }

    // Загружаем данные о погоде и прогнозе параллельно
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=ru`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=ru`
      ),
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

    return NextResponse.json({
      weather: weatherData,
      forecast: forecastData,
    });
  } catch (error) {
    console.error("Ошибка API:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
