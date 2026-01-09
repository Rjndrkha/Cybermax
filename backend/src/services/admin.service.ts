import { prisma } from "../lib/prisma.js";

export const getPendingRequests = async () => {
  return prisma.permissionRequest.findMany({
    where: { status: "PENDING" },
    distinct: ["docId"],
    include: {
      document: {
        select: {
          fileUrl: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const processRequest = async (
  requestId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const request = await prisma.permissionRequest.findUnique({
    where: { id: requestId },
  });

  console.log(request);

  if (!request) throw new Error("Request tidak ditemukan");

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.permissionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    if (status === "REJECTED") {
      await tx.document.update({
        where: { id: request.docId },
        data: { status: "REJECTED" },
      });
      return updatedRequest;
    }

    if (status === "APPROVED") {
      if (request.action === "APPROVE") {
        await tx.document.update({
          where: { id: request.docId },
          data: {
            status: "APPROVED",
          },
        });
      }
      if (request.action === "DELETE") {
        await tx.document.delete({ where: { id: request.docId } });
      }
      if (request.action === "REPLACE") {
        await tx.document.update({
          where: { id: request.docId },
          data: {
            status: "ACTIVE",
          },
        });
      }
    } else {
      await tx.document.update({
        where: { id: request.docId },
        data: { status: "ACTIVE" },
      });
    }

    await tx.notification.create({
      data: {
        userId: request.userId,
        title: `Permintaan ${request.action} Dokumen`,
        message: `Permintaan Anda telah ${status} oleh Admin.`,
      },
    });

    return updatedRequest;
  });
};
