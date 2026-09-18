import type { Dictionary } from "./ru";

// Переводы — рабочие формулировки; спорные места стоит прогнать
// носителем (напр. «Ылғалдылық», «Күндік болжам»).
const kk: Dictionary = {
  "app.name": "Weather App",
  "header.home": "Басты бетке",
  "header.theme.light": "Ашық тақырыпты қосу",
  "header.theme.dark": "Қараңғы тақырыпты қосу",
  "header.language": "Тіл",
  "search.label": "Қала іздеу",
  "search.placeholder": "Мысалы, Алматы…",
  "search.button": "Іздеу",
  "search.loading": "Жүктелуде…",
  "weather.humidity": "Ылғалдылық",
  "weather.wind": "Жел",
  "weather.windUnit": "км/сағ",
  "weather.feelsLike": "Сезіледі: {t}°",
  "weather.updated": "Жаңартылды {t}",
  "weather.updatedJustNow": "дәл қазір",
  "weather.refresh": "Деректерді жаңарту",
  "forecast.daily": "Күндік болжам",
  "forecast.multiDay": "5 күндік болжам",
  "hourly.emptyTitle": "Сағаттық болжам деректері жоқ",
  "hourly.emptyHint": "Деректерді кейінірек жаңартып көріңіз",
  "location.failedTitle": "Қаланы анықтау мүмкін болмады",
  "location.failedHint":
    "Геолокацияға рұқсат беріңіз немесе қаланы қолмен іздеңіз",
  "location.retry": "Қайталау",
  "redis.unavailable": "Кэш қолжетімсіз, деректер баяу жүктелуі мүмкін",
  "error.notFound": "Қала табылмады. Атауын тексеріп, қайта көріңіз.",
  "error.rateLimited":
    "Ауа райы қызметіне тым көп сұрау жіберілді. Азғана күтіп, қайта көріңіз.",
  "error.unavailable":
    "Ауа райы қызметі уақытша қолжетімсіз. Кейінірек қайта көріңіз.",
  "error.generic": "Ауа райын алу мүмкін болмады. Кейінірек қайта көріңіз.",
  "error.connection":
    "Сервермен байланыс жоқ. Интернет байланысын тексеріп, қайта көріңіз.",
  "error.unknown":
    "Ауа райын жүктеу кезінде бірдеңе дұрыс болмады. Кейінірек қайта көріңіз.",
};

export default kk;
