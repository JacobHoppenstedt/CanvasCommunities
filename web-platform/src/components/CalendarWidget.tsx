"use client";
import React from "react";
import { mockEvents } from "@/mocks/events";

export default function CalendarWidget() {
  // Very simple static calendar grid (placeholder for a richer widget)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm font-medium mb-3">September 2021</div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {["S","M","T","W","R","F","S"].map(d=> <div key={d} className="font-semibold">{d}</div>)}
        {days.map((d)=> (
          <div key={d} className="p-2 rounded hover:bg-gray-50">{d}</div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <div className="font-semibold">Event types</div>
        <div className="flex gap-2 mt-2">
          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">GBM</span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100">Social</span>
        </div>
      </div>
    </div>
  );
}
