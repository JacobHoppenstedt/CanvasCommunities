"use client";

import React, { useState } from "react";
import { Club } from "@/mocks/clubs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClubCard({ club }: { club: Club }) {
  const [joined, setJoined] = useState(Boolean(club.joined));
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex gap-4">
        <Avatar>
          <img src={club.avatarUrl || "/avatars/placeholder.png"} alt={club.name} className="w-12 h-12 rounded" />
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold truncate">{club.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{club.description}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {club.tags.map((t) => (
                  <Badge key={t} className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button size="sm" variant={joined ? "ghost" : "default"} onClick={() => setJoined((v) => !v)}>
                {joined ? "Joined" : "Join"}
              </Button>
              <Link href={`/club/${club.id}`} className="text-xs text-muted-foreground underline">
                View
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
