-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Marking" (
"id" SERIAL,
    "date" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "comment" TEXT,
    "userName" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marking" ADD FOREIGN KEY("userName")REFERENCES "User"("name") ON DELETE SET NULL ON UPDATE CASCADE;
