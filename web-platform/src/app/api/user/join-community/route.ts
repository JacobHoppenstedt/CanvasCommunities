import { NextRequest, NextResponse } from "next/server";
import { joinCommunity } from "@/services/userService";
export async function PATCH(req: NextRequest) {
  try {  
    const { userId, communityId } = await req.json();

    if (!userId || !communityId) {
      return NextResponse.json({ error: "userId and communityId required" }, { status: 400 });
    }

    const membership = await joinCommunity(userId, communityId);
    return NextResponse.json(membership);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}