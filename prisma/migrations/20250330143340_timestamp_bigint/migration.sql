/*
  Warnings:

  - You are about to alter the column `timestamp` on the `EmoteLog` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmoteLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "msgHash" TEXT NOT NULL
);
INSERT INTO "new_EmoteLog" ("action", "channel", "emoji", "id", "msgHash", "timestamp") SELECT "action", "channel", "emoji", "id", "msgHash", "timestamp" FROM "EmoteLog";
DROP TABLE "EmoteLog";
ALTER TABLE "new_EmoteLog" RENAME TO "EmoteLog";
CREATE UNIQUE INDEX "EmoteLog_channel_emoji_action_timestamp_msgHash_key" ON "EmoteLog"("channel", "emoji", "action", "timestamp", "msgHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
