import { prisma } from "../lib/prisma";

export async function createRole(name: string, communityId: number) {
  return prisma.role.create({
    data: { name, communityId },
    include: { users: { include: { user: true } } },
  });
}

export async function getRoleById(id: number) {
  return prisma.role.findUnique({
    where: { id },
    include: { users: { include: { user: true } } },
  });
}

export async function getRolesByCommunity(communityId: number) {
  return prisma.role.findMany({
    where: { communityId },
    include: { users: { include: { user: true } } },
  });
}

export async function updateRole(id: number, name: string) {
  return prisma.role.update({
    where: { id },
    data: { name },
  });
}

export async function deleteRole(id: number) {
  return prisma.role.delete({ where: { id } });
}

export async function assignUserRole(userId: number, roleId: number) {
  return prisma.userRole.create({
    data: { userId, roleId },
    include: { user: true, role: true },
  });
}

export async function removeUserRole(userId: number, roleId: number) {
  return prisma.userRole.delete({
    where: { userId_roleId: { userId, roleId } },
  });
}

export async function getUserRoles(userId: number) {
  return prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
}