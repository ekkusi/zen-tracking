DROP TABLE IF EXISTS "Marking";
DROP TABLE IF EXISTS "ChallengeParticipation";
DROP TABLE IF EXISTS "Challenge";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Quote";
DROP TYPE IF EXISTS "challenge_status";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "User" (
  name varchar(254) PRIMARY KEY NOT NULL,
  password varchar(254) NOT NULL,
  is_private boolean DEFAULT false NOT NULL
);

CREATE TABLE "Quote" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote varchar(254) NOT NULL
);

CREATE TYPE challenge_status AS ENUM ('SUGGESTION' , 'ACTIVE' , 'CLOSED');

CREATE TABLE "Challenge" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(254) NOT NULL,
  description text NOT NULL,
  status challenge_status NOT NULL,
  creator_name varchar(254) NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone CHECK (start_date > end_date), 
  FOREIGN KEY (creator_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "ChallengeParticipation" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id uuid NOT NULL,
  user_name varchar(254) NOT NULL,
  FOREIGN KEY (challenge_id) REFERENCES "Challenge"(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "Marking" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  participation_id uuid NOT NULL,
  comment varchar(2000),
  FOREIGN KEY (participation_id) REFERENCES "ChallengeParticipation"(id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO "User" (name, password, is_private)
VALUES 
  ('Erkkipena', 'salasana', true),
  ('Maakari', 'salasana', false);

INSERT INTO "Challenge" (name, description, status, creator_name)
VALUES ('Lenkittelyvä', 'Joka päivä jonkinlainen lenkki, kävellen tai juosten', 'SUGGESTION', 'Maakari');

INSERT INTO "ChallengeParticipation" (challenge_id, user_name)
VALUES ((SELECT id FROM "Challenge" WHERE name = 'Lenkittelyvä'), 'Erkkipena');

INSERT INTO "Marking" (participation_id, comment)
VALUES ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki');
