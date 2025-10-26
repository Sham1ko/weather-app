"use client";
import { useState } from "react";

interface WeatherSearchFormProps {
  onSearch: (city: string) => void;
  onMock: () => void;
  loading: boolean;
  isFocused: boolean;
  isSubmitted: boolean;
}

export default function WeatherSearchForm({
  onSearch,
  onMock,
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
      className={`bg-white rounded-xl border border-gray-200 backdrop-blur-md shadow-md transition-all duration-500 ease-in-out ${
        isSubmitted
          ? "w-full flex flex-row items-center p-4 gap-4"
          : isFocused
            ? "max-w-md md:max-w-sm flex flex-col p-6 opacity-80 scale-95"
            : "max-w-3xl w-full md:max-w-lg flex flex-col p-10 opacity-100 scale-100"
      }`}
      onSubmit={handleSubmit}
    >
      {isSubmitted || (
        <label
          htmlFor="large-input"
          className="flex justify-center transition-all duration-500 ease-in-out text-4xl mb-5"
        >
          Search city
        </label>
      )}

      <input
        type="text"
        id="large-input"
        className={`border border-gray-300 rounded-lg transition-all duration-500 ease-in-out ${
          isSubmitted ? "flex-1 p-3" : "p-4"
        }`}
        placeholder="Enter city"
        value={city}
        onChange={handleChange}
        disabled={loading}
      />

      <div className={`flex gap-2 ${isSubmitted ? "flex-row" : "flex-col"}`}>
        <button
          type="submit"
          disabled={loading}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 ease-in-out ${
            isSubmitted ? "px-6 py-3 text-sm flex-1" : "text-sm px-4 py-2 mt-4"
          }`}
        >
          {loading ? "Загрузка..." : "Search"}
        </button>

        <button
          type="button"
          onClick={onMock}
          disabled={loading}
          className={`text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-hidden focus:ring-green-300 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 ease-in-out ${
            isSubmitted ? "px-6 py-3 text-sm flex-1" : "text-sm px-4 py-2 mt-2"
          }`}
        >
          Mock
        </button>
      </div>
    </form>
  );
}
