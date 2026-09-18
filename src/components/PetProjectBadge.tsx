import Link from "next/link";

export default function PetProjectBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="https://github.com/sham1ko"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-surface px-4 py-3 rounded-xl shadow-sm border border-line hover:shadow-md group"
      >
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
            Pet Project
          </span>
          <span className="text-sm font-semibold text-ink group-hover:text-primary">
            by sham1ko
          </span>
        </div>
        <div className="bg-zinc-100 p-2 rounded-lg group-hover:bg-primary-soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-secondary group-hover:text-primary"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
