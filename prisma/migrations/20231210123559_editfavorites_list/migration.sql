/*
  Warnings:

  - The primary key for the `FavoritesList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemId` on the `FavoritesList` table. All the data in the column will be lost.
  - Added the required column `productId` to the `FavoritesList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavoritesList" DROP CONSTRAINT "FavoritesList_itemId_fkey";

-- AlterTable
ALTER TABLE "FavoritesList" DROP CONSTRAINT "FavoritesList_pkey",
DROP COLUMN "itemId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "FavoritesList_pkey" PRIMARY KEY ("userId", "productId");

-- AddForeignKey
ALTER TABLE "FavoritesList" ADD CONSTRAINT "FavoritesList_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
