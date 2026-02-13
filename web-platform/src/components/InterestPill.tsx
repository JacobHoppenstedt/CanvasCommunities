"use client";
import React from "react";

export default function InterestPill({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${selected ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
    >
      {label}
    </button>
  );
}
