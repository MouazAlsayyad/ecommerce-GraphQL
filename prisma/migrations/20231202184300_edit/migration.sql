/*
  Warnings:

  - The primary key for the `Product_Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `brandId` on the `Product_Category` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product_Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product_Category" DROP CONSTRAINT "Product_Category_brandId_fkey";

-- AlterTable
ALTER TABLE "Product_Category" DROP CONSTRAINT "Product_Category_pkey",
DROP COLUMN "brandId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "Product_Category_pkey" PRIMARY KEY ("categoryId", "productId");

-- AddForeignKey
ALTER TABLE "Product_Category" ADD CONSTRAINT "Product_Category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
