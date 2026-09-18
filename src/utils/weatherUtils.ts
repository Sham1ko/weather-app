import {
  OpenWeatherForecastResponse,
  ForecastDayData,
  HourlyForecast,
} from "@/types/weather";

export function formatDate(dateString: string): { date: string; day: string } {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("ru", { month: "short" });
  const day = date.getDate();
  const dayName = date.toLocaleDateString("ru", { weekday: "short" });

  return {
    date: `${day} ${month}`,
    day: dayName,
  };
}

// Делает заглавной только первую букву. CSS-класс capitalize для русского
// текста не годится: он делает заглавной каждую букву («Облачно С Прояснениями»).
export function capitalizeFirst(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// Румбы ветра: API отдаёт угол в градусах (откуда дует ветер), 8 румбов
export function getWindDirection(deg: number): string {
  const points = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
  return points[Math.round(deg / 45) % 8];
}

// «Обновлено N минут назад» — склонение берёт на себя Intl.RelativeTimeFormat
export function formatUpdatedAt(timestamp: number, now: number = Date.now()): string {
  const minutes = Math.floor((now - timestamp) / 60_000);
  if (minutes < 1) {
    return "только что";
  }
  const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
  if (minutes < 60) {
    return rtf.format(-minutes, "minute");
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return rtf.format(-hours, "hour");
  }
  return rtf.format(-Math.floor(hours / 24), "day");
}

export function processForecastData(
  apiData: OpenWeatherForecastResponse
): ForecastDayData[] {
  // Группируем данные по дням
  const dailyData: { [key: string]: any[] } = {};

  apiData.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Получаем только дату
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  // Преобразуем в наш формат
  const forecast: ForecastDayData[] = Object.keys(dailyData)
    .slice(0, 6) // Берем только первые 6 дней
    .map((date) => {
      const dayData = dailyData[date];
      const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max));
      const minTemp = Math.min(...dayData.map((item) => item.main.temp_min));

      // Берем данные из середины дня (обычно 12:00 или ближайшее время)
      const middayData =
        dayData.find((item) => {
          const hour = new Date(item.dt_txt).getHours();
          return hour >= 12 && hour <= 15;
        }) || dayData[Math.floor(dayData.length / 2)];

      const { date: formattedDate, day } = formatDate(date);

      return {
        date: formattedDate,
        day,
        // Сырой код иконки ("02d" и т.п.) — рендерит компонент WeatherIcon
        icon: middayData.weather[0].icon,
        high: Math.round(maxTemp),
        low: Math.round(minTemp),
        description: middayData.weather[0].description,
      };
    });

  return forecast;
}

export function processHourlyForecastData(
  apiData: OpenWeatherForecastResponse
): HourlyForecast[] {
  // Получаем данные на ближайшие 24 часа (8 записей по 3 часа)
  const hourlyData = apiData.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt_txt);
    const time = date.toLocaleTimeString("ru", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      time,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    };
  });

  return hourlyData;
}
