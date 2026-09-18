import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/i18n/LocaleProvider";

interface HeaderProps {
  onHomeClick: () => void;
  loading?: boolean;
}

export default function Header({ onHomeClick, loading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-semibold text-ink">
        <LogoButton onHomeClick={onHomeClick} loading={loading} />
      </h1>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}

// Лого + название — одна кнопка сброса на стартовый экран
function LogoButton({
  onHomeClick,
  loading,
}: {
  onHomeClick: () => void;
  loading?: boolean;
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onHomeClick}
      title={t("header.home")}
      disabled={loading}
      className="group flex items-center gap-2.5 rounded-xl transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Logo className="h-8 w-8 shrink-0" />
      <span className="transition-colors group-hover:text-primary">
        {t("app.name")}
      </span>
    </button>
  );
}
