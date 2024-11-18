import { Metadata } from "next";
import "./style.css";
import MainInfoCard from "@/components/WeatherInfo/MainInfoCard";
import ForecastCard from "@/components/Forecast/ForecastCard";
import WeatherDetailsCard from "@/components/WeatherInfo/WeatherDetails/WeatherDetailsCard";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  return {
    title: `Weather in ${city}`,
    description: `Current weather in ${city}`,
  };
}

async function fetchWeather(city: string) {
  const appid = process.env.OPENWEATHERMAP_API_KEY;
  // const response = await fetch(
  //   `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=metric`,
  //   { next: { revalidate: 60 } }
  // );

  // if (!response.ok) {
  //   throw new Error("City not found");
  // }

  // const data = await response.json();

  const data = {
    coord: {
      lon: 76.95,
      lat: 43.25,
    },
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03n",
      },
    ],
    base: "stations",
    main: {
      temp: 24.95,
      feels_like: 24.39,
      temp_min: 24.95,
      temp_max: 24.95,
      pressure: 1011,
      humidity: 34,
      sea_level: 1011,
      grnd_level: 887,
    },
    visibility: 10000,
    wind: {
      speed: 2,
      deg: 130,
    },
    clouds: {
      all: 40,
    },
    dt: 1724767060,
    sys: {
      type: 1,
      id: 8818,
      country: "KZ",
      sunrise: 1724717465,
      sunset: 1724765806,
    },
    timezone: 18000,
    id: 1526384,
    name: "Almaty",
    cod: 200,
  };
  return data;
}

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  try {
    const weather = await fetchWeather(city);
    const todayDate = new Date();

    return (
      <main className="w-full bg-gray-50 flex-1 flex justify-center">
        <div className="container py-8 flex gap-4 xl:px-40">
          <div className="basis-2/3 space-y-8 flex flex-col">
            <MainInfoCard weatherInfo={weather} />
            <WeatherDetailsCard />
          </div>
          <div className="basis-1/3">
            <ForecastCard />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="h-full w-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl text-center mb-6">Weather in {city}</h1>
        <p className="text-red-500 text-center">
          City not found. Please try another search.
        </p>
      </main>
    );
  }
}
