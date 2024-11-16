import { Metadata } from "next";
import "./style.css";
import Image from "next/image";
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
      <main className="h-full w-full  bg-gradient-to-r from-[#0487E2] to-[#09B1EC]">
        <div className="flex flex-row space-x-8">
          <div className="basis-1/4 text-white p-4  bg-gray-800 bg-opacity-10 rounded-xl shadow-lg border border-white/20 backdrop-blur-md">
            <span className="font-semibold block text-lg">Current Weather</span>
            <span className="font-light block">6:00 PM</span>
            <div className="flex flex-row justify-between">
              <div className="flex">
                <Image
                  src="/sun.png"
                  width={100}
                  height={100}
                  alt={""}
                  priority
                />
              </div>
              <div className="flex flex-col justify-around">
                <div className="flex">
                  <span className="text-6xl font-semibold ">24</span>
                  <span className="font-light text-xl">°C</span>
                </div>
                <span className="font-light">Sunny</span>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-1/4">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 122.88 74.78"
                  className="fill-white"
                >
                  <g>
                    <path d="M28.69,53.38c-1.61,0-2.91-1.3-2.91-2.91c0-1.61,1.3-2.91,2.91-2.91h51.37c0.21,0,0.42,0.02,0.62,0.07 c1.84,0.28,3.56,0.8,5.1,1.63c1.7,0.92,3.15,2.19,4.27,3.89c3.85,5.83,3.28,11.24,0.56,15.24c-1.77,2.61-4.47,4.55-7.45,5.57 c-3,1.03-6.32,1.13-9.32,0.03c-4.54-1.66-8.22-5.89-8.76-13.55c-0.11-1.6,1.1-2.98,2.7-3.09c1.6-0.11,2.98,1.1,3.09,2.7 c0.35,4.94,2.41,7.56,4.94,8.48c1.71,0.62,3.67,0.54,5.48-0.08c1.84-0.63,3.48-1.79,4.52-3.32c1.49-2.19,1.71-5.28-0.61-8.79 c-0.57-0.86-1.31-1.51-2.18-1.98c-0.91-0.49-1.97-0.81-3.13-0.99H28.69L28.69,53.38z M15.41,27.21c-1.61,0-2.91-1.3-2.91-2.91 c0-1.61,1.3-2.91,2.91-2.91h51.21c1.17-0.18,2.23-0.5,3.14-0.99c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79 c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7 c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57 c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H15.41 L15.41,27.21z M2.91,40.3C1.3,40.3,0,38.99,0,37.39c0-1.61,1.3-2.91,2.91-2.91h107.07c1.17-0.18,2.23-0.5,3.13-0.99 c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08 c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55 c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89 c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H2.91L2.91,40.3z" />
                  </g>
                </svg>
                2 m/s
              </div>
              <div className="basis-1/4">
                <svg
                  fill="#fff"
                  height="40"
                  width="40"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 328.611 328.611"
                >
                  <g>
                    <path
                      d="M209.306,50.798c-2.452-3.337-7.147-4.055-10.485-1.602c-3.338,2.453-4.055,7.147-1.603,10.485
		c54.576,74.266,66.032,123.541,66.032,151.8c0,27.691-8.272,52.794-23.293,70.685c-17.519,20.866-42.972,31.446-75.651,31.446
		c-73.031,0-98.944-55.018-98.944-102.131c0-52.227,28.103-103.234,51.679-136.829c25.858-36.847,52.11-61.415,52.37-61.657
		c3.035-2.819,3.209-7.565,0.39-10.6c-2.819-3.034-7.565-3.209-10.599-0.39c-1.11,1.031-27.497,25.698-54.254,63.765
		c-24.901,35.428-54.586,89.465-54.586,145.71c0,31.062,9.673,59.599,27.236,80.353c20.361,24.061,50.345,36.779,86.708,36.779
		c36.794,0,66.926-12.726,87.139-36.801c17.286-20.588,26.806-49.117,26.806-80.33C278.25,156.216,240.758,93.597,209.306,50.798z"
                    />
                    <path
                      d="M198.43,148.146l-95.162,95.162c-2.929,2.929-2.929,7.678,0,10.606c1.465,1.464,3.385,2.197,5.304,2.197
		s3.839-0.732,5.304-2.197l95.162-95.162c2.929-2.929,2.929-7.678,0-10.606C206.107,145.217,201.359,145.217,198.43,148.146z"
                    />
                    <path
                      d="M191.965,207.899c-13.292,0-24.106,10.814-24.106,24.106s10.814,24.106,24.106,24.106s24.106-10.814,24.106-24.106
		S205.257,207.899,191.965,207.899z M191.965,241.111c-5.021,0-9.106-4.085-9.106-9.106s4.085-9.106,9.106-9.106
		s9.106,4.085,9.106,9.106S196.986,241.111,191.965,241.111z"
                    />
                    <path
                      d="M125.178,194.162c13.292,0,24.106-10.814,24.106-24.106s-10.814-24.106-24.106-24.106s-24.106,10.814-24.106,24.106
		S111.886,194.162,125.178,194.162z M125.178,160.949c5.021,0,9.106,4.085,9.106,9.106s-4.085,9.106-9.106,9.106
		c-5.021,0-9.106-4.085-9.106-9.106S120.156,160.949,125.178,160.949z"
                    />
                  </g>
                </svg>
                34%
              </div>
              <div className="basis-1/4">pressure</div>
              <div className="basis-1/4">air quality</div>
            </div>
          </div>
          <div className="basis-2/4 bg-white">Current weather</div>
          <div className="basis-1/4 bg-white">Current weather</div>
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
