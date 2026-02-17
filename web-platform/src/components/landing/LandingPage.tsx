"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Announcements", href: "/announcements" },
  { label: "ExplorePage", href: "/recommended" },
  { label: "Calendar", href: "/calendar" },
  { label: "Activity", href: "/activity" },
  { label: "Contact", href: "/contact" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top navbar */}
        <header className="flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-800 ring-1 ring-white/10 flex items-center justify-center font-semibold">
              C
            </div>
            <span className="text-sm sm:text-base font-semibold tracking-tight">
              Connector
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              UFL Login
            </Link>
          </div>
        </header>

        {/* Hero card */}
        <main className="pb-12 sm:pb-16">
          <section className="bg-amber-50 text-slate-900 rounded-3xl ring-1 ring-black/5 shadow-sm px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 w-full">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                  Discover Communities
                  <br />
                  Get Involved
                  <br />
                  Stay Connected.
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-700 max-w-xl">
                  Find student orgs, see what’s happening on campus, and build
                  your circle—fast.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/recommended"
                    className="px-5 py-3 rounded-md bg-white text-slate-900 ring-1 ring-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-amber-50"
                  >
                    ExplorePage
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-3 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-amber-50"
                  >
                    UFL Login
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3]">
                  <Image
                    src="/gator-hero.png"
                    alt="Gator mascot"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

