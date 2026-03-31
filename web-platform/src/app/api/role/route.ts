import { NextRequest, NextResponse } from "next/server";
import * as roleService from "@/services/roleService";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.name && body.communityId) {
    const role = await roleService.createRole(body.name, body.communityId);
    return NextResponse.json(role);
  }

  if (body.userId && body.roleId) {
    const userRole = await roleService.assignUserRole(body.userId, body.roleId);
    return NextResponse.json(userRole);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const roleId = url.searchParams.get("roleId");
  const communityId = url.searchParams.get("communityId");
  const userId = url.searchParams.get("userId");

  if (roleId) {
    const role = await roleService.getRoleById(Number(roleId));
    return NextResponse.json(role);
  }

  if (communityId) {
    const roles = await roleService.getRolesByCommunity(Number(communityId));
    return NextResponse.json(roles);
  }

  if (userId) {
    const roles = await roleService.getUserRoles(Number(userId));
    return NextResponse.json(roles);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (body.id && body.name) {
    const updated = await roleService.updateRole(body.id, body.name);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const roleId = url.searchParams.get("roleId");
  const userId = url.searchParams.get("userId");

  if (roleId && !userId) {
    const deleted = await roleService.deleteRole(Number(roleId));
    return NextResponse.json(deleted);
  }

  if (roleId && userId) {
    const removed = await roleService.removeUserRole(Number(userId), Number(roleId));
    return NextResponse.json(removed);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}