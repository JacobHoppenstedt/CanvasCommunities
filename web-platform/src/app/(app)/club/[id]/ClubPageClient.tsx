"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
import { discoveryClubs, type DiscoveryClub } from "@/mocks/discovery";
import { mockClubs } from "@/mocks/clubs";

/**
 * Robust Club page client:
 * - uses `club` prop if passed (server can pass it)
 * - otherwise tries to resolve from mocks using the route id param (dev-friendly)
 * - if you later implement GET /api/community/[id] it will try to fetch from API as a fallback
 *
 * Note: the mock ids are strings like "gator-grilling". If your route uses numeric DB ids,
 * you can create a server API that returns community by numeric id (see notes below).
 */

export default function ClubPageClient({ club: clubProp, events: eventsProp }: any) {
  const params = useParams(); // route params object in app router
  const routeId = (params as any)?.id ?? null; // e.g. "gator-grilling" or "1"
  const currentUserId = useCurrentUser(1);

  const [club, setClub] = useState<any>(() => {
    // prefer prop if provided
    if (clubProp) return clubProp;
    return undefined;
  });

  const [events, setEvents] = useState<any[] | undefined>(() => eventsProp ?? undefined);
  const [joined, setJoined] = useState<boolean>(false);
  const [joining, setJoining] = useState(false);

  // Helper: normalize incoming shape (mocks -> expected UI shape)
  function mapMockToClub(c: DiscoveryClub) {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      tags: c.tags,
      avatarUrl: c.logoSrc,
      bannerUrl: c.bannerSrc,
      nextMeeting: c.nextMeeting,
      // mock has no members: keep empty
      members: [],
      // mock has no events: empty
      events: [],
    };
  }

  function mapSidebarMockToClub(c: any) {
    return {
      id: c.id,
      name: c.name ?? "Untitled Club",
      description: c.description ?? c.blurb ?? "Club description coming soon.",
      tags: c.tags ?? [],
      avatarUrl: c.avatarUrl ?? c.logoSrc ?? c.logo ?? "/avatars/placeholder.png",
      bannerUrl: c.bannerUrl ?? c.bannerSrc,
      nextMeeting: c.nextMeeting,
      members: c.members ?? [],
      events: c.events ?? [],
    };
  }

  // load club on mount if prop wasn't provided
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        console.log("[ClubPage] routeId:", routeId, "clubProp:", !!clubProp);

        if (clubProp) {
          console.log("[ClubPage] using passed club prop");
          setClub(clubProp);
          // compute joined from members if possible
          setJoined(Boolean(clubProp?.members?.some((m: any) => Number(m.userId) === Number(currentUserId))));
          return;
        }

        // 1) Try to find mock by id (string slug)
        if (routeId) {
          const bySlug = discoveryClubs.find((d) => d.id === String(routeId));
          if (bySlug) {
            console.log("[ClubPage] found mock club by slug:", bySlug.name);
            const mapped = mapMockToClub(bySlug);
            if (!mounted) return;
            setClub(mapped);
            setEvents(mapped.events || []);
            setJoined(Boolean(mapped.members?.some((m: any) => Number(m.userId) === Number(currentUserId))));
            return;
          }

          const bySidebarId = mockClubs.find((d: any) => d.id === String(routeId));
          if (bySidebarId) {
            console.log("[ClubPage] found sidebar mock club by id:", bySidebarId.name);
            const mapped = mapSidebarMockToClub(bySidebarId);
            if (!mounted) return;
            setClub(mapped);
            setEvents(mapped.events || []);
            setJoined(Boolean(mapped.members?.some((m: any) => Number(m.userId) === Number(currentUserId))));
            return;
          }

          // 2) If routeId is numeric, try to hit API (if backend route exists)
          const maybeNum = Number(routeId);
          if (!Number.isNaN(maybeNum)) {
            try {
              console.log("[ClubPage] routeId looks numeric, attempting API fetch /api/community/get?id=", maybeNum);
              const res = await fetch(`/api/community/get?id=${maybeNum}`);
              if (!res.ok) throw new Error("no api route /api/community/get or not found");
              const data = await res.json();
              if (!mounted) return;
              console.log("[ClubPage] fetched community from API:", data);
              setClub(data);
              setEvents(data.events || []);
              setJoined(Boolean(data?.members?.some((m: any) => Number(m.userId) === Number(currentUserId))));
              return;
            } catch (e) {
              console.warn("[ClubPage] API fetch for numeric id failed (this is optional)", e);
            }
          }
        }

        // 3) fallback: if nothing found, set club to null to show not found
        if (mounted) {
          console.warn("[ClubPage] club not found for routeId:", routeId);
          setClub(null); // explicit not found
        }
      } catch (err) {
        console.error("[ClubPage] load error", err);
        if (mounted) setClub(null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [routeId, clubProp, currentUserId]);

  // keep joined in sync when club or currentUserId changes
  useEffect(() => {
    try {
      if (!club) {
        setJoined(false);
        return;
      }
      setJoined(Boolean(club?.members?.some((m: any) => Number(m.userId) === Number(currentUserId))));
    } catch {
      setJoined(Boolean(club?.joined));
    }
  }, [club, currentUserId]);

  const handleJoin = async () => {
    if (!currentUserId) return;
    if (joined) return;
    setJoining(true);

    // If this is a mock (no numeric DB id), just simulate join in UI
    const isMock = club && typeof club.id === "string" && isNaN(Number(club.id));

    try {
      if (isMock) {
        console.log("[ClubPage] mock join simulated for club:", club.name);
        // update local state: append a fake member
        const fakeMember = { id: `m-${Date.now()}`, userId: Number(currentUserId) };
        const newClub = { ...club, members: [...(club.members || []), fakeMember] };
        setClub(newClub);
        setJoined(true);
        // optionally persist to some mock store or show toast
      } else {
        // assume numeric DB id -> call backend
        console.log("[ClubPage] calling api.user.joinCommunity", { userId: currentUserId, communityId: club.id });
        await api.user.joinCommunity(Number(currentUserId), Number(club.id));
        // optimistic update
        const newClub = { ...club, members: [...(club.members || []), { id: `m-${Date.now()}`, userId: Number(currentUserId) }] };
        setClub(newClub);
        setJoined(true);
      }
    } catch (err) {
      console.error("Failed to join", err);
    } finally {
      setJoining(false);
    }
  };
  // Render states:
  if (club === undefined) {
    // still loading
    return <div>Loading club…</div>;
  }

  if (club === null) {
    // not found
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Club not found</h2>
        <p className="text-sm text-muted-foreground">We couldn't find that club. Try browsing the Discovery page.</p>
      </div>
    );
  }

  // safe reads using optional chaining
  const logoSrc = club.avatarUrl ?? club.logoSrc ?? "/avatars/placeholder.png";
  const clubName = club.name ?? "Untitled Club";
  const clubDesc = club.description ?? "Club description coming soon.";
  const clubTags = club.tags ?? [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14">
            <img src={logoSrc} alt={clubName} className="object-cover" />
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{clubName}</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">{clubDesc}</p>

            <div className="mt-2 flex gap-2 flex-wrap">
              {clubTags.map((t: any, idx: number) => (
                <Badge key={idx} variant="secondary">{typeof t === "string" ? t : t.name}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant={joined ? "outline" : "default"} onClick={handleJoin} disabled={joining}>
              {joined ? "Joined" : joining ? "Joining…" : "Join"}
            </Button>
            <Button variant="ghost">Message</Button>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-medium">Upcoming events</h2>

              {(events || club.events || []).length ? (
                (events || club.events || []).map((ev: any) => <EventCard key={ev.id} event={ev} />)
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              )}
            </div>

            <Card className="h-fit">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium">Calendar</h3>
              </CardHeader>

              <CardContent className="flex justify-center">
                <div className="max-w-xs w-full"><Calendar /></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        </TabsContent>

        <TabsContent value="members">
          <div className="text-sm text-muted-foreground">
            {(club.members || []).length ? (
              <ul>
                {(club.members || []).map((m: any) => (
                  <li key={m.id}>{`Member: ${m.userId}`}</li>
                ))}
              </ul>
            ) : (
              <p>No members yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <p className="text-sm text-muted-foreground">Gallery coming soon.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}