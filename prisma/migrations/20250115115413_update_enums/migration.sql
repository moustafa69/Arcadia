/*
  Warnings:

  - The `permissions` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permissions" AS ENUM ('CREATE_GAME', 'UPDATE_GAME', 'DELETE_GAME', 'MANAGE_USERS', 'UPDATE_GUIDE', 'CREATE_GUIDE', 'DELETE_GUIDE');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "Permissions"[];

-- DropEnum
DROP TYPE "Permission";
