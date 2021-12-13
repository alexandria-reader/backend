const reset = `DELETE FROM webdictionaries;
DELETE FROM languagepairs;
DELETE FROM contexts;
DELETE FROM translations;
DELETE FROM texts;
DELETE FROM words;
DELETE FROM languages;
DELETE FROM admins;
DELETE FROM users;`.split('\n');

export default reset;
