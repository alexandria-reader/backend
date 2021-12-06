CREATE TABLE users(
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    email text UNIQUE NOT NULL
);


CREATE TABLE admins(
    user_id int PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
);


CREATE TABLE languages(
    id serial PRIMARY KEY,
    "name" text UNIQUE NOT NULL,
    abbreviation varchar(8) UNIQUE NOT NULL,
    google_translate_"url" text,
    each_char_is_word boolean DEFAULT false,
    is_right_to_left boolean DEFAULT false
);


CREATE TABLE words(
    id serial PRIMARY KEY,
    language_id int REFERENCES languages (id) ON DELETE CASCADE
    word text NOT NULL,
    ts_parsed_word tsquery,
    is_compound boolean NOT NULL
);


CREATE TABLE texts(
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id),
    language_id int REFERENCES languages (id),
    title text NOT NULL,
    author text,
    "text" text NOT NULL,
    ts_parsed_text tsvector,
    source_url text,
    source_type text,
    upload_time timestamptz DEFAULT now(),
    is_public boolean DEFAULT false
);


CREATE TABLE translations(
    id serial PRIMARY KEY,
    word_id int REFERENCES words (id) ON DELETE CASCADE,
    translation text NOT NULL,
    target_language_id int REFERENCES languages (id) ON DELETE CASCADE
);


CREATE TABLE contexts(
    id serial PRIMARY KEY,
    text_id int REFERENCES texts (id) ON DELETE CASCADE,
    translation_id int REFERENCES translations (id) ON DELETE CASCADE,
    snippet text NOT NULL
);


CREATE TABLE languagepairs (
    id serial PRIMARY KEY,
    source_language_id int REFERENCES languages (id) ON DELETE CASCADE,
    target_language_id int REFERENCES languages (id) ON DELETE CASCADE,
);


CREATE TABLE webdictionaries (
    id serial PRIMARY KEY,
    language_pair_id int REFERENCES languagepairs (id) ON DELETE CASCADE,
    "name" int NOT NULL,
    "url" int NOT NULL
);


CREATE TABLE users_study_languages(
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    study_language_id int REFERENCES languages (id) ON DELETE CASCADE
);


CREATE TABLE users_know_languages(
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    known_language_id int REFERENCES languages (id) ON DELETE CASCADE,
    is_native boolean NOT NULL
);


CREATE TABLE users_translations(
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    translation_id int REFERENCES translations (id) ON DELETE CASCADE,
);


CREATE TABLE users_words(
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    word_id int REFERENCES words (id) ON DELETE CASCADE,
    word_status varchar(64) NOT NULL
);


CREATE TABLE webdictionary_preferences (
    id serial PRIMARY KEY,
    user_id int REFERENCES users (id) ON DELETE CASCADE,
    webdictionary_id int REFERENCES webdictionaries (id) ON DELETE CASCADE
);