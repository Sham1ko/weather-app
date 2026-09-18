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
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

// OpenWeatherMap API Response Types
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
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}
