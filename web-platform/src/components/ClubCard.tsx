"use client";

import React, { useState } from "react";
import { Club } from "@/mocks/clubs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClubCard({ club }: { club: Club }) {
  const [joined, setJoined] = useState(Boolean(club.joined));

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex gap-4 p-4">
        {/* Avatar */}
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage
            src={club.avatarUrl || "/avatars/placeholder.png"}
            alt={club.name}
          />
          <AvatarFallback>
            {club.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex flex-1 justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <h3 className="text-base font-semibold truncate">
              {club.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {club.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {club.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Button
              size="sm"
              variant={joined ? "outline" : "default"}
              onClick={() => setJoined((v) => !v)}
            >
              {joined ? "Joined" : "Join"}
            </Button>

            <Link
              href={`/club/${club.id}`}
              className="text-xs text-muted-foreground hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}