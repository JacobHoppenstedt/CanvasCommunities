import { NextRequest, NextResponse } from "next/server";
import { createAnnouncement } from "@/services/communityService";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.title || !data.communityId || !data.createdById)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const announcement = await createAnnouncement(data);
  return NextResponse.json(announcement);
}