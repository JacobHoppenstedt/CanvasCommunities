"use client";
import React from "react";
import { EventItem } from "@/mocks/events";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-md font-medium">{event.title}</h3>
          <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{event.location}</p>
          {event.rsvped && <span className="text-xs mt-1 inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">RSVP&apos;d</span>}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3 line-clamp-3">{event.description}</p>
    </div>
  );
}
