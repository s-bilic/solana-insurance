/*
  Warnings:

  - You are about to drop the column `value` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `claim` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loss` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "value",
ADD COLUMN     "claim" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "loss" DOUBLE PRECISION NOT NULL;
