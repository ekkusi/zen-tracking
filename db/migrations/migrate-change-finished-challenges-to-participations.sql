ALTER TABLE "User" ADD COLUMN finished_and_checked_participations uuid[] NOT NULL DEFAULT array[]::uuid[];

UPDATE "User" u
SET finished_and_checked_participations = ARRAY(
	SELECT cp.id
	FROM "ChallengeParticipation" as cp
	WHERE cp.challenge_id = ANY(u.finished_and_checked_challenges)
);

ALTER TABLE "User" DROP COLUMN finished_and_checked_challenges;