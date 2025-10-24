import type { HourlyForecast } from "@/types/weather";

export const mockWeatherData = {
  name: "Алматы",
  main: {
    temp: 22,
    humidity: 65,
  },
  weather: [
    {
      description: "ясно",
      icon: "01d",
    },
  ],
  wind: {
    speed: 3.2,
  },
};

export const mockForecastData = {
  list: [
    {
      dt: Date.now() / 1000,
      dt_txt: new Date().toISOString().split("T")[0] + " 12:00:00",
      main: {
        temp: 22,
        temp_max: 25,
        temp_min: 18,
        humidity: 65,
      },
      weather: [
        {
          description: "ясно",
          icon: "01d",
        },
      ],
      wind: {
        speed: 3.2,
      },
    },
    {
      dt: Date.now() / 1000 + 86400,
      dt_txt:
        new Date(Date.now() + 86400 * 1000).toISOString().split("T")[0] +
        " 12:00:00",
      main: {
        temp: 20,
        temp_max: 23,
        temp_min: 16,
        humidity: 70,
      },
      weather: [
        {
          description: "переменная облачность",
          icon: "02d",
        },
      ],
      wind: {
        speed: 2.8,
      },
    },
    {
      dt: Date.now() / 1000 + 172800,
      dt_txt:
        new Date(Date.now() + 172800 * 1000).toISOString().split("T")[0] +
        " 12:00:00",
      main: {
        temp: 18,
        temp_max: 21,
        temp_min: 14,
        humidity: 75,
      },
      weather: [
        {
          description: "дождь",
          icon: "10d",
        },
      ],
      wind: {
        speed: 4.1,
      },
    },
    {
      dt: Date.now() / 1000 + 259200,
      dt_txt:
        new Date(Date.now() + 259200 * 1000).toISOString().split("T")[0] +
        " 12:00:00",
      main: {
        temp: 16,
        temp_max: 19,
        temp_min: 12,
        humidity: 80,
      },
      weather: [
        {
          description: "пасмурно",
          icon: "04d",
        },
      ],
      wind: {
        speed: 3.5,
      },
    },
    {
      dt: Date.now() / 1000 + 345600,
      dt_txt:
        new Date(Date.now() + 345600 * 1000).toISOString().split("T")[0] +
        " 12:00:00",
      main: {
        temp: 19,
        temp_max: 22,
        temp_min: 15,
        humidity: 68,
      },
      weather: [
        {
          description: "ясно",
          icon: "01d",
        },
      ],
      wind: {
        speed: 2.9,
      },
    },
  ],
};

export const mockHourlyData: HourlyForecast[] = [
  {
    time: "12:00",
    temp: 22,
    icon: "01d",
    description: "ясно",
  },
  {
    time: "15:00",
    temp: 24,
    icon: "01d",
    description: "ясно",
  },
  {
    time: "18:00",
    temp: 21,
    icon: "02d",
    description: "переменная облачность",
  },
  {
    time: "21:00",
    temp: 18,
    icon: "02n",
    description: "переменная облачность",
  },
  {
    time: "00:00",
    temp: 16,
    icon: "01n",
    description: "ясно",
  },
  {
    time: "03:00",
    temp: 14,
    icon: "01n",
    description: "ясно",
  },
  {
    time: "06:00",
    temp: 15,
    icon: "01d",
    description: "ясно",
  },
  {
    time: "09:00",
    temp: 19,
    icon: "01d",
    description: "ясно",
  },
];
