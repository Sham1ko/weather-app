"use client";
import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function subscribe(callback: () => void) {
  window.addEventListener("themechange", callback);
  return () => window.removeEventListener("themechange", callback);
}

export default function ThemeToggle() {
  // На сервере тема неизвестна (null) — рисуем плейсхолдер, чтобы верстка
  // не прыгала; реальное значение берём из класса на <html>.
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => null as Theme | null
  );

  const toggle = useCallback(() => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      // Приватный режим — выбор просто не сохранится
      void error;
    }
    window.dispatchEvent(new Event("themechange"));
  }, []);

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex items-center justify-center rounded-[10px] p-2 text-ink-secondary hover:text-ink hover:bg-line transition-colors focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300"
    >
      {theme === null ? (
        <span className="w-[18px] h-[18px]" aria-hidden="true" />
      ) : isDark ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
