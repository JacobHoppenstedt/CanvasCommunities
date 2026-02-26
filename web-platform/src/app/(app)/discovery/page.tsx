"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "@/components/ui/input";
import DiscoveryCarouselRow from "@/components/discovery/DiscoveryCarouselRow";
import { discoveryClubs } from "@/mocks/discovery";

const FILTER_CHIPS = [
  "Computer Science",
  "Food",
  "Soccer",
  "Tennis",
  "Community",
  "Social",
  "Volleyball",
  "Dentistry",
  "Animals",
  "Engineering",
];

export default function DiscoveryPage() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (label: string) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
  };

  const applyFilters = (clubs = discoveryClubs) => {
    const q = query.trim().toLowerCase();
    return clubs.filter((club) => {
      const matchesQuery =
        !q ||
        club.name.toLowerCase().includes(q) ||
        club.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesFilters =
        activeFilters.length === 0 ||
        club.tags.some((tag) =>
          activeFilters.some(
            (filter) => tag.toLowerCase() === filter.toLowerCase(),
          ),
        );

      return matchesQuery && matchesFilters;
    });
  };

  const forYouClubs = useMemo(
    () => applyFilters(discoveryClubs),
    [query, activeFilters],
  );

  const foodClubs = useMemo(
    () => applyFilters(discoveryClubs.filter((c) => c.tags.includes("Food"))),
    [query, activeFilters],
  );

  const soccerClubs = useMemo(
    () => applyFilters(discoveryClubs.filter((c) => c.tags.includes("Soccer"))),
    [query, activeFilters],
  );

  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-3xl bg-[url('/personalpage.png')] bg-cover bg-center bg-no-repeat p-6 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-white/70" />

      <div className="relative z-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-8 rounded-3xl bg-white/85 p-6 shadow-md backdrop-blur-sm md:p-8">
          {/* Search bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by name or try 'I want to help in the community'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm shadow-sm placeholder:text-slate-400"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => {
              const active = activeFilters.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleFilter(chip)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-orange-500 bg-orange-500/10 text-orange-600"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Rows */}
          <div className="space-y-8">
            <DiscoveryCarouselRow
              rowId="for-you"
              title={
                <>
                  For{" "}
                  <span className="text-orange-500">
                    You
                  </span>
                </>
              }
              clubs={forYouClubs}
            />

            <DiscoveryCarouselRow
              rowId="liked-food"
              title={
                <>
                  Since you liked{" "}
                  <span className="text-orange-500">
                    Food
                  </span>
                </>
              }
              clubs={foodClubs}
            />

            <DiscoveryCarouselRow
              rowId="liked-soccer"
              title={
                <>
                  Since you liked{" "}
                  <span className="text-orange-500">
                    Soccer
                  </span>
                </>
              }
              clubs={soccerClubs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

