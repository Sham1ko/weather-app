"use client";
import { useI18n, type Locale } from "@/i18n/LocaleProvider";

const LOCALES: Locale[] = ["kk", "ru", "en"];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      className="flex items-center gap-0.5 rounded-full border border-line p-1"
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors ${
              active ? "bg-primary text-white" : "text-ink-secondary hover:text-ink"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
