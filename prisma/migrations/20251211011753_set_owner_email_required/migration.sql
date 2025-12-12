/*
  Warnings:

  - Made the column `cuisine` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerEmail` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "cuisine" SET NOT NULL,
ALTER COLUMN "ownerEmail" SET NOT NULL;
