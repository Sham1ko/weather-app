export interface WeatherForecast {
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

export interface WeatherForecastData {
  forecast: WeatherForecast[];
  isFocused: boolean;
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
