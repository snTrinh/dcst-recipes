/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ownerId",
ADD COLUMN     "ownerEmail" TEXT;
