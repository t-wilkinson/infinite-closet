-- `contacts` has a `metadata` column of type jsonb
-- This script maps some of the values in `metadata` to columns in the `contact` table

-- Return string or null if it is empty-like
CREATE OR REPLACE FUNCTION str_or_null(text) RETURNS text AS $$
    BEGIN
        RETURN (SELECT COALESCE(NULLIF($1, ''), NULLIF($1, ' '), NULLIF($1, 'undefined')));
    END;
$$ LANGUAGE plpgsql;

-- Select first str value that is not empty-like
-- There are potentially multiple columns with same information (ex: Name, name, firstName)
CREATE OR REPLACE FUNCTION empty(text, text) RETURNS text AS 'SELECT COALESCE(str_or_null($1), str_or_null($2))' LANGUAGE SQL;

-- contact.metadata :: jsonb
-- Need this to map metadata to sql row
DROP TYPE IF EXISTS subrow;
CREATE TYPE subrow AS (
    "name" text, "Name" text, "email" text, "Email" text, "phone" text, "firstName" text, "lastName" text, "dateOfBirth" text, "Subscribed" text,
    "guests" text, "promo" text, "paymentIntent" text, "Comment" text, "donation" text
);

-- db has columns of contact and creates row columns from contact.metadata
-- Also split metadata.{name,Name} to firstName and lastName
WITH db AS (
    SELECT
        *,
        trim(BOTH ' ' FROM substring(empty(db."name", db."Name") FROM '^\S+')) AS fname,
        trim(BOTH ' ' FROM substring(empty(db."name", db."Name") FROM '\s.*$')) AS lname
    FROM (SELECT id, (jsonb_populate_record(null::subrow, metadata)).* FROM contact)
    AS db
)
UPDATE contact
    SET
        "email" = empty(db."email", db."Email"),
        "subscribed" = CASE WHEN db."Subscribed"='Yes' THEN TRUE ELSE FALSE END,
        "phoneNumber" = db."phone",
        "firstName" = empty(db."firstName", db."fname"),
        "lastName" = empty(db."lastName", db."lname"),
        "dateOfBirth" = to_timestamp(str_or_null(db."dateOfBirth"), 'YYYY-MM-DD'),
        -- Rebuild metadata
        "metadata" = jsonb_build_object('guests', db."guests", 'promo', db."promo", 'paymentIntent', db."paymentIntent", 'comment', db."Comment", 'donation', db."donation")
FROM db
WHERE contact.id = db.id;
