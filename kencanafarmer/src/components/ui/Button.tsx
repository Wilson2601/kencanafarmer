import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base = "px-3 py-1 rounded inline-flex items-center justify-center";
  const v =
    variant === "primary"
      ? "bg-green-600 text-white hover:bg-green-700"
      : "bg-transparent text-gray-700 hover:bg-gray-100";
  return <button className={`${base} ${v} ${className}`} {...rest} />;
}
