import React from "react";
import { mockClubs } from "@/mocks/clubs";
import { mockEvents } from "@/mocks/events";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import EventCard from "@/components/EventCard";
import CalendarWidget from "@/components/CalendarWidget";

export default function ClubPage({ params }: { params: { id: string } }) {
  const club = mockClubs.find(c => c.id === params.id) || mockClubs[0];
  const events = mockEvents.filter(e => e.clubId === club.id);

  return (
    <div>
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-6">
          <img src={club.avatarUrl || "/avatars/placeholder.png"} className="w-28 h-28 rounded-lg object-cover" alt={club.name} />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{club.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{club.description}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md">Joined</button>
              <button className="px-4 py-2 bg-gray-100 rounded-md">Message</button>
            </div>
          </div>
        </div>
      </div>

      <Tabs tabs={["Announcements", "Members & Board", "Gallery", "Events"]} />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
          {events.map((ev) => <EventCard key={ev.id} event={ev} />)}
          {events.length === 0 && <p className="text-sm text-gray-500">No upcoming events.</p>}
        </div>
        <aside>
          <CalendarWidget />
        </aside>
      </div>
    </div>
  );
}
