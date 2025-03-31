/*
  Warnings:

  - You are about to drop the column `lastSyncedAt` on the `App` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EmoteLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "time" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_App" ("id") SELECT "id" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
