import type { Dictionary } from "./ru";

const en: Dictionary = {
  "app.name": "Aspan",
  "header.home": "Go home",
  "header.theme.light": "Switch to light theme",
  "header.theme.dark": "Switch to dark theme",
  "header.language": "Language",
  "search.label": "Search city",
  "search.placeholder": "e.g. Almaty…",
  "search.button": "Search",
  "search.loading": "Loading…",
  "weather.humidity": "Humidity",
  "weather.wind": "Wind",
  "weather.windUnit": "km/h",
  "weather.feelsLike": "Feels like {t}°",
  "weather.updated": "Updated {t}",
  "weather.updatedJustNow": "just now",
  "weather.refresh": "Refresh data",
  "forecast.daily": "Today's forecast",
  "forecast.multiDay": "5-day forecast",
  "hourly.emptyTitle": "No hourly forecast data",
  "hourly.emptyHint": "Try refreshing the data later",
  "location.failedTitle": "Could not detect your city",
  "location.failedHint": "Allow geolocation or search for a city manually",
  "location.retry": "Retry",
  "redis.unavailable": "Cache unavailable, data may load slower",
  "error.notFound": "City not found. Check the name and try again.",
  "error.rateLimited":
    "Too many requests to the weather service. Wait a moment and try again.",
  "error.unavailable":
    "The weather service is temporarily unavailable. Try again a bit later.",
  "error.generic": "Could not load the weather. Try again a bit later.",
  "error.connection":
    "No connection to the server. Check your internet connection and try again.",
  "error.unknown":
    "Something went wrong while loading the weather. Try again a bit later.",
};

export default en;
