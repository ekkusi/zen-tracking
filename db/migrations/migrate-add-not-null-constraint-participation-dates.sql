UPDATE "ChallengeParticipation" SET "start_date" = CURRENT_TIMESTAMP WHERE "start_date" IS NULL;
UPDATE "ChallengeParticipation" SET "end_date" = CURRENT_TIMESTAMP WHERE "end_date" IS NULL;

ALTER TABLE "ChallengeParticipation" ALTER COLUMN "start_date" SET NOT NULL;
ALTER TABLE "ChallengeParticipation" ALTER COLUMN "end_date" SET NOT NULL;