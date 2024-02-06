/*
  Warnings:

  - Added the required column `stage` to the `Sticker` table without a default value. This is not possible if the table is not empty.

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
    "estimate" DATETIME,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Sticker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sticker" ("assignee", "createdAt", "endedAt", "estimate", "externalUrl", "id", "startedAt", "summary", "title", "updatedAt", "userId") SELECT "assignee", "createdAt", "endedAt", "estimate", "externalUrl", "id", "startedAt", "summary", "title", "updatedAt", "userId" FROM "Sticker";
DROP TABLE "Sticker";
ALTER TABLE "new_Sticker" RENAME TO "Sticker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
