ALTER TABLE "Marking" ADD COLUMN rating INT;

ALTER TABLE "Marking" ADD CONSTRAINT check_rating_constraint CHECK (rating BETWEEN 1 AND 5);

UPDATE "Marking" SET rating=3;

ALTER TABLE "Marking" ALTER COLUMN rating SET NOT NULL;