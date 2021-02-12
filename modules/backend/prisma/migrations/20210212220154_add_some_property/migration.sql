/*
  Warnings:

  - Added the required column `someNewProperty` to the `Marking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marking" ADD COLUMN     "someNewProperty" TEXT NOT NULL;
