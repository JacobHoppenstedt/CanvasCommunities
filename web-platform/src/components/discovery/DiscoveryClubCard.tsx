"use client";

import Image from "next/image";
import React from "react";
import { DiscoveryClub } from "@/mocks/discovery";
import { Button } from "@/components/ui/button";

type Props = {
  club: DiscoveryClub;
};

export default function DiscoveryClubCard({ club }: Props) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Banner strip */}
      <div className="relative h-20 w-full bg-[linear-gradient(90deg,#f97316,#fb923c,#facc15)]">
        {club.bannerSrc && (
          <Image
            src={club.bannerSrc}
            alt=""
            fill
            className="object-cover mix-blend-multiply opacity-70"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex gap-3">
          <div className="-mt-8 h-14 w-14 rounded-full border-2 border-white bg-white shadow-md overflow-hidden shrink-0">
            <Image
              src={club.logoSrc || "/gator-hero.png"}
              alt={`${club.name} logo`}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {club.name}
            </h3>
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {club.description}
            </p>
          </div>

          {/* Next meeting box */}
          <div className="hidden w-40 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 md:block">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Next Meeting
            </p>
            <p className="mt-1 font-semibold">{club.nextMeeting.title}</p>
            <p className="mt-1">{club.nextMeeting.datetime}</p>
            <p className="mt-1 text-slate-500">{club.nextMeeting.location}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-1 flex flex-wrap gap-2">
          {club.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-slate-300 text-xs font-medium text-slate-700"
        >
          View Club Page
        </Button>
        <Button
          size="sm"
          className="h-8 rounded-full bg-orange-500 px-4 text-xs font-semibold text-white hover:bg-orange-600"
        >
          Join Club
        </Button>
      </div>
    </article>
  );
}

