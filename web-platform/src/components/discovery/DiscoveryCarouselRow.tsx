"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiscoveryClub } from "@/mocks/discovery";
import DiscoveryClubCard from "@/components/discovery/DiscoveryClubCard";

type Props = {
  title: ReactNode;
  clubs: DiscoveryClub[];
  rowId?: string;
  rowHeight?: number | undefined;
};

export default function DiscoveryCarouselRow({ title, clubs, rowId, rowHeight }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);

  const id = rowId ?? `discovery-row-${Math.random().toString(36).slice(2, 9)}`;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    };

    const measure = () => {
      const firstCard = el.querySelector<HTMLElement>("[data-discovery-card='true']");
      if (firstCard) {
        const rect = firstCard.getBoundingClientRect();
        const cardWidth = rect.width;

        let gap = 24;
        try {
          const cs = getComputedStyle(el);
          gap = parseFloat(cs.columnGap || cs.gap || cs.getPropertyValue("gap")) || gap;
        } catch {
          gap = 24;
        }

        let visibleCount = 1;
        if (window.matchMedia("(min-width: 1024px)").matches) {
          visibleCount = 3;
        } else if (window.matchMedia("(min-width: 768px)").matches) {
          visibleCount = 2;
        }

        setScrollAmount((cardWidth + gap) * visibleCount);
      } else {
        setScrollAmount(el.clientWidth);
      }

      updateScrollState();
    };

    measure();

    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
      const firstCard = el.querySelector<HTMLElement>("[data-discovery-card='true']");
      if (firstCard) ro.observe(firstCard);
    } catch {
      window.addEventListener("resize", measure);
    }

    el.addEventListener("scroll", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
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

  const containerStyle = rowHeight ? { height: `${rowHeight}px` } : undefined;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <div className="relative group">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          ref={scrollRef}
          aria-label={typeof title === "string" ? title : undefined}
          id={id}
          style={containerStyle}
          className="relative flex flex-nowrap gap-6 overflow-x-auto overflow-y-hidden scroll-smooth py-2 snap-x snap-mandatory no-scrollbar min-w-0"
        >
          {clubs.length === 0 ? (
            <p className="px-4 text-sm text-slate-600">No clubs match your current filters yet.</p>
          ) : (
            clubs.map((club) => (
              <div
                key={club.id}
                data-discovery-card="true"
                className="snap-start w-full shrink-0 md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] h-full"
              >
                <DiscoveryClubCard club={club} />
              </div>
            ))
          )}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md ring-1 ring-slate-200 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scrollByAmount("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md ring-1 ring-slate-200 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}