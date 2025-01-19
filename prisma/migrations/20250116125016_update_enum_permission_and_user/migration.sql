/*
  Warnings:

  - The values [CREATE_GAME,UPDATE_GAME,DELETE_GAME,UPDATE_GUIDE,CREATE_GUIDE,DELETE_GUIDE] on the enum `Permissions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permissions_new" AS ENUM ('MANAGE_ADMINS', 'MANAGE_USERS', 'MANAGE_GAMES', 'MANAGE_GUIDES');
ALTER TABLE "Admin" ALTER COLUMN "permissions" TYPE "Permissions_new"[] USING ("permissions"::text::"Permissions_new"[]);
ALTER TYPE "Permissions" RENAME TO "Permissions_old";
ALTER TYPE "Permissions_new" RENAME TO "Permissions";
DROP TYPE "Permissions_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "DOB" TIMESTAMP(3);
