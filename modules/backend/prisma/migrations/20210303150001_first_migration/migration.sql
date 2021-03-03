/*
  Warnings:

  - The migration will change the primary key for the `Marking` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userName` on the `Marking` table. All the data in the column will be lost.
  - You are about to drop the column `activities` on the `Marking` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_name` to the `Marking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Marking" DROP CONSTRAINT "Marking_userName_fkey";

-- AlterTable
ALTER TABLE "Marking" DROP CONSTRAINT "Marking_pkey",
DROP COLUMN "userName",
DROP COLUMN "activities",
ADD COLUMN     "user_name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Marking_id_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPrivate",
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marking" ADD FOREIGN KEY("user_name")REFERENCES "User"("name") ON DELETE CASCADE ON UPDATE CASCADE;
