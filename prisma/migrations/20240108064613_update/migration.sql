/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductConfiguration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductConfiguration" DROP CONSTRAINT "ProductConfiguration_productId_fkey";

-- AlterTable
ALTER TABLE "ProductConfiguration" DROP COLUMN "productId";
