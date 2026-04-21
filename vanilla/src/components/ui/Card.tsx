import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
