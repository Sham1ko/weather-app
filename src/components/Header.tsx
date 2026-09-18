import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-semibold text-ink">Weather App</h1>
      <ThemeToggle />
    </header>
  );
}
