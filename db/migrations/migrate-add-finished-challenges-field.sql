ALTER TABLE "User" ADD COLUMN finished_and_checked_challenges uuid[];

UPDATE "User" SET finished_and_checked_challenges='{}';

ALTER TABLE "User" ALTER COLUMN finished_and_checked_challenges SET NOT NULL;

ALTER TABLE "User" ALTER COLUMN finished_and_checked_challenges SET DEFAULT array[]::uuid[];