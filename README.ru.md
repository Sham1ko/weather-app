<div align="center">

<img src="docs/icon.svg" width="88" alt="Aspan">

# Aspan

*каз. «небо»*

**Погодное приложение: текущая погода, почасовой и 5-дневный прогноз**

[English](README.md) | **Русский**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-кэш-DC382D?logo=redis&logoColor=white)](https://redis.io/)

[![kk](https://img.shields.io/badge/lang-kk-4f46e5)](#)
[![ru](https://img.shields.io/badge/lang-ru-4f46e5)](#)
[![en](https://img.shields.io/badge/lang-en-4f46e5)](#)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshot-dark.png">
  <img src="docs/screenshot-light.png" alt="Aspan — прогноз погоды для Алматы" width="100%">
</picture>

</div>

## Возможности

- **Текущая погода**, почасовой прогноз на 24 часа и прогноз на 5 дней
- **Автогеолокация** — до первого поиска показывается погода твоего города (Vercel geolocation)
- **Три языка** — казахский, русский, английский; описания погоды тоже переводятся, а для казахского есть собственный словарь условий
- **Время и даты — в часовом поясе города**, а не зрителя: почасовка и границы суток там, где живёт прогноз
- **Город в URL** — `?city=Алматы`: ссылками можно делиться, кнопки «назад/вперёд» переключают города
- **Redis-кэш** на час + недельный «аварийный» кэш, если OpenWeatherMap недоступен
- **Светлая и тёмная темы** с переключателем
- Скелетоны загрузки, понятные ошибки с подсказками и кнопкой повтора

## Быстрый старт

```bash
git clone https://github.com/sham1ko/weather-app.git
cd weather-app
pnpm install
cp .env.sample .env   # заполни OPENWEATHERMAP_API_KEY
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000).

### Переменные окружения

| Переменная | Обязательна | Описание |
|---|---|---|
| `OPENWEATHERMAP_API_KEY` | да | Ключ [OpenWeatherMap](https://openweathermap.org/api) — бесплатного тарифа достаточно |
| `REDIS_URL` | нет | Адрес Redis, по умолчанию `redis://localhost:6379` |
| `REDIS_ENABLED` | нет | `false` / `off` / `0` / `no` — полностью отключает кэш, все запросы идут в API |

## Скрипты

| Команда | Действие |
|---|---|
| `pnpm dev` | Запуск в режиме разработки |
| `pnpm build` | Продакшен-сборка |
| `pnpm start` | Запуск собранного приложения |
| `pnpm lint` | ESLint |

## Как устроено

- **OpenWeatherMap** — источники `/weather` и `/forecast`, язык описаний зависит от выбранного языка интерфейса (для казахского — собственный словарь условий по кодам погоды)
- **Redis** — кэш ответов на час и «stale»-копия на 7 дней: если OpenWeatherMap ляжет, приложение отдаст устаревшие данные и честно пометит их возраст
- **URL как состояние** — поиск пишет город в адрес (`pushState`), назад/вперёд и шареные ссылки работают без перезагрузки
- **i18n без библиотек** — типизированные словари (`ru` — источник типов для `kk`/`en`), `useSyncExternalStore` поверх `localStorage`, `Intl` для дат и склонений
- Даты и часы прогноза показываются в **часовом поясе города** (`city.timezone` из ответа API), метка «обновлено N минут назад» — в поясе зрителя

## Автор

[sham1ko](https://github.com/sham1ko) · Shamshyrak Zholdasbek
