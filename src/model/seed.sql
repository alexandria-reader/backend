DELETE FROM users;
DELETE FROM admins;
DELETE FROM languages;
DELETE FROM words;
DELETE FROM texts;
DELETE FROM translations;
DELETE FROM contexts;
DELETE FROM languagepairs;
DELETE FROM webdictionaries;

INSERT INTO users (username, password_hash, email)
VALUES
('test', 'pwhash', 'test@example.com');

INSERT INTO languages ("name", abbreviation)
VALUES
('English', 'en'),
('German', 'de'),
('French', 'fr');

INSERT INTO texts (user_id, language_id, title, "text", ts_parsed_text)
VALUES
(
1, 1, 'The Little Match Girl',
'It was so terribly cold. Snow was falling, and it was almost dark. Evening came on, the last evening of the year. In the cold and gloom a poor little girl, bareheaded and barefoot, was walking through the streets. Of course when she had left her house she''d had slippers on, but what good had they been? They were very big slippers, way too big for her, for they belonged to her mother. The little girl had lost them running across the road, where two carriages had rattled by terribly fast. One slipper she''d not been able to find again, and a boy had run off with the other, saying he could use it very well as a cradle some day when he had children of his own. And so the little girl walked on her naked feet, which were quite red and blue with the cold. In an old apron she carried several packages of matches, and she held a box of them in her hand. No one had bought any from her all day long, and no one had given her a cent.',
to_tsvector('It was so terribly cold. Snow was falling, and it was almost dark. Evening came on, the last evening of the year. In the cold and gloom a poor little girl, bareheaded and barefoot, was walking through the streets. Of course when she had left her house she''d had slippers on, but what good had they been? They were very big slippers, way too big for her, for they belonged to her mother. The little girl had lost them running across the road, where two carriages had rattled by terribly fast. One slipper she''d not been able to find again, and a boy had run off with the other, saying he could use it very well as a cradle some day when he had children of his own. And so the little girl walked on her naked feet, which were quite red and blue with the cold. In an old apron she carried several packages of matches, and she held a box of them in her hand. No one had bought any from her all day long, and no one had given her a cent.')
);

INSERT INTO words (language_id, word, ts_parsed_word, is_compound)
VALUES
(1, 'of course', phraseto_tsquery('of course'), true),
(1, 'hunger', phraseto_tsquery('hunger'), false),
(1, 'across the road', phraseto_tsquery('across the road'),true),
(1, 'hunger', phraseto_tsquery('hunger'), false),
(1, 'all day long', phraseto_tsquery('all day long'), true),
(1, 'snowflakes', phraseto_tsquery('snowflakes'), false),
(1, 'roast goose', phraseto_tsquery('roast goose'), true),
(1, 'bareheaded', phraseto_tsquery('bareheaded'),false),
(1, 'rattled by', phraseto_tsquery('rattled by'), true),
(1, 'carriages', phraseto_tsquery('carriages'), false),
(1, 'New Year''s eve', phraseto_tsquery('New Year''s eve'), true);

INSERT INTO users_words(user_id, word_id, word_status)
VALUES
(1, 1, 'learning'),
(1, 3, 'known'),
(1, 5, 'learning'),
(1, 7, 'known'),
(1, 9, 'learning');
