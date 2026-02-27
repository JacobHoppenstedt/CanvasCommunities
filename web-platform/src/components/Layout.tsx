"use client";

import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // `overflow-hidden` at the viewport-level prevents page-level horizontal scroll.
    // Important: `main` must be `min-w-0` so the inner horizontal scroll areas can overflow internally.
    <div className="flex h-screen overflow-hidden bg-gray-50 max-w-full">
      <Sidebar />

      {/* MAIN SCROLL AREA */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}