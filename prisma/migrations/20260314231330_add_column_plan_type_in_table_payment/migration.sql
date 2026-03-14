/*
  Warnings:

  - Added the required column `plan_type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "plan_type" TEXT NOT NULL;
