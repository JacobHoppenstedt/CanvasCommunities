"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import EventCard from "@/components/EventCard";

export default function ClubPageClient({ club, events }: any) {
  const [joined, setJoined] = useState(Boolean(club.joined));

  return (
    <div className="space-y-6">
      {/* ───────────────── Header ───────────────── */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14">
            <img
              src={club.avatarUrl || "/avatars/placeholder.png"}
              alt={club.name}
              className="object-cover"
            />
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{club.name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {club.description}
            </p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {club.tags.map((t: string) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={joined ? "outline" : "default"}
              onClick={() => setJoined(!joined)}
            >
              {joined ? "Joined" : "Join"}
            </Button>
            <Button variant="ghost">Message</Button>
          </div>
        </CardContent>
      </Card>

      {/* ───────────────── Tabs + Content ───────────────── */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-medium">Upcoming events</h2>

              {events.length ? (
                events.map((ev: any) => (
                  <EventCard key={ev.id} event={ev} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming events.
                </p>
              )}
            </div>

            {/* Calendar (secondary) */}
            <Card className="h-fit">
            <CardHeader className="pb-2">
                <h3 className="text-sm font-medium">Calendar</h3>
            </CardHeader>

            <CardContent className="flex justify-center">
                <div className="max-w-xs w-full">
                <Calendar />
                </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <p className="text-sm text-muted-foreground">
            No announcements yet.
          </p>
        </TabsContent>

        <TabsContent value="members">
          <p className="text-sm text-muted-foreground">
            Member list coming soon.
          </p>
        </TabsContent>

        <TabsContent value="gallery">
          <p className="text-sm text-muted-foreground">
            Gallery coming soon.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
