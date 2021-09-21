ALTER TABLE "Challenge" ADD COLUMN "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "ChallengeParticipation" ADD COLUMN "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Challenge" SET "created_at" = COALESCE("start_date", CURRENT_TIMESTAMP);

UPDATE "ChallengeParticipation" SET "created_at" = COALESCE("start_date", CURRENT_TIMESTAMP);