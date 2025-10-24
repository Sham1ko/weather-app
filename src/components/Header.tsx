"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="header h-16 bg-white z-10 flex items-center justify-center">
      <div className="container flex justify-between xl:px-40">
        <Link href="/" className="flex">
          <h1 className="text-2xl content-center font-medium">Weather App</h1>
        </Link>
      </div>
    </header>
  );
}
