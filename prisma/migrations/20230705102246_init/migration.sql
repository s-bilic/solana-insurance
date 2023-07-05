/*
  Warnings:

  - Added the required column `status` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "transaction" TEXT NOT NULL;
