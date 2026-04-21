import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-500",
    ghost: "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-gray-500",
    danger: "bg-transparent hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 focus:ring-rose-500",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
