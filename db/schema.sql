DROP TABLE IF EXISTS "Marking";
DROP TABLE IF EXISTS "User";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "User" (
  name varchar(254) PRIMARY KEY NOT NULL,
  password varchar(254) NOT NULL,
  is_private boolean DEFAULT false NOT NULL
);

CREATE TABLE "Marking" (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_name varchar(254) NOT NULL,
    comment varchar(2000),
    FOREIGN KEY (user_name) REFERENCES "User"(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "Quote" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote varchar(254) NOT NULL
);
