"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiscoveryClub } from "@/mocks/discovery";
import DiscoveryClubCard from "@/components/discovery/DiscoveryClubCard";

type Props = {
  title: ReactNode;
  clubs: DiscoveryClub[];
  rowId?: string;
};

export default function DiscoveryCarouselRow({ title, clubs, rowId }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
   const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    };

    const measure = () => {
      const firstCard = el.querySelector<HTMLElement>(
        "[data-discovery-card='true']",
      );
      if (firstCard) {
        const rect = firstCard.getBoundingClientRect();
        const cardWidth = rect.width;
        const gap = 16; // gap-4

        let visibleCount = 1;
        if (window.matchMedia("(min-width: 1024px)").matches) {
          visibleCount = 3;
        } else if (window.matchMedia("(min-width: 768px)").matches) {
          visibleCount = 2;
        }

        setScrollAmount((cardWidth + gap) * visibleCount);
      }

      updateScrollState();
    };

    measure();

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", measure);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", measure);
    };
  }, [clubs.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = scrollAmount || el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const id = rowId ?? `discovery-row-${String(title)}`;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      <div className="relative">
        {/* Gradient strip behind cards */}
        <div className="pointer-events-none absolute inset-y-4 left-0 right-0 rounded-3xl bg-[linear-gradient(90deg,rgba(249,115,22,0.16),rgba(249,115,22,0.05),rgba(59,130,246,0.08))]" />

        <div
          ref={scrollRef}
          aria-label={typeof title === "string" ? title : undefined}
          id={id}
          className="relative flex flex-nowrap gap-4 overflow-x-auto scroll-smooth py-4 pr-4 snap-x snap-mandatory no-scrollbar"
        >
          {clubs.length === 0 ? (
            <p className="px-4 text-sm text-slate-600">
              No clubs match your current filters yet.
            </p>
          ) : (
            clubs.map((club) => (
              <div
                key={club.id}
                data-discovery-card="true"
                className="snap-start w-full shrink-0 md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
              >
                <DiscoveryClubCard club={club} />
              </div>
            ))
          )}
        </div>

        {/* Left arrow */}
        {canScrollLeft && clubs.length > 0 && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount("left")}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md ring-1 ring-slate-200 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && clubs.length > 0 && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount("right")}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md ring-1 ring-slate-200 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}

