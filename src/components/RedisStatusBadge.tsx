interface RedisStatusBadgeProps {
  available: boolean | null;
}

export default function RedisStatusBadge({
  available,
}: RedisStatusBadgeProps) {
  if (available !== false) {
    return null;
  }

  return (
    <div className="max-w-3xl w-full md:max-w-lg flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-700 text-sm">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-amber-500 text-amber-700 text-xs font-semibold">
        !
      </span>
      <span>Redis DB is not available</span>
    </div>
  );
}
