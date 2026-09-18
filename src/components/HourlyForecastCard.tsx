"use client";
import HourlyForecastCardSkeleton from "./HourlyForecastCardSkeleton";
import WeatherIcon from "@/components/WeatherIcon";
import type { HourlyForecast } from "@/types/weather";

interface HourlyForecastCardProps {
  isFocused: boolean;
  loading: boolean;
  hourlyData?: HourlyForecast[];
}

export default function HourlyForecastCard({
  isFocused,
  loading,
  hourlyData = [],
}: HourlyForecastCardProps) {
  if (loading) {
    return <HourlyForecastCardSkeleton isFocused={isFocused} />;
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 shadow-sm flex flex-col grow">
      {/* Header */}
      <div className="mb-4">
        <h3
          className={`text-ink font-semibold ${
            isFocused ? "text-xl" : "text-lg"
          }`}
        >
          Прогноз на день
        </h3>
      </div>

      {/* Hourly Forecast */}
      {hourlyData.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-2 gap-y-3 w-full">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className="text-center p-1.5 rounded-lg"
            >
              <div className="text-xs text-ink-muted mb-0.5">{hour.time}</div>
              <div className="mb-0.5" aria-hidden="true">
                <WeatherIcon
                  code={hour.icon}
                  size={22}
                  className="text-ink-secondary mx-auto"
                />
              </div>
              <div className="text-base font-semibold text-ink leading-tight tabular-nums">
                {hour.temp}°
              </div>
              <div className="text-[11px] text-ink-muted truncate">
                {hour.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line py-6 px-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-ink-muted"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-sm font-medium text-ink">
            Нет данных о почасовом прогнозе
          </p>
          <p className="text-xs text-ink-muted">
            Попробуйте обновить данные позже
          </p>
        </div>
      )}
    </div>
  );
}