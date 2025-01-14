-- CreateEnum
CREATE TYPE "Archetype" AS ENUM ('ALL_ROUNDER', 'MIX_UP', 'BAIT_PUNISH', 'GRAPPLER', 'GLASS_CANNON', 'RUSHDOWN', 'FOOTSIES', 'PRESSURER', 'HIT_RUN', 'ZONE_BREAKER', 'DOMINATING', 'ZONER', 'TRAPPER', 'TURTLE', 'KEEP_AWAY', 'STAGE_CONTROL', 'TAG_TEAM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'SUB_ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CREATE_GAME', 'UPDATE_GAME', 'DELETE_GAME', 'MANAGE_USERS', 'UPDATE_GUIDE', 'CREATE_GUIDE', 'DELETE_GUIDE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "password" TEXT NOT NULL,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mechanic" TEXT,
    "universalPrice" DOUBLE PRECISION,
    "platform" TEXT[],
    "store" TEXT[],
    "playerBaseCount" INTEGER,
    "netCodeType" TEXT,
    "coverPhoto" TEXT,
    "timesFavorited" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL,
    "adminId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryRelationship" (
    "id" SERIAL NOT NULL,
    "parentCategoryId" INTEGER NOT NULL,
    "childCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CategoryRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FavoriteGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gallery" TEXT[],
    "url" TEXT NOT NULL,
    "info" TEXT,
    "AuthenticAuthor" TEXT,
    "authorId" TEXT NOT NULL,
    "gameId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "splashArt" TEXT NOT NULL,
    "tierList" TEXT NOT NULL,
    "baseRooster" TEXT NOT NULL,
    "description" TEXT,
    "archetype" "Archetype" NOT NULL,
    "showcase" TEXT,
    "photo" TEXT,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");

-- CreateIndex
CREATE INDEX "Game_title_idx" ON "Game"("title");

-- CreateIndex
CREATE INDEX "Game_categoryId_idx" ON "Game"("categoryId");

-- CreateIndex
CREATE INDEX "Game_netCodeType_idx" ON "Game"("netCodeType");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryRelationship_parentCategoryId_childCategoryId_key" ON "CategoryRelationship"("parentCategoryId", "childCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteGame_userId_gameId_key" ON "FavoriteGame"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_title_key" ON "Guide"("title");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryRelationship" ADD CONSTRAINT "CategoryRelationship_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryRelationship" ADD CONSTRAINT "CategoryRelationship_childCategoryId_fkey" FOREIGN KEY ("childCategoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteGame" ADD CONSTRAINT "FavoriteGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteGame" ADD CONSTRAINT "FavoriteGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
