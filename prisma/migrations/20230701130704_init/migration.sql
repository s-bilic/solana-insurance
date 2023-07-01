/*
  Warnings:

  - Added the required column `completed` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "completed" BOOLEAN NOT NULL;
