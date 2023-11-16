/*
  Warnings:

  - You are about to drop the `FavouritesList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavouritesList" DROP CONSTRAINT "FavouritesList_itemId_fkey";

-- DropForeignKey
ALTER TABLE "FavouritesList" DROP CONSTRAINT "FavouritesList_userId_fkey";

-- DropTable
DROP TABLE "FavouritesList";

-- CreateTable
CREATE TABLE "FavoritesList" (
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "FavoritesList_pkey" PRIMARY KEY ("userId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoritesList_userId_key" ON "FavoritesList"("userId");

-- AddForeignKey
ALTER TABLE "FavoritesList" ADD CONSTRAINT "FavoritesList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesList" ADD CONSTRAINT "FavoritesList_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ProductItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
