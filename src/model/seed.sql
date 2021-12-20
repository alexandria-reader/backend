INSERT INTO users (username, password_hash, email)
VALUES
('eamon', 'eamonpwhash', 'eamon@example.com'),
('dana', 'danapwhash', 'dana@example.com'),
('marc', 'marcpwhash', 'marc@example.com');


INSERT INTO languages (id, "name") 
VALUES
('en', 'english'),
('de', 'german'),
('fr', 'french');


INSERT INTO texts (user_id, language_id, title, body, ts_config) 
VALUES
(1, 'en', 'The Little Match Girl', 
'It was so terribly cold. Snow was falling, and it was almost dark. Evening came on, the last evening of the year. In the cold and gloom a poor little girl, bareheaded and barefoot, was walking through the streets. Of course when she had left her house she''d had slippers on, but what good had they been? They were very big slippers, way too big for her, for they belonged to her mother. The little girl had lost them running across the road, where two carriages had rattled by terribly fast. One slipper she''d not been able to find again, and a boy had run off with the other, saying he could use it very well as a cradle some day when he had children of his own. And so the little girl walked on her naked feet, which were quite red and blue with the cold. In an old apron she carried several packages of matches, and she held a box of them in her hand. No one had bought any from her all day long, and no one had given her a cent.',
(SELECT "name" FROM languages AS l WHERE l.id = 'en')::regconfig),
(2, 'fr', 'Dans la « bibliothèque » de l’artiste zimbabwéen Kudzanai Chiurai',
'Lorsque la commissaire Marie Ann Yemsi a commencé à réfléchir à son exposition « Ubuntu, un rêve lucide », qui se tient au Palais de Tokyo à Paris, le nom de Kudzanai Chiurai était en haut de sa liste. Parce que le jeune artiste zimbabwéen « est dans l’audace et la complexité », précise-t-elle. Parce qu’il sait aussi creuser dans les replis de l’histoire pour faire émerger des récits oubliés et les « contre-mémoires ». Né en 1981, un an après l’indépendance de son pays, dans une famille très politisée, Kudzanai Chiurai a fait de l’histoire et des luttes coloniales la matière première d’une œuvre qui se décline dans des peintures, des photos et des films expérimentaux. Partant du constat que les archives du continent sont négligées et d’un accès difficile, il s’est mis à chiner depuis cinq ans les modestes reliques de la résistance à l’occupant britannique.',
(SELECT "name" FROM languages AS l WHERE l.id = 'fr')::regconfig),
(3, 'de', 'Boykott der Olympischen Spiele', 
'Die Unterdrückung der uigurischen Muslime in Xinjiang, das mysteriöse Verschwinden einer Tennisspielerin und Repressionen gegen die Demokratiebewegung in Hongkong – die Liste der Vorwürfe gegen China ist lang und triftig. Und doch scheint die Ankündigung der USA, keine Repräsentanten zu den Olympischen Winterspielen nach Peking zu schicken, wie das Werfen eines Wattebauschs. Die Formulierung diplomatischer Boykott besagt ja gerade, dass ein Boykott, demzufolge die Athleten eines ganzen Landes ihre Kufen ungeschliffen und die Skier ungewachst lassen, nicht infrage kommt. Das Fernbleiben vieler westlicher Sportteams bei den Sommerspielen 1980 in Moskau und der anschließende Boykott der Sowjetunion sowie 18 weiterer Mannschaften 1984 in Los Angeles waren ein Tiefpunkt der olympischen Idee, die doch die Überwindung politischer Konflikte in Aussicht stellt.',
(SELECT "name" FROM languages AS l WHERE l.id = 'de')::regconfig);



INSERT INTO words (language_id, word, ts_config)
VALUES
('en', 'of course', 'english'),
('en', 'hunger', 'english'),
('en', 'across the road', 'english'),
('en', 'all day long', 'english'),
('en', 'snowflakes', 'english'),
('en', 'roast goose', 'english'),
('en', 'bareheaded', 'english'),
('en', 'rattled by', 'english'),
('en', 'carriages', 'english'),
('en', 'New Year''s eve', 'english');


INSERT INTO translations (word_id, target_language_id, translation)
VALUES
(1, 'de', 'natürlich'),
(1, 'de', 'klar doch'),
(2, 'de', 'Hunger'),
(3, 'de', 'gegenüber'),
(3, 'de', 'über die Straße'),
(4, 'de', 'den ganzen Tag'),
(5, 'de', 'Schneeflocken'),
(6, 'de', 'Gänsebraten'),
(7, 'de', 'barhäuptig'),
(8, 'de', 'vorbeigeklappert'),
(9, 'de', 'Wagen'),
(10, 'de', 'Silvester'),
(1, 'fr', 'bien sûr'),
(2, 'fr', 'faim'),
(3, 'fr', 'à travers la route'),
(4, 'fr', 'toute la journée'),
(5, 'fr', 'flocons de neige'),
(6, 'fr', 'oie rôtie'),
(7, 'fr', 'tête nue'),
(8, 'fr', 'ébranlé par'),
(9, 'fr', 'chariots'),
(10, 'fr', 'Réveillon de Nouvel an');


INSERT INTO users_words (user_id, word_id, word_status)
VALUES
(1, 1, 'learning'),
(1, 3, 'familiar'),
(1, 5, 'learned'),
(1, 7, 'familiar'),
(1, 9, 'learning'),
(2, 2, 'learning'),
(2, 4, 'learned'),
(2, 6, 'learning'),
(2, 8, 'familiar'),
(2, 10, 'learning'),
(3, 1, 'learning'),
(3, 2, 'learned'),
(3, 5, 'learning'),
(3, 6, 'learned'),
(3, 7, 'learning');


INSERT INTO users_translations (user_id, translation_id, context)
VALUES
(1, 1, 'the streets. Of course when she had left'),
(1, 5, 'lost them running across the road, where two carriages'),
(1, 16, 'any from her all day long, and no one had'),
(2, 5, 'lost them running across the road, where two carriages'),
(2, 18, ''),
(2, 10, 'two carriages had rattled by terribly fast.'),
(3, 8, ''),
(3, 9, 'a poor little girl, bareheaded and barefoot, was'),
(3, 10, 'two carriages had rattled by terribly fast.');