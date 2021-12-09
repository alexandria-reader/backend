DROP TABLE IF EXISTS webdictionary_preferences;
DROP TABLE IF EXISTS users_words;
DROP TABLE IF EXISTS users_translations;
DROP TABLE IF EXISTS users_know_languages;
DROP TABLE IF EXISTS users_study_languages;
DROP TABLE IF EXISTS webdictionaries;
DROP TABLE IF EXISTS languagepairs;
DROP TABLE IF EXISTS contexts;
DROP TABLE IF EXISTS translations;
DROP TABLE IF EXISTS texts;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    username text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    email text UNIQUE NOT NULL
);


CREATE TABLE admins (
    user_id int PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE
);


/* language name must same as associated postgres dictionary name*/
CREATE TABLE languages (
    id varchar(4) PRIMARY KEY,
    "name" varchar(32) UNIQUE NOT NULL,
    google_translate_url text,
    each_char_is_word boolean DEFAULT false,
    is_right_to_left boolean DEFAULT false
);


CREATE TABLE words (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE,
    word text NOT NULL,
    ts_config regconfig NOT NULL,
    tsquery_simple tsquery
        GENERATED ALWAYS AS (phraseto_tsquery('simple', word)) STORED,
    tsquery_language tsquery
        GENERATED ALWAYS AS (phraseto_tsquery(ts_config, word)) STORED
);


CREATE TABLE texts (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id),
    language_id varchar(4) REFERENCES languages (id),
    title text NOT NULL,
    author text,
    body text NOT NULL,
    ts_config regconfig NOT NULL,
    tsvector_simple tsvector 
        GENERATED ALWAYS AS (to_tsvector('simple', title || ' ' || body)) STORED,
    tsvector_language tsvector
        GENERATED ALWAYS AS (to_tsvector(ts_config, title || ' ' || body)) STORED,
    source_url text,
    source_type text,
    upload_time timestamptz DEFAULT now(),
    is_public boolean DEFAULT false
);


CREATE INDEX ts_simple_idx ON texts USING GIN (tsvector_simple);
CREATE INDEX ts_language_idx ON texts USING GIN (tsvector_language);


CREATE TABLE translations (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    word_id int REFERENCES words (id) ON DELETE CASCADE,
    target_language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE,
    translation text NOT NULL
);


CREATE TABLE contexts (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    text_id int REFERENCES texts (id) ON DELETE CASCADE,
    translation_id int REFERENCES translations (id) ON DELETE CASCADE,
    snippet text NOT NULL
);


CREATE TABLE languagepairs (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    source_language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE,
    target_language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE
);


CREATE TABLE webdictionaries (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    language_pair_id int REFERENCES languagepairs (id) ON DELETE CASCADE,
    "name" text NOT NULL,
    "url" text NOT NULL
);


CREATE TABLE users_study_languages (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    study_language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE
);


CREATE TABLE users_know_languages (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    known_language_id varchar(4) REFERENCES languages (id) ON DELETE CASCADE,
    is_native boolean DEFAULT false
);


CREATE TABLE users_translations (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    translation_id int REFERENCES translations (id) ON DELETE CASCADE
);


CREATE TABLE users_words (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    word_id int REFERENCES words (id) ON DELETE CASCADE,
    word_status varchar(32) NOT NULL
);


CREATE TABLE webdictionary_preferences (
    id integer PRIMARY KEY GENERATED ALWAYS AS identity,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    webdictionary_id int REFERENCES webdictionaries (id) ON DELETE CASCADE
);
