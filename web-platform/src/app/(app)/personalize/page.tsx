"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { mockInterests } from "@/mocks/interests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PersonalizePage() {
  const [interests, setInterests] = useState(mockInterests);

  const toggle = (id: string) =>
    setInterests((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const categories = Array.from(new Set(interests.map((i) => i.category)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personalize Your Campus Experience"
        subtitle="Select your interests so we can recommend clubs you'll love."
      />

      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat}>
            <h3 className="text-sm font-medium mb-3">{cat}</h3>
            <div className="flex flex-wrap gap-2">
              {interests
                .filter((i) => i.category === cat)
                .map((i) => (
                  <button
                    key={i.id}
                    onClick={() => toggle(i.id)}
                    aria-pressed={i.selected}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      i.selected ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
