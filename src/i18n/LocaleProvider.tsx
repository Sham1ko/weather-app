"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import ru, { type Dictionary } from "./dictionaries/ru";
import kk from "./dictionaries/kk";
import en from "./dictionaries/en";

export type Locale = "kk" | "ru" | "en";

const DICTIONARIES: Record<Locale, Dictionary> = { kk, ru, en };
const LOCALE_STORAGE_KEY = "locale";
const LOCALE_EVENT = "localechange";

// Кэш снятого значения: localStorage читаем один раз, дальше отдаём копию
let cachedLocale: Locale | null = null;

function getSnapshot(): Locale {
  if (cachedLocale) {
    return cachedLocale;
  }
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "kk" || stored === "ru" || stored === "en") {
      cachedLocale = stored;
    }
  } catch (error) {
    // Приватный режим — работает дефолт
    void error;
  }
  cachedLocale = cachedLocale ?? "ru";
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  // На сервере сохранённая локаль неизвестна — пререндерим русский
  return "ru";
}

/** Текущая локаль для кода вне React (обработчики, утилиты). */
export function getLocale(): Locale {
  return getSnapshot();
}

function subscribe(callback: () => void) {
  const invalidate = () => {
    cachedLocale = null;
    callback();
  };
  // "storage" приходит из других вкладок — язык меняется всюду сразу
  window.addEventListener(LOCALE_EVENT, callback);
  window.addEventListener("storage", invalidate);
  return () => {
    window.removeEventListener(LOCALE_EVENT, callback);
    window.removeEventListener("storage", invalidate);
  };
}

type I18n = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Dictionary, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    cachedLocale = next;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch (error) {
      // Приватный режим — выбор не переживёт перезагрузку
      void error;
    }
    document.documentElement.lang = next;
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  const t = useCallback(
    (
      key: keyof Dictionary,
      params?: Record<string, string | number>
    ): string => {
      let text: string = DICTIONARIES[locale][key];
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  // Синхронизируем <html lang> с текущей локалью
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
}
