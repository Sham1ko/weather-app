"use client";
import Link from "next/link";
import { useState } from "react";
import SearchInput from "./SearchInput";

export default function Header() {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(search);
  };

  return (
    <header className="header h-16 bg-white z-10 flex items-center justify-center">
      <div className="container flex justify-between xl:px-40">
        <Link href="/" className="flex">
          <h1 className="text-2xl content-center font-medium">Weather App</h1>
        </Link>
        <SearchInput
          searchState={search}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </header>
  );
}
