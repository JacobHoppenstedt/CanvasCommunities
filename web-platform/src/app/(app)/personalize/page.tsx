"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-3xl bg-[url('/personalpage.png')] bg-cover bg-center bg-no-repeat p-6 shadow-sm">
      {/* Background overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-white/60" />

      <div className="relative z-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-10 rounded-3xl bg-white/80 p-6 shadow-md backdrop-blur-sm md:p-8">
          {/* Top search bar */}
          <div className="w-full">
            <Input
              type="search"
              placeholder="Search interests, hobbies, majors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full bg-white px-5 text-sm shadow-sm placeholder:text-slate-400"
            />
          </div>

          {/* Main two-column layout */}
          <div className="flex flex-col items-start gap-10 lg:flex-row">
            {/* Left column: heading and CTA */}
            <div className="w-full space-y-5 lg:basis-2/5 lg:max-w-md">
              <header className="mb-2">
                <h1 className="text-3xl font-semibold leading-tight text-green-700 md:text-4xl">
                  Personalize Your Campus Experience
                </h1>
                <p className="mt-2 text-sm text-slate-800 md:text-base">
                  Select interests to get smarter club recommendations tailored just for you.
                </p>
              </header>

              <p className="text-sm text-slate-800 md:text-base">
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
                  <p className="text-sm text-slate-600">
                    No interests match your search. Try a different keyword.
                  </p>
                )}
              </div>

              <div className="mt-6 text-center text-xs text-slate-600">
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
    </div>
  );
}
