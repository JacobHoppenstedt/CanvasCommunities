// web-platform/src/hooks/useCurrentUser.ts
"use client";

import { useEffect, useState } from "react";

export default function useCurrentUser(defaultUserId = 1) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUserId");
      if (raw) {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
          console.log("[useCurrentUser] loaded from localStorage:", parsed);
          setUserId(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("[useCurrentUser] localStorage read failed", e);
    }
    console.log("[useCurrentUser] falling back to default:", defaultUserId);
    setUserId(defaultUserId);
  }, [defaultUserId]);

  return userId;
}