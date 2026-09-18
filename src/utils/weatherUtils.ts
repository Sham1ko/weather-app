import {
  OpenWeatherForecastResponse,
  ForecastDayData,
  HourlyForecast,
} from "@/types/weather";

export function formatDate(date: Date): { date: string; day: string } {
  // date уже сдвинута в рамку города: форматируем как UTC, чтобы
  // toLocaleDateString не сдвинул её обратно в часовой пояс зрителя
  const month = date.toLocaleDateString("ru", {
    month: "short",
    timeZone: "UTC",
  });
  const day = date.getUTCDate();
  const dayName = date.toLocaleDateString("ru", {
    weekday: "short",
    timeZone: "UTC",
  });

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

// dt_txt приходит в UTC. Сдвигаем слот на смещение города (city.timezone
// в секундах) и дальше работаем с ним как с UTC — так часы и даты
// показывают местное время города, а не зрителя и не UTC
function cityLocalDate(dtTxt: string, timezoneOffsetSeconds: number): Date {
  return new Date(
    new Date(dtTxt.replace(" ", "T") + "Z").getTime() +
      timezoneOffsetSeconds * 1000
  );
}

export function processForecastData(
  apiData: OpenWeatherForecastResponse
): ForecastDayData[] {
  const timezoneOffsetSeconds = apiData.city.timezone ?? 0;

  // Группируем слоты по календарным датам города; ISO-ключи "YYYY-MM-DD"
  // идут в хронологическом порядке и сортируются лексикографически
  const dailyData: {
    [key: string]: OpenWeatherForecastResponse["list"][number][];
  } = {};

  apiData.list.forEach((item) => {
    const key = cityLocalDate(item.dt_txt, timezoneOffsetSeconds)
      .toISOString()
      .slice(0, 10);
    if (!dailyData[key]) {
      dailyData[key] = [];
    }
    dailyData[key].push(item);
  });

  // Преобразуем в наш формат
  const forecast: ForecastDayData[] = Object.keys(dailyData)
    .sort()
    .slice(0, 6) // Берем только первые 6 дней
    .map((key) => {
      const dayData = dailyData[key];
      const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max));
      const minTemp = Math.min(...dayData.map((item) => item.main.temp_min));

      // Берем слот из середины дня по городскому времени (12:00–15:00)
      const middayData =
        dayData.find((item) => {
          const hour = cityLocalDate(
            item.dt_txt,
            timezoneOffsetSeconds
          ).getUTCHours();
          return hour >= 12 && hour <= 15;
        }) || dayData[Math.floor(dayData.length / 2)];

      const { date: formattedDate, day } = formatDate(
        cityLocalDate(dayData[0].dt_txt, timezoneOffsetSeconds)
      );

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
  const timezoneOffsetSeconds = apiData.city.timezone ?? 0;

  // Получаем данные на ближайшие 24 часа (8 записей по 3 часа);
  // часы — местные для города
  const hourlyData = apiData.list.slice(0, 8).map((item) => {
    const date = cityLocalDate(item.dt_txt, timezoneOffsetSeconds);
    const time = date.toLocaleTimeString("ru", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
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
