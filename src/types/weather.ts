export interface ForecastDayData {
  date: string;
  day: string;
  icon: string;
  high: number;
  low: number;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  description: string;
}

// Форма ответа OpenWeather /weather, используемая приложением (подмножество)
export interface OpenWeatherCurrentResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

// Форма ответа OpenWeather /forecast, используемая приложением (подмножество)
export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    // Смещение города от UTC в секундах (учитывает DST на момент запроса)
    timezone: number;
  };
}
