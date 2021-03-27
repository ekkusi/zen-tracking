ALTER TABLE "Marking" ADD COLUMN is_private boolean;

UPDATE "Marking" SET is_private=false;

ALTER TABLE "Marking" ALTER COLUMN is_private SET NOT NULL;

ALTER TABLE "Marking" ALTER COLUMN is_private SET DEFAULT true;

ALTER TABLE "Challenge" ADD COLUMN is_private boolean;

UPDATE "Challenge" SET is_private=false;

ALTER TABLE "Challenge" ALTER COLUMN is_private SET NOT NULL;

ALTER TABLE "Challenge" ALTER COLUMN is_private SET DEFAULT true;

ALTER TABLE "ChallengeParticipation" ADD COLUMN is_private boolean;

UPDATE "ChallengeParticipation" SET is_private=false;

ALTER TABLE "ChallengeParticipation" ALTER COLUMN is_private SET NOT NULL;

ALTER TABLE "ChallengeParticipation" ALTER COLUMN is_private SET DEFAULT true;
