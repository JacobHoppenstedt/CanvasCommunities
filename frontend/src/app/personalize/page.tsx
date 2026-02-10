"use client";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import InterestPill from "@/components/InterestPill";
import { mockInterests } from "@/mocks/interests";

export default function PersonalizePage() {
  const [interests, setInterests] = useState(mockInterests);

  const toggle = (id: string) => {
    setInterests((prev) => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  // group by category
  const categories = Array.from(new Set(interests.map(i => i.category)));

  return (
    <div>
      <PageHeader title="Personalize Your Campus Experience" subtitle="Select interests to get club recommendations" />
      <div className="space-y-6">
        {categories.map(cat => (
          <section key={cat}>
            <h3 className="text-sm font-medium mb-2">{cat}</h3>
            <div className="flex flex-wrap gap-2">
              {interests.filter(i => i.category === cat).map(i => (
                <InterestPill key={i.id} label={i.label} selected={!!i.selected} onClick={() => toggle(i.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-6">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md">Done</button>
      </div>
    </div>
  );
}
