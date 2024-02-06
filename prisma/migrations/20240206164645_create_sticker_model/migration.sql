/*
  Warnings:

  - You are about to alter the column `estimate` on the `Sticker` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sticker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "assignee" TEXT,
    "stage" INTEGER NOT NULL,
    "externalUrl" TEXT,
    "estimate" INTEGER,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Sticker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sticker" ("assignee", "createdAt", "endedAt", "estimate", "externalUrl", "id", "stage", "startedAt", "summary", "title", "updatedAt", "userId") SELECT "assignee", "createdAt", "endedAt", "estimate", "externalUrl", "id", "stage", "startedAt", "summary", "title", "updatedAt", "userId" FROM "Sticker";
DROP TABLE "Sticker";
ALTER TABLE "new_Sticker" RENAME TO "Sticker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
