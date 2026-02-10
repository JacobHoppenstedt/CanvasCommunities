"use client";

import React from "react";
import PageHeader from "@/components/PageHeader";
import ClubCard from "@/components/ClubCard";
import { mockClubs } from "@/mocks/clubs";

export default function RecommendedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Personalized Recommendations"
        subtitle="We’ve hand-picked these clubs just for you based on your interests."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClubs.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>
    </div>
  );
}
