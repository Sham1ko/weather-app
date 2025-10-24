import {
  OpenWeatherForecastResponse,
  WeatherForecast,
  HourlyForecast,
} from "@/types/weather";

export function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    "01d": "☀️", // clear sky day
    "01n": "🌙", // clear sky night
    "02d": "⛅", // few clouds day
    "02n": "☁️", // few clouds night
    "03d": "☁️", // scattered clouds
    "03n": "☁️", // scattered clouds
    "04d": "☁️", // broken clouds
    "04n": "☁️", // broken clouds
    "09d": "🌧️", // shower rain
    "09n": "🌧️", // shower rain
    "10d": "🌦️", // rain
    "10n": "🌧️", // rain
    "11d": "⛈️", // thunderstorm
    "11n": "⛈️", // thunderstorm
    "13d": "❄️", // snow
    "13n": "❄️", // snow
    "50d": "🌫️", // mist
    "50n": "🌫️", // mist
  };
  return iconMap[iconCode] || "🌤️";
}

export function formatDate(dateString: string): { date: string; day: string } {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en", { month: "short" });
  const day = date.getDate();
  const dayName = date.toLocaleDateString("en", { weekday: "short" });

  return {
    date: `${day} ${month}`,
    day: dayName,
  };
}

export function processForecastData(
  apiData: OpenWeatherForecastResponse
): WeatherForecast[] {
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
  const forecast: WeatherForecast[] = Object.keys(dailyData)
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
        icon: getWeatherIcon(middayData.weather[0].icon),
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
      icon: getWeatherIcon(item.weather[0].icon),
      description: item.weather[0].description,
    };
  });

  return hourlyData;
}
