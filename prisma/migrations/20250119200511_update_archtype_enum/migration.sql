/*
  Warnings:

  - The values [ALL_ROUNDER,BAIT_PUNISH,GLASS_CANNON,FOOTSIES,PRESSURER,HIT_RUN,ZONE_BREAKER,DOMINATING,TRAPPER,TURTLE,KEEP_AWAY,STAGE_CONTROL,TAG_TEAM] on the enum `Archetype` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Archetype_new" AS ENUM ('ALL_ROUNDER_SHOTO', 'MIX_UP', 'GRAPPLER', 'RUSHDOWN', 'ZONER', 'POWER');
ALTER TABLE "Character" ALTER COLUMN "archetype" TYPE "Archetype_new" USING ("archetype"::text::"Archetype_new");
ALTER TYPE "Archetype" RENAME TO "Archetype_old";
ALTER TYPE "Archetype_new" RENAME TO "Archetype";
DROP TYPE "Archetype_old";
COMMIT;

-- AlterTable
ALTER TABLE "Guide" ALTER COLUMN "url" DROP NOT NULL;
