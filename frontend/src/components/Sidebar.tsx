"use client";
import React from "react";
import Link from "next/link";
import { sidebarItems } from "@/mocks/navigation";

export default function Sidebar() {
  return (
    <aside className="w-20 md:w-24 bg-white border-r h-screen sticky top-0">
      <div className="flex flex-col items-center py-4 space-y-4">
        <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">CC</div>
        <nav className="flex-1 flex flex-col items-center mt-2 space-y-2">
          {sidebarItems.map((it) => (
            <Link key={it.id} href={`/${it.id === "discover" ? "recommended" : it.id}`}>
              <a className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-100">
                <span className="sr-only">{it.label}</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 6 2-7L2 9h7l3-7z" /></svg>
              </a>
            </Link>
          ))}
        </nav>
        <div className="mb-4">
          <button className="text-sm text-gray-500">⚙</button>
        </div>
      </div>
    </aside>
  );
}
