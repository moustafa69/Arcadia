/*
  Warnings:

  - You are about to drop the column `totalGames` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `CategoryRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryRelationship" DROP CONSTRAINT "CategoryRelationship_childCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryRelationship" DROP CONSTRAINT "CategoryRelationship_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "totalGames",
ADD COLUMN     "parentId" INTEGER;

-- DropTable
DROP TABLE "CategoryRelationship";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
