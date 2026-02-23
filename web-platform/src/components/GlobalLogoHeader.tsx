"use client";

import Link from "next/link";
import React from "react";

export default function GlobalLogoHeader() {
  return (
    <header className="fixed left-4 top-4 z-40">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900/90 px-2 py-1 text-slate-50 shadow-md ring-1 ring-white/10"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 font-semibold">
          C
        </div>
        <span className="hidden text-sm font-semibold tracking-tight sm:inline">
          Connector
        </span>
      </Link>
    </header>
  );
}

