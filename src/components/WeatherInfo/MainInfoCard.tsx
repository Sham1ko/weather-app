import Image from "next/image";
import Card from "@/components/ui/Card";

type MainInfoCardProps = {
  weatherInfo: WeatherInfoType;
};

type WeatherInfoType = {
  name: string;
  main: {
    temp: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  dt: number;
};

export default function MainInfoCard({ weatherInfo }: MainInfoCardProps) {
  const localDate = new Date((weatherInfo.dt + weatherInfo.timezone) * 1000);

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Форматируем дату
  const formattedDate = `${weekDays[localDate.getUTCDay()]}, ${String(
    localDate.getUTCDate()
  ).padStart(2, "0")} ${
    months[localDate.getUTCMonth()]
  } ${localDate.getUTCFullYear()}`;

  return (
    <Card className="basis-1/2 h-full flex flex-col">
      <div className="basis-1/2 flex flex-row justify-between">
        <div className="flex flex-col h-full">
          <span className="block font-medium text-3xl">
            {weatherInfo.name}, {weatherInfo.sys.country}
          </span>
          <span className="block font-semibold text-gray-500">
            {formattedDate}
          </span>
          <span className="block text-6xl font-medium mt-auto">
            {Math.ceil(weatherInfo.main.temp)}°
          </span>
        </div>
        <div className="flex items-center">
          <Image
            src="/sun.png"
            alt=""
            // sizes="100vw"
            width={150}
            height={150} // Это соотношение сторон
            priority
          />
        </div>
      </div>
      <div className="basis-1/2"></div>
    </Card>
  );
}
