import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/services/communityService";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name || !data.communityId || !data.createdById)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const event = await createEvent(data);
  return NextResponse.json(event);
}