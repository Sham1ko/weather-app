import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onHomeClick: () => void;
  loading?: boolean;
}

export default function Header({ onHomeClick, loading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-semibold text-ink">
        <button
          type="button"
          onClick={onHomeClick}
          title="На главную"
          disabled={loading}
          className="group flex items-center gap-2.5 rounded-xl transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Logo className="h-8 w-8 shrink-0" />
          <span className="transition-colors group-hover:text-primary">
            Weather App
          </span>
        </button>
      </h1>
      <ThemeToggle />
    </header>
  );
}
