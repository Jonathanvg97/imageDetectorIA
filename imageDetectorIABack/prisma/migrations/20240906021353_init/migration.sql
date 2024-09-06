/*
  Warnings:

  - You are about to drop the column `clientId` on the `Consumption` table. All the data in the column will be lost.
  - Added the required column `clientIp` to the `Consumption` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consumption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientIp" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Consumption" ("count", "createdAt", "id", "updatedAt") SELECT "count", "createdAt", "id", "updatedAt" FROM "Consumption";
DROP TABLE "Consumption";
ALTER TABLE "new_Consumption" RENAME TO "Consumption";
CREATE UNIQUE INDEX "Consumption_clientIp_key" ON "Consumption"("clientIp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
