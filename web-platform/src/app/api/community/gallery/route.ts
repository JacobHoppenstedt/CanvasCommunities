import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/services/communityService";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.url || !data.galleryCategoryId || !data.uploadedById)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const image = await uploadImage(data);
  return NextResponse.json(image);
}