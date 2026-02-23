"use client";
import React from "react";
import { Check } from "lucide-react";

type InterestPillProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function InterestPill({ label, selected, onClick }: InterestPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors shadow-sm
        ${
          selected
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
    >
      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}
