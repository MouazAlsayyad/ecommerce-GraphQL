/*
  Warnings:

  - The primary key for the `FavouritesList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productItemId` on the `FavouritesList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `FavouritesList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavouritesList" DROP CONSTRAINT "FavouritesList_productItemId_fkey";

-- AlterTable
ALTER TABLE "FavouritesList" DROP CONSTRAINT "FavouritesList_pkey",
DROP COLUMN "productItemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "FavouritesList_pkey" PRIMARY KEY ("userId", "itemId");

-- CreateTable
CREATE TABLE "CartItems" (
    "itemId" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("cartId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "FavouritesList" ADD CONSTRAINT "FavouritesList_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ProductItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ProductItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
