"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Club } from "@/mocks/clubs";

export default function ClubCard({ club }: { club: Club }) {
  const [joined, setJoined] = useState(!!club.joined);

  return (
    <motion.article
      whileHover={{ translateY: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
      role="group"
      aria-labelledby={`club-${club.id}-title`}
    >
      <div className="flex items-start gap-3">
        <img src={club.avatarUrl || "/avatars/placeholder.png"} alt={`${club.name} avatar`} className="w-12 h-12 rounded-lg object-cover" />
        <div className="flex-1">
          <h2 id={`club-${club.id}-title`} className="text-lg font-medium">{club.name}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{club.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {club.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setJoined(!joined)}
            className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm transition-colors ${joined ? "bg-orange-500 text-white" : "bg-blue-50 text-blue-700"}`}
            aria-pressed={joined}
          >
            {joined ? "Joined" : "Join"}
          </button>
          <button className="text-xs text-gray-500 underline">View</button>
        </div>
      </div>
    </motion.article>
  );
}
