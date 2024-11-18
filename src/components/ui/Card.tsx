import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`p-8 flex flex-col bg-white rounded-lg border border-gray-400/20 shadow-sm backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
