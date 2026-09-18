"use client";
import { useEffect, useState } from "react";
import {
  capitalizeFirst,
  formatUpdatedAt,
  getWindDirection,
} from "@/utils/weatherUtils";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";
import { useI18n } from "@/i18n/LocaleProvider";

interface WeatherCardProps {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
  fetchedAt?: number | null;
  onRefresh?: () => void;
  loading: boolean;
}

export default function WeatherCard({
  city,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  windDeg,
  description,
  icon,
  fetchedAt,
  onRefresh,
  loading,
}: WeatherCardProps) {
  // Тикаем каждые 30 секунд, чтобы «Обновлено N мин назад» не устаревало
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const { locale, t } = useI18n();
  if (loading) {
    return <WeatherCardSkeleton />;
  }

  return (
    <div className="flex flex-col grow bg-surface rounded-2xl border border-line p-5 shadow-sm">
      {/* Заголовок и иконка */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg text-ink truncate">
            {city}
          </h2>
          <p className="text-sm text-ink-secondary truncate">
            {capitalizeFirst(description)}
          </p>
          {typeof fetchedAt === "number" && (
            <div className="flex items-center gap-1 mt-1 text-xs text-ink-muted">
              <span>
                {t("weather.updated", {
                  t: formatUpdatedAt(
                    fetchedAt,
                    locale,
                    t("weather.updatedJustNow"),
                    now
                  ),
                })}
              </span>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label={t("weather.refresh")}
                  title={t("weather.refresh")}
                  className="rounded p-0.5 text-ink-muted hover:text-ink-secondary focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-indigo-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0" aria-hidden="true">
          <WeatherIcon code={icon} size={40} className="text-ink-secondary" />
        </div>
      </div>

      {/* Температура и компактные детали в одну строку */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-4xl font-semibold text-ink leading-none tabular-nums">
            {Math.round(temperature)}°C
          </div>
          <div className="text-sm text-ink-secondary mt-1.5 tabular-nums">
            {t("weather.feelsLike", { t: Math.round(feelsLike) })}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-ink-muted leading-tight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />
              </svg>
              {t("weather.humidity")}
            </div>
            <div className="text-sm font-medium text-ink tabular-nums">
              {humidity}%
            </div>
          </div>
          <div className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-ink-muted leading-tight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
              </svg>
              {t("weather.wind")}
            </div>
            <div className="text-sm font-medium text-ink tabular-nums">
              {Math.round(windSpeed * 3.6)} {t("weather.windUnit")}{" "}
              {getWindDirection(windDeg, locale)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
