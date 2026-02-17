"use client";
import React, { useState } from "react";

export default function Tabs({ tabs, className }: { tabs: string[]; className?: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className={className}>
      <div className="flex gap-2 mb-4">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`px-3 py-1 rounded-md text-sm ${i === active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {/* In pages, render content based on 'active' */}
      </div>
    </div>
  );
}
