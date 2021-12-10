const reset = `DELETE FROM users;
DELETE FROM admins;
DELETE FROM languages;
DELETE FROM words;
DELETE FROM texts;
DELETE FROM translations;
DELETE FROM contexts;
DELETE FROM languagepairs;
DELETE FROM webdictionaries;`.split('\n');

export default reset;
