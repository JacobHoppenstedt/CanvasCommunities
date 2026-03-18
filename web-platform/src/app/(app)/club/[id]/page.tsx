"use client";

import { useEffect, useState } from "react";
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
import { api } from "@/lib/api";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function ClubPageClient({ club, events }: any) {
  const currentUserId = useCurrentUser(1);
  // derive joined based on members array shape: members: [{ id, userId }]
  const [joined, setJoined] = useState<boolean>(() => {
    try {
      return Boolean(club?.members?.some((m: any) => m.userId === Number(localStorage.getItem("currentUserId") || 1)));
    } catch {
      return Boolean(club?.joined);
    }
  });
  const [joining, setJoining] = useState(false);

  // keep joined in sync if club prop changes
  useEffect(() => {
    try {
      setJoined(Boolean(club?.members?.some((m: any) => m.userId === currentUserId)));
    } catch {
      setJoined(Boolean(club?.joined));
    }
  }, [club, currentUserId]);

  const handleJoin = async () => {
    if (!currentUserId) return;
    if (joined) return; // optionally implement leave later
    setJoining(true);
    try {
      await api.user.joinCommunity(currentUserId, Number(club.id));
      setJoined(true);
    } catch (err) {
      console.error("Failed to join", err);
      // show toast / alert in real app
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── Header ───────────────── */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14">
            <img
              src={club?.avatarUrl || club?.logoSrc || "/avatars/placeholder.png"}
              alt={club?.name || "club"}
              className="object-cover"
            />
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{club.name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {club.description}
            </p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(club.tags || []).map((t: any, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {typeof t === "string" ? t : t.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={joined ? "outline" : "default"}
              onClick={handleJoin}
              disabled={joining}
            >
              {joined ? "Joined" : joining ? "Joining…" : "Join"}
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

              {events?.length ? (
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