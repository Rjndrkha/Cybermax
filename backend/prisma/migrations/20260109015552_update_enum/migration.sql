-- AlterEnum
ALTER TYPE "DocStatus" ADD VALUE 'REJECTED';

-- AlterEnum
ALTER TYPE "RequestAction" ADD VALUE 'REJECTED';

-- AddForeignKey
ALTER TABLE "PermissionRequest" ADD CONSTRAINT "PermissionRequest_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
