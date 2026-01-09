import { prisma } from "../lib/prisma.js";

export const uploadDocument = async (data: any, userId: string) => {
  return prisma.$transaction(async (tx) => {
    const doc = await tx.document.create({
      data: {
        ...data,
        createdBy: userId,
        status: "ACTIVE", // Tetap ACTIVE sesuai permintaanmu
      },
    });

    await tx.permissionRequest.create({
      data: {
        docId: doc.id,
        userId: userId,
        action: "APPROVE",
        status: "PENDING",
      },
    });

    return doc;
  });
};
export const getAllDocuments = async (
  search: string = "",
  page: number = 1
) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  return prisma.document.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

export const requestDelete = async (docId: string, userId: string) => {
  return prisma.$transaction([
    prisma.document.update({
      where: { id: docId },
      data: { status: "PENDING_DELETE" },
    }),
    prisma.permissionRequest.create({
      data: {
        docId,
        userId,
        action: "DELETE",
        status: "PENDING",
      },
    }),
  ]);
};

export const requestReplace = async (docId: string, userId: string) => {
  return prisma.$transaction([
    prisma.document.update({
      where: { id: docId },
      data: { status: "PENDING_REPLACE", version: { increment: 2 } },
    }),
    prisma.permissionRequest.create({
      data: {
        docId,
        userId,
        action: "REPLACE",
        status: "PENDING",
      },
    }),
  ]);
};

export const updateDocumentFile = async (docId: string, fileUrl: string) => {
  return prisma.document.update({
    where: { id: docId },
    data: {
      fileUrl: fileUrl,
      version: 1,
      status: "ACTIVE",
    },
  });
};
