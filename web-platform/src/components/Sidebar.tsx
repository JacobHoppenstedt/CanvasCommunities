"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockClubs } from "@/mocks/clubs";
import {
  Compass,
  Activity,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Fix hydration flicker
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    }
  }, [collapsed, mounted]);

  if (!mounted) return null;

  const mainNav = [
    { label: "Discover", href: "/recommended", icon: Compass },
    { label: "Activity", href: "/activity", icon: Activity },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen border-r bg-white flex flex-col overflow-hidden"
    >
      {/* ───────── HEADER ───────── */}
      <div className="h-16 border-b px-3 flex items-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center w-full"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold shrink-0">
            CC
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-semibold text-sm whitespace-nowrap flex-1"
              >
                Canvas Communities
              </motion.span>
            )}
          </AnimatePresence>

          <div className="w-6 flex justify-center">
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-gray-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </button>
      </div>

      {/* ───────── NAV ───────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {mainNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm transition
              ${active ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <div className="w-6 flex justify-center">
                <Icon className="w-5 h-5" />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {!collapsed && (
          <div className="pt-4 pb-2 text-xs font-medium text-gray-400 px-3">
            YOUR CLUBS
          </div>
        )}

        {mockClubs.map((club) => {
          const active = pathname.startsWith(`/club/${club.id}`);

          return (
            <Link
              key={club.id}
              href={`/club/${club.id}`}
              className={`flex items-center rounded-md px-3 py-2 text-sm transition
              ${active ? "bg-gray-50 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <div className="w-6 flex justify-center">
                <img
                  src={club.avatarUrl || "/avatars/placeholder.png"}
                  className="w-6 h-6 rounded-md object-cover"
                />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 truncate"
                  >
                    {club.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ───────── FOOTER ───────── */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <div className="w-6 flex justify-center">
            <Settings className="w-5 h-5" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
