CREATE TABLE "Challenge" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(254) NOT NULL UNIQUE,
  description text NOT NULL,
  creator_name varchar(254) NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone CHECK (start_date <= end_date), 
  FOREIGN KEY (creator_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "ChallengeParticipation" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id uuid NOT NULL,
  user_name varchar(254) NOT NULL,
  FOREIGN KEY (challenge_id) REFERENCES "Challenge"(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE (challenge_id, user_name)
);

ALTER TABLE "Marking" ADD COLUMN "participation_id" uuid;
ALTER TABLE "Marking" ADD CONSTRAINT "Marking_participation_id_fkey" FOREIGN KEY (participation_id) REFERENCES "ChallengeParticipation"(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO "Challenge" (name, creator_name, description)
VALUES ('NO_PARTICIPATION_MARKINGS_HOLDER', 'ekeukko', 'Haaste, jonka tarkoituksena on sisällyttää tyhjät merkkaukset, eli merkkaukset joilla ei ole haastetta. Käytetään vain virheen estona, ei oikeana haasteena.');

INSERT INTO "ChallengeParticipation" (user_name, challenge_id)
SELECT name, (SELECT id FROM "Challenge" WHERE name='NO_PARTICIPATION_MARKINGS_HOLDER') FROM "User"
WHERE "User".name IN (
    SELECT DISTINCT user_name FROM "Marking"
);

UPDATE "Marking" AS m
SET participation_id = c.id
FROM "ChallengeParticipation" AS c
WHERE c.user_name = m.user_name;

ALTER TABLE "Marking" ALTER COLUMN participation_id SET NOT NULL;
ALTER TABLE "ChallengeParticipation" ADD CONSTRAINT user_challenge_uniq UNIQUE (user_name, challenge_id);