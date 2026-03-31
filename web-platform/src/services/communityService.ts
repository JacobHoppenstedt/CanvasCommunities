import { prisma } from "../lib/prisma";

export async function createCommunity(name: string) {
  return prisma.community.create({
    data: {
      name
    }
  });
}

export async function addCommunityTag(communityId: number, tagName: string) {
  return prisma.community.update({
    where: { id: communityId },
    data: {
      tags: {
        connectOrCreate: {
          where: { name: tagName },
          create: { name: tagName }
        }
      }
    }
  });
}

export async function getCommunityById(id: number) {
  return prisma.community.findUnique({
    where: { id },
  });
}

export async function createEvent(data: {
  name: string;
  description: string;
  location?: string;
  communityId: number;
  startTime: Date;
  endTime?: Date;
  address: string;
  tags?: string[];
  createdById: number;
}) {
  return prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      startTime: data.startTime,
      endTime: data.endTime,
      communityId: data.communityId,
      createdById: data.createdById,
      tags: data.tags
        ? { connectOrCreate: data.tags.map((t) => ({ where: { name: t }, create: { name: t } })) }
        : undefined,
    },
    include: { tags: true },
  });
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  communityId: number;
  scheduledAt?: Date;
  createdById: number;
  tags?: string[];
}) {
  return prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      communityId: data.communityId,
      createdById: data.createdById,
      scheduledAt: data.scheduledAt,
      tags: data.tags
        ? { connectOrCreate: data.tags.map((t) => ({ where: { name: t }, create: { name: t } })) }
        : undefined,
    },
    include: { tags: true },
  });
}

export async function uploadImage(data: {
  url: string;
  categoryId: number;
  uploadedById: number;
}) {
  return prisma.image.create({
    data: {
      url: data.url,
      categoryId: data.categoryId,
      uploadedById: data.uploadedById,
    },
  });
}