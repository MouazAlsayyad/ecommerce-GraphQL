/*
  Warnings:

  - You are about to drop the column `reqion` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `UserReview` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `region` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserReview" DROP CONSTRAINT "UserReview_userId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "reqion",
ADD COLUMN     "region" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserReview";
