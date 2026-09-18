import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="flex items-center gap-2.5 text-2xl font-semibold text-ink">
        <Logo className="h-8 w-8" />
        Weather App
      </h1>
      <ThemeToggle />
    </header>
  );
}
