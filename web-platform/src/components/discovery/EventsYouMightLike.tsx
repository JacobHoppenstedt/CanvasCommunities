"use client";

import React from "react";

type Props = {
  maxHeight?: number | undefined;
};

export default function EventsYouMightLike({ maxHeight }: Props) {
  const style = maxHeight ? { maxHeight: `${maxHeight}px` } : undefined;

  return (
    <div
      className="sticky top-8 overflow-y-auto space-y-4 rounded-2xl bg-white p-5 shadow-sm"
      style={style}
    >
      <h3 className="text-sm font-semibold text-slate-900">Events you might like</h3>

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-3 text-xs hover:bg-slate-50 transition"
        >
          <p className="font-semibold">Gator Grilling Club</p>
          <p className="text-slate-500">General Body Meeting</p>
          <p className="mt-1 text-orange-500 font-medium">12:30 – 1:30 PM</p>
        </div>
      ))}
    </div>
  );
}