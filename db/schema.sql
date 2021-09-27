DROP TABLE IF EXISTS "Marking";
DROP TABLE IF EXISTS "ChallengeParticipation";
DROP TABLE IF EXISTS "Challenge";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Quote";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE "User" (
  name varchar(254) PRIMARY KEY NOT NULL,
  password varchar(254) NOT NULL,
  is_private boolean DEFAULT true NOT NULL,
  email citext UNIQUE,
  is_email_verified boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_and_checked_participations uuid[] NOT NULL DEFAULT array[]::uuid[],
  has_checked_latest_update boolean DEFAULT false NOT NULL
);

CREATE TABLE "Quote" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote varchar(254) NOT NULL
);

CREATE TABLE "Challenge" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(254) NOT NULL UNIQUE,
  description text NOT NULL,
  creator_name varchar(254) NOT NULL,
  is_private boolean DEFAULT true NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone CHECK (start_date <= end_date), 
  FOREIGN KEY (creator_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "ChallengeParticipation" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_private boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  challenge_id uuid NOT NULL,
  user_name varchar(254) NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone CHECK (start_date <= end_date), 
  FOREIGN KEY (challenge_id) REFERENCES "Challenge"(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "Marking" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date timestamp with time zone NOT NULL,
  participation_id uuid NOT NULL,
  rating INT NOT NULL,
  comment varchar(2000),
  photo_url varchar(254),
  is_private boolean DEFAULT true NOT NULL,
  CHECK (rating BETWEEN 1 AND 5),
  FOREIGN KEY (participation_id) REFERENCES "ChallengeParticipation"(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ################## Mock data, commented because this comes from backend init-mock-data scripts ############### --

-- $2b$10$k1s1L0VXxCz48AKsRUDKEOGXhgJmihXhShEgFeh3JWfkmTXNlxmfe -> salasana, all users password are salasana in mock
-- INSERT INTO "User" (name, password, is_private)
-- VALUES 
--   ('Erkkipena', '$2b$10$k1s1L0VXxCz48AKsRUDKEOGXhgJmihXhShEgFeh3JWfkmTXNlxmfe', true),
--   ('Maakari', '$2b$10$k1s1L0VXxCz48AKsRUDKEOGXhgJmihXhShEgFeh3JWfkmTXNlxmfe', false),
--   ('ekeukko', '$2b$10$k1s1L0VXxCz48AKsRUDKEOGXhgJmihXhShEgFeh3JWfkmTXNlxmfe', false),
--   ('Marttila', '$2b$10$k1s1L0VXxCz48AKsRUDKEOGXhgJmihXhShEgFeh3JWfkmTXNlxmfe', false);


-- INSERT INTO "Challenge" (name, description, creator_name)
-- VALUES 
--   ('Lenkittelyvä - käynnissä oleva', 'Joka päivä jonkinlainen lenkki, kävellen tai juosten',  'ekeukko'),
--   ('Meditointia - mennyt', 'Joka päivä jonkinlainen lenkki, kävellen tai juosten',  'Maakari'),
--   ('Raakavegaanius - tuleva', 'Joka päivä jonkinlainen lenkki, kävellen tai juosten','Erkkipena'),
--   ('Raakavegaanius - ehdotus', 'Joka päivä jonkinlainen lenkki, kävellen tai juosten', 'Maakari');

-- INSERT INTO "ChallengeParticipation" (challenge_id, user_name)
-- VALUES ((SELECT id FROM "Challenge" WHERE name = 'Lenkittelyvä - käynnissä oleva'), 'Erkkipena');

-- INSERT INTO "Marking" (participation_id, comment, date)
-- VALUES 
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-03-05 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-03-04 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-03-03 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-03-02 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-03-01 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-02-28 12:00:00+02'),
--   ((SELECT id FROM "ChallengeParticipation" WHERE user_name = 'Erkkipena'), 'Ihanpa mukava lenkki', '2021-02-28 12:00:00+02');
