ALTER TABLE "ChallengeParticipation" ADD COLUMN start_date timestamp with time zone;
ALTER TABLE "ChallengeParticipation" ADD COLUMN end_date timestamp with time zone CHECK (start_date <= end_date);

UPDATE "ChallengeParticipation" AS cp
SET start_date = c.start_date, end_date = c.end_date
FROM "Challenge" as c
WHERE c.id = cp.challenge_id;
