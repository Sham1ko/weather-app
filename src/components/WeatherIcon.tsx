import type { ReactNode } from "react";

interface WeatherIconProps {
  /** Код иконки OpenWeatherMap: "01d", "02n", "10d", "13n", "50d" и т.д. */
  code: string;
  size?: number;
  className?: string;
}

const CLOUD =
  "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z";
const RAIN_CLOUD =
  "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242";

/* Лайновые иконки в стиле дизайн-системы (stroke 1.5, скруглённые концы).
   Ключ — первые две цифры кода OpenWeather; день/ночь различаются
   только для ясной погоды и малооблачья ("01d", "02n" и т.п.). */
const ICONS: Record<string, ReactNode> = {
  "01d": (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </>
  ),
  "01n": <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  "02d": (
    <>
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </>
  ),
  "02n": (
    <>
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
      <path d="M13.304 5.558a5 5 0 0 1 6.588 6.588" />
    </>
  ),
  "03": <path d={CLOUD} />,
  "04": (
    <>
      <path d={CLOUD} />
      <path d="M22 10a3 3 0 0 0-3-3" />
    </>
  ),
  "09": (
    <>
      <path d={RAIN_CLOUD} />
      <path d="M8 19v1" />
      <path d="M8 14v1" />
      <path d="M16 19v1" />
      <path d="M16 14v1" />
      <path d="M12 21v1" />
      <path d="M12 16v1" />
    </>
  ),
  "10": (
    <>
      <path d={RAIN_CLOUD} />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </>
  ),
  "11": (
    <>
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-3 5" />
    </>
  ),
  "13": (
    <>
      <path d={RAIN_CLOUD} />
      <path d="M8 15h.01" />
      <path d="M8 19h.01" />
      <path d="M12 17h.01" />
      <path d="M12 21h.01" />
      <path d="M16 15h.01" />
      <path d="M16 19h.01" />
    </>
  ),
  "50": (
    <>
      <path d="M3 9h18" />
      <path d="M5 13h14" />
      <path d="M7 17h10" />
    </>
  ),
};

export default function WeatherIcon({
  code,
  size = 24,
  className = "",
}: WeatherIconProps) {
  const group = code.slice(0, 2);
  // День/ночь различаются только у "01" и "02": ключ — либо полный код
  // ("01d"), либо сама группа ("03", "10"), у остальных день/ночь общие
  const key = group === "01" || group === "02" ? code : group;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[key] ?? ICONS["03"]}
    </svg>
  );
}
