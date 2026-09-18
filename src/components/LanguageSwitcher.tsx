"use client";
import { useI18n, type Locale } from "@/i18n/LocaleProvider";

// Внутри — коды языков (kk = ISO-код казахского), в интерфейсе —
// привычные обозначения: KZ это страна, а не язык
const LOCALES: { locale: Locale; label: string }[] = [
  { locale: "kk", label: "KZ" },
  { locale: "ru", label: "RU" },
  { locale: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      className="flex items-center gap-0.5 rounded-full border border-line p-1"
    >
      {LOCALES.map(({ locale: code, label }) => {
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
            {label}
          </button>
        );
      })}
    </div>
  );
}
