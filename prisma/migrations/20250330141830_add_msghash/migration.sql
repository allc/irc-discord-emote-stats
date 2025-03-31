/*
  Warnings:

  - Added the required column `msgHash` to the `EmoteLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmoteLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "msgHash" TEXT NOT NULL
);
INSERT INTO "new_EmoteLog" ("action", "channel", "emoji", "id", "time") SELECT "action", "channel", "emoji", "id", "time" FROM "EmoteLog";
DROP TABLE "EmoteLog";
ALTER TABLE "new_EmoteLog" RENAME TO "EmoteLog";
CREATE UNIQUE INDEX "EmoteLog_channel_emoji_action_time_msgHash_key" ON "EmoteLog"("channel", "emoji", "action", "time", "msgHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
