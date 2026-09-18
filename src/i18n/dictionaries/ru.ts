// Русский словарь — источник типов: ключи отсюда обязательны
// в kk.ts и en.ts (проверяется компилятором).
const ru = {
  "app.name": "Aspan",
  "header.home": "На главную",
  "header.theme.light": "Включить светлую тему",
  "header.theme.dark": "Включить тёмную тему",
  "header.language": "Язык",
  "search.label": "Поиск города",
  "search.placeholder": "Например, Алматы…",
  "search.button": "Найти",
  "search.loading": "Загрузка…",
  "weather.humidity": "Влажность",
  "weather.wind": "Ветер",
  "weather.windUnit": "км/ч",
  "weather.feelsLike": "Ощущается как {t}°",
  "weather.updated": "Обновлено {t}",
  "weather.updatedJustNow": "только что",
  "weather.refresh": "Обновить данные",
  "forecast.daily": "Прогноз на день",
  "forecast.multiDay": "Прогноз на 5 дней",
  "hourly.emptyTitle": "Нет данных о почасовом прогнозе",
  "hourly.emptyHint": "Попробуйте обновить данные позже",
  "location.failedTitle": "Не удалось определить город",
  "location.failedHint":
    "Разрешите доступ к геолокации или найдите город вручную",
  "location.retry": "Повторить",
  "redis.unavailable": "Кэш недоступен, данные могут загружаться медленнее",
  "error.notFound": "Город не найден. Проверьте название и попробуйте ещё раз.",
  "error.rateLimited":
    "Слишком много запросов к сервису погоды. Подождите немного и попробуйте ещё раз.",
  "error.unavailable":
    "Сервис погоды временно недоступен. Попробуйте ещё раз чуть позже.",
  "error.generic":
    "Не удалось получить погоду. Попробуйте ещё раз чуть позже.",
  "error.connection":
    "Нет соединения с сервером. Проверьте подключение к интернету и попробуйте ещё раз.",
  "error.unknown":
    "Что-то пошло не так при загрузке погоды. Попробуйте ещё раз чуть позже.",
} as const;

export default ru;

// Значения — обычные строки, чтобы переводы не были обязаны
// дословно совпадать с русскими
export type Dictionary = { [K in keyof typeof ru]: string };
