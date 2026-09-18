"use client";
import { useState } from "react";

interface WeatherSearchFormProps {
  onSearch: (city: string) => void;
  loading: boolean;
  isFocused: boolean;
  isSubmitted: boolean;
}

export default function WeatherSearchForm({
  onSearch,
  loading,
  isFocused,
  isSubmitted,
}: WeatherSearchFormProps) {
  const [city, setCity] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form
      className={`bg-surface rounded-2xl border border-line shadow-sm ${isSubmitted
          ? "w-full max-w-5xl flex flex-row items-center p-4 gap-4"
          : isFocused
            ? "max-w-md md:max-w-sm flex flex-col p-6"
            : "max-w-3xl w-full md:max-w-lg flex flex-col p-10"
        }`}
      onSubmit={handleSubmit}
    >
      {isSubmitted || (
        <label
          htmlFor="large-input"
          className="flex justify-center text-4xl mb-5"
        >
          Поиск города
        </label>
      )}

      <input
        type="text"
        id="large-input"
        aria-label="Поиск города"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        className={`border border-zinc-300 bg-surface rounded-[10px] transition-colors focus:outline-hidden focus:border-primary focus:ring-4 focus:ring-primary-soft disabled:bg-zinc-50 disabled:cursor-not-allowed ${isSubmitted ? "flex-1 p-3" : "p-4"
          }`}
        placeholder="Например, Алматы…"
        value={city}
        onChange={handleChange}
        disabled={loading}
      />

      <div className={`flex gap-2 ${isSubmitted ? "flex-row" : "flex-col"}`}>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-strong text-white font-medium rounded-[10px] transition-colors focus-visible:ring-4 focus-visible:outline-hidden focus-visible:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitted ? "px-6 py-3 text-sm flex-1" : "text-sm px-4 py-2 mt-4"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Загрузка…
            </>
          ) : (
            "Найти"
          )}
        </button>
      </div>
    </form>
  );
}
