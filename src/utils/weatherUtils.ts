import {
  OpenWeatherForecastResponse,
  ForecastDayData,
  HourlyForecast,
} from "@/types/weather";

// Казахские описания условий по коду weather[0].id: в OpenWeather API
// казахского языка нет, группируем по диапазонам id (та же гранулярность,
// что у иконок)
export function describeCondition(id: number, locale: string): string | null {
  if (locale !== "kk") {
    return null;
  }
  if (id >= 200 && id < 300) return "Найзағай";
  if (id >= 300 && id < 400) return "Сұлық жаңбыр";
  if (id >= 500 && id < 600) return "Жаңбыр";
  if (id >= 600 && id < 700) return "Қар";
  if (id === 800) return "Ашық";
  if (id > 800 && id < 900) return "Бұлтты";
  if (id >= 700 && id < 800) return "Тұман";
  return null;
}

// Казахские названия месяцев и дней недели — свои, а не Intl:
// браузерное kk-форматирование ненадёжно (даёт «М09» и английские "Sat")
const KK_MONTHS = [
  "қаң.", "ақп.", "нау.", "сәу.", "мам.", "мау.",
  "шіл.", "там.", "қыр.", "қаз.", "қар.", "жел.",
];
const KK_WEEKDAYS = [
  "жек.", "дүй.", "сей.", "сәр.", "бей.", "жұм.", "сен.",
]; // индекс = getUTCDay(): 0 — воскресенье

export function formatDate(date: Date, locale: string): { date: string; day: string } {
  if (locale === "kk") {
    return {
      date: `${date.getUTCDate()} ${KK_MONTHS[date.getUTCMonth()]}`,
      day: KK_WEEKDAYS[date.getUTCDay()],
    };
  }

  // date уже сдвинута в рамку города: форматируем как UTC, чтобы
  // toLocaleDateString не сдвинул её обратно в часовой пояс зрителя
  const intlLocale = resolveIntlLocale(locale);
  const month = date.toLocaleDateString(intlLocale, {
    month: "short",
    timeZone: "UTC",
  });
  const day = date.getUTCDate();
  const dayName = date.toLocaleDateString(intlLocale, {
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

// Румбы ветра: API отдаёт угол в градусах (откуда дует ветер), 8 румбов.
// Казахские сокращения (С/СШ/Ш/ОШ/О/ОБ/Б/СБ) — помечено на проверку носителем
const WIND_POINTS: Record<string, string[]> = {
  ru: ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"],
  kk: ["С", "СШ", "Ш", "ОШ", "О", "ОБ", "Б", "СБ"],
  en: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
};

export function getWindDirection(deg: number, locale = "ru"): string {
  const points = WIND_POINTS[locale] ?? WIND_POINTS.ru;
  return points[Math.round(deg / 45) % 8];
}

// Не у всех браузеров есть kk-данные в Intl (проверено: в некоторых
// сборках Chromium их нет) — даты и склонения тогда показываем по-русски:
// для аудитории КЗ это понятнее английского фолбэка
function resolveIntlLocale(locale: string): string {
  if (
    locale !== "ru" &&
    locale !== "en" &&
    Intl.DateTimeFormat.supportedLocalesOf([locale]).length === 0
  ) {
    return "ru";
  }
  return locale;
}

// «Обновлено N минут назад» — склонения берёт ICU по локали;
// для только что случившегося обновления передаём словарную метку
export function formatUpdatedAt(
  timestamp: number,
  locale: string,
  justNowLabel: string,
  now: number = Date.now()
): string {
  const minutes = Math.floor((now - timestamp) / 60_000);
  if (minutes < 1) {
    return justNowLabel;
  }
  // В казахском после числительного существительное не склоняется,
  // поэтому относительное время собираем сами — RTF("kk") в браузерах
  // тоже ненадёжен
  if (locale === "kk") {
    if (minutes < 60) {
      return `${minutes} минут бұрын`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} сағат бұрын`;
    }
    return `${Math.floor(hours / 24)} күн бұрын`;
  }
  const rtf = new Intl.RelativeTimeFormat(resolveIntlLocale(locale), {
    numeric: "auto",
  });
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
  apiData: OpenWeatherForecastResponse,
  locale: string
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
    .slice(0, 5) // Ровно 5 строк под заголовок «Прогноз на 5 дней»;
    // частичный хвостовой день из окна API не показываем
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
        cityLocalDate(dayData[0].dt_txt, timezoneOffsetSeconds),
        locale
      );

      return {
        date: formattedDate,
        day,
        // Сырой код иконки ("02d" и т.п.) — рендерит компонент WeatherIcon
        icon: middayData.weather[0].icon,
        high: Math.round(maxTemp),
        low: Math.round(minTemp),
        description:
          describeCondition(middayData.weather[0].id, locale) ??
          middayData.weather[0].description,
      };
    });

  return forecast;
}

export function processHourlyForecastData(
  apiData: OpenWeatherForecastResponse,
  locale: string
): HourlyForecast[] {
  const timezoneOffsetSeconds = apiData.city.timezone ?? 0;

  // Получаем данные на ближайшие 24 часа (8 записей по 3 часа);
  // часы — местные для города
  const hourlyData = apiData.list.slice(0, 8).map((item) => {
    const date = cityLocalDate(item.dt_txt, timezoneOffsetSeconds);
    const time = date.toLocaleTimeString(resolveIntlLocale(locale), {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

    return {
      time,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description:
        describeCondition(item.weather[0].id, locale) ??
        item.weather[0].description,
    };
  });

  return hourlyData;
}
