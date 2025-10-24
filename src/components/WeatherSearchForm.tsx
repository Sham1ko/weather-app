"use client";
import { useState } from "react";

interface WeatherSearchFormProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export default function WeatherSearchForm({
  onSearch,
  loading,
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
      className="max-w-3xl w-full md:max-w-lg flex flex-col bg-white rounded-xl border border-gray-200 backdrop-blur-md p-10"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="large-input"
        className="text-4xl flex justify-center mb-5"
      >
        Search city
      </label>
      <input
        type="text"
        id="large-input"
        className="p-4 border border-gray-300 rounded-lg"
        placeholder="Enter city"
        value={city}
        onChange={handleChange}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Загрузка..." : "Search"}
      </button>
    </form>
  );
}
