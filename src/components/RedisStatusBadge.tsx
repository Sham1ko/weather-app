"use client";
import { useI18n } from "@/i18n/LocaleProvider";

interface RedisStatusBadgeProps {
  available: boolean | null;
}

export default function RedisStatusBadge({
  available,
}: RedisStatusBadgeProps) {
  const { t } = useI18n();
  if (available !== false) {
    return null;
  }

  return (
    <div className="max-w-3xl w-full md:max-w-lg flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-full px-4 py-2 text-amber-700 dark:text-amber-400 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <span>{t("redis.unavailable")}</span>
    </div>
  );
}
