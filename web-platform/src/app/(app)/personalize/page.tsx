"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { mockInterests, type Interest } from "@/mocks/interests";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import InterestPill from "@/components/InterestPill";

export default function PersonalizePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [interests, setInterests] = useState<Interest[]>(mockInterests);

  const handleToggle = (id: string) => {
    setInterests((prev) =>
      prev.map((interest) =>
        interest.id === id ? { ...interest, selected: !interest.selected } : interest,
      ),
    );
  };

  const filteredInterests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return interests;
    return interests.filter((interest) =>
      interest.label.toLowerCase().includes(query),
    );
  }, [interests, search]);

  const handleSeeFeed = () => {
    router.push("/recommended");
  };

  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-3xl bg-slate-50 p-6 shadow-sm">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),transparent_60%),radial-gradient(circle_at_bottom,_rgba(249,115,22,0.06),transparent_60%)] opacity-70" />

      <div className="relative z-10 flex flex-col gap-10">
        {/* Top search bar */}
        <div className="w-full">
          <Input
            type="search"
            placeholder="Search interests, hobbies, majors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-full bg-white/90 px-5 text-sm shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          {/* Left column: heading and CTA */}
          <div className="w-full lg:basis-2/5 lg:max-w-md space-y-5">
            <PageHeader
              title="Personalize Your Campus Experience"
              subtitle="Select interests to get smarter club recommendations tailored just for you."
            />

            <p className="text-sm md:text-base text-slate-600">
              Choose the subjects, hobbies, and tracks that match you best. We&apos;ll use
              these to surface clubs and communities where you&apos;ll feel at home.
            </p>

            <Button
              onClick={handleSeeFeed}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
            >
              See My Personalized Feed
            </Button>
          </div>

          {/* Right column: interests cloud */}
          <div className="w-full flex-1">
            <div className="mb-5 text-center">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Academics &amp; Interests
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {filteredInterests.map((interest) => (
                <InterestPill
                  key={interest.id}
                  label={interest.label}
                  selected={interest.selected}
                  onClick={() => handleToggle(interest.id)}
                />
              ))}

              {filteredInterests.length === 0 && (
                <p className="text-sm text-slate-500">
                  No interests match your search. Try a different keyword.
                </p>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>
                Tip: you can always update these later from your{" "}
                <Link href="/settings" className="underline underline-offset-2">
                  settings
                </Link>
                .
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
