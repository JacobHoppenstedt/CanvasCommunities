"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { DiscoveryClub } from "@/mocks/discovery";
import { Button } from "@/components/ui/button";

export default function DiscoveryClubCard({ club }: { club: DiscoveryClub }) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="flex h-full flex-col rounded-2xl bg-white shadow-md hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Banner area */}
      <div className="relative w-full flex-shrink-0" style={{ height: "32%" }}>
        <div className="absolute inset-0 bg-orange-400">
          {club.bannerSrc && (
            <Image src={club.bannerSrc} alt="" fill className="object-cover opacity-80" />
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border bg-white">
            <Image
              src={club.logoSrc || "/gator-hero.png"}
              alt=""
              width={48}
              height={48}
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">{club.name}</h3>
            <p className="mt-1 text-xs text-slate-600 line-clamp-3">{club.description}</p>
          </div>
        </div>

        {/* Next Meeting */}
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
          <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wide">
            Next Meeting
          </p>
          <p className="mt-1 font-semibold">{club.nextMeeting.title}</p>
          <p className="text-[13px]">{club.nextMeeting.datetime}</p>
          <p className="text-slate-500 text-[13px]">{club.nextMeeting.location}</p>
        </div>

        {/* Actions - pinned to bottom */}
        <div className="mt-auto flex justify-between items-center pt-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            Join
          </Button>
        </div>
      </div>
    </motion.article>
  );
}