"use client";
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="container flex justify-center items-center mx-auto h-[calc(100vh-64px)]">
      <form
        className="w-1/3 flex flex-col bg-white bg-opacity-10 rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-10"
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
        />

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4"
        >
          Search
        </button>
      </form>
    </main>
  );
}
