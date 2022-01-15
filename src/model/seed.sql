INSERT INTO languages (id, "name", flag) 
VALUES
('en', 'english', '🇬🇧'),
('de', 'german', '🇩🇪'),
('fr', 'french', '🇫🇷'),
('es', 'spanish', '🇪🇸'),
('nl', 'dutch', '🇳🇱'),
('it', 'italian', '🇮🇹'),
('pt', 'portuguese', '🇵🇹'),
('ro', 'romanian', '🇷🇴'),
('se', 'swedish', '🇸🇪'),
('tr', 'turkish', '🇹🇷');


INSERT INTO users (username, password_hash, email, known_language_id, learn_language_id, verified)
VALUES
('Eamon', '$2a$10$kdYq/uADgMFVvqjPsQFgouDwWVHxGf66U2YxinRwLhFJ4ed/mksMy', 'eamon@example.com', 'de', 'en', true),
('Dana', '$2a$10$UVTYPTdo1W/U5cBhkX6s9.T7d5QLzXvNTLS00BGJ2jUcW/MxvFCqO', 'dana@example.com', 'fr', 'de', false),
('Marc', 'marcpwhash', 'marc@example.com', 'en', 'fr', false);


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
(10, 'fr', 'Réveillon de Nouvel an'),
(8, 'de', 'vorbeigescheppert'),
(8, 'de', 'vorbeigaloppiert');


INSERT INTO users_words (user_id, word_id, word_status)
VALUES
(1, 1, 'learning'),
(1, 3, 'familiar'),
(1, 5, 'learned'),
(1, 6, 'familiar'),
(1, 7, 'familiar'),
(1, 8, 'learned'),
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
(1, 8, 'context from another text'),
(1, 16, 'any from her all day long, and no one had'),
(1, 10, 'two carriages had rattled by terribly fast.'),
(1, 23, 'two brass bands had rattled by terribly fast.'),
(1, 24, 'two horses had rattled by terribly fast.'),
(2, 5, 'lost them running across the road, where two carriages'),
(2, 18, ''),
(2, 10, 'two carriages had rattled by terribly fast.'),
(3, 8, ''),
(3, 9, 'a poor little girl, bareheaded and barefoot, was'),
(3, 10, 'two carriages had rattled by terribly fast.');


INSERT INTO webdictionaries (source_language_id, target_language_id, name, url)
VALUES
('en', 'de', 'WordReference.com Englisch - Deutsch', 'https://www.wordreference.com/ende'),
('de', 'en', 'WordReference.com German - English', 'https://www.wordreference.com/deen'),
('en', 'fr', 'WordReference.com Anglais - Francais', 'https://www.wordreference.com/enfr'),
('fr', 'en', 'WordReference.com French - English', 'https://www.wordreference.com/fren'),
('en', 'es', 'WordReference.com Inglés - Espanol', 'https://www.wordreference.com/enes'),
('es', 'en', 'WordReference.com Spanish - English', 'https://www.wordreference.com/esen'),
('en', 'nl', 'WordReference.com Engels - Nederlands', 'https://www.wordreference.com/ennl'),
('nl', 'en', 'WordReference.com Dutch - English', 'https://www.wordreference.com/nlen'),
('en', 'it', 'WordReference.com Inglese - Italiano', 'https://www.wordreference.com/enit'),
('it', 'en', 'WordReference.com Italian - English', 'https://www.wordreference.com/iten'),
('en', 'pt', 'WordReference.com Inglês - Português', 'https://www.wordreference.com/enpt'),
('pt', 'en', 'WordReference.com Portuguese - English', 'https://www.wordreference.com/pten'),
('en', 'ro', 'WordReference.com Englez - Român', 'https://www.wordreference.com/enro'),
('ro', 'en', 'WordReference.com Romanian - English', 'https://www.wordreference.com/roen'),
('en', 'se', 'WordReference.com Engelsk - Svenska', 'https://www.wordreference.com/ensv'),
('se', 'en', 'WordReference.com Swedish - English', 'https://www.wordreference.com/sven'),
('en', 'tr', 'WordReference.com İngilizce - Türkçe', 'https://www.wordreference.com/entr'),
('tr', 'en', 'WordReference.com Turkish - English', 'https://www.wordreference.com/tren'),
('fr', 'es', 'WordReference.com French - Spanish', 'https://www.wordreference.com/fres'),
('es', 'fr', 'WordReference.com Spanish - French', 'https://www.wordreference.com/esfr'),
('it', 'es', 'WordReference.com Italian - Spanish', 'https://www.wordreference.com/ites'),
('es', 'it', 'WordReference.com Spanish - Italian', 'https://www.wordreference.com/esit'),
('pt', 'es', 'WordReference.com Portuguese - Spanish', 'https://www.wordreference.com/ptes'),
('es', 'pt', 'WordReference.com Spanish - Portuguese', 'https://www.wordreference.com/espt'),
('de', 'es', 'WordReference.com German - Spanish', 'https://www.wordreference.com/dees'),
('es', 'de', 'WordReference.com Spanisch - Deutsch', 'https://www.wordreference.com/esde');

INSERT INTO match_girl (language_id, title, body) 
VALUES
('en', 'The Little Match Girl', 
'It was so terribly cold. Snow was falling, and it was almost dark. Evening came on, the last evening of the year. 
In the cold and gloom a poor little girl, bareheaded and barefoot, was walking through the streets. 
Of course when she had left her house she''d had slippers on, but what good had they been? 
They were very big slippers, way too big for her, for they belonged to her mother. 
The little girl had lost them running across the road, where two carriages had rattled by terribly fast. 
One slipper she''d not been able to find again, and a boy had run off with the other, saying he could use it very well as a cradle some day when he had children of his own. 
And so the little girl walked on her naked feet, which were quite red and blue with the cold. 
In an old apron she carried several packages of matches, and she held a box of them in her hand. 
No one had bought any from her all day long, and no one had given her a cent.
\n
Shivering with cold and hunger, she crept along, a picture of misery, poor little girl! 
The snowflakes fell on her long fair hair, which hung in pretty curls over her neck. 
In all the windows lights were shining, and there was a wonderful smell of roast goose, for it was New Year''s eve. Yes, she thought of that!
\n
In a corner formed by two houses, one of which projected farther out into the street than the other, she sat down and drew up her little feet under her. 
She was getting colder and colder, but did not dare to go home, for she had sold no matches, nor earned a single cent, and her father would surely beat her. 
Besides, it was cold at home, for they had nothing over them but a roof through which the wind whistled even though the biggest cracks had been stuffed with straw and rags.'),

('de', 'Das kleine Mädchen mit den Schwefelhölzern', 
'Es war fürchterlich kalt; es schneite und begann dunkler Abend zu werden, es war der letzte Abend im Jahre, Neujahrsabend! 
In dieser Kälte und in dieser Finsternis ging ein kleines, armes Mädchen mit bloßem Kopfe und nackten Füßen auf der Straße. 
Sie hatte freilich Pantoffeln gehabt, als sie vom Hause wegging, aber was half das! 
Es waren sehr große Pantoffeln, ihre Mutter hatte sie zuletzt getragen, so groß waren sie, diese verlor die Kleine, als sie sich beeilte, über die Straße zu gelangen, indem zwei Wagen gewaltig schnell daher jagten. 
Der eine Pantoffel war nicht wieder zu finden und mit dem andern lief ein Knabe davon, der sagte, er könne ihn als Wiege benutzen, wenn er selbst einmal Kinder bekomme.
\n
Da ging nun das arme Mädchen auf den bloßen, kleinen Füßen, die ganz rot und blau vor Kälte waren. 
In einer alten Schürze hielt sie eine Menge Schwefelhölzer und ein Bund trug sie in der Hand. 
Niemand hatte ihr während des ganzen Tages etwas abgekauft, niemand hatte ihr auch nur einen Dreier geschenkt; 
hungrig und halberfroren schlich sie einher und sah sehr gedrückt aus, die arme Kleine! 
Die Schneeflocken fielen in ihr langes, gelbes Haar, welches sich schön über den Hals lockte, aber an Pracht dachte sie freilich nicht.
\n
In einem Winkel zwischen zwei Häusern – das eine sprang etwas weiter in die Straße vor, als das andere – da setzte sie sich und kauerte sich zusammen. 
Die kleinen Füße hatte sie fest angezogen, aber es fror sie noch mehr, und sie wagte nicht nach Hause zu gehen, denn sie hatte ja keine Schwefelhölzer verkauft, nicht einen einzigen Dreier erhalten. 
Ihr Vater würde sie schlagen, und kalt war es daheim auch, sie hatten nur das Dach gerade über sich und da pfiff der Wind herein, obgleich Stroh und Lappen zwischen die größten Spalten gestopft waren.'),

('fr', '',
'Il faisait effroyablement froid; il neigeait depuis le matin; il faisait déjà sombre; le soir approchait, le soir du dernier jour de l''année. 
Au milieu des rafales, par ce froid glacial, une pauvre petite fille marchait dans la rue: elle n''avait rien sur la tête, elle était pieds nus. 
Lorsqu''elle était sortie de chez elle le matin, elle avait eu de vieilles pantoufles beaucoup trop grandes pour elle. 
Aussi les perdit-elle lorsqu''elle eut à se sauver devant une file de voitures; les voitures passées, elle chercha après ses chaussures; un méchant gamin s''enfuyait emportant en riant l''une des pantoufles; l''autre avait été entièrement écrasée.
\n
Voilà la malheureuse enfant n''ayant plus rien pour abriter ses pauvres petits petons. Dans son vieux tablier, elle portait des allumettes: elle en tenait à la main un paquet. 
Mais, ce jour, la veille du nouvel an, tout le monde était affairé; par cet affreux temps, personne ne s''arrêtait pour considérer l''air suppliant de la petite qui faisait pitié. 
La journée finissait, et elle n''avait pas encore vendu un seul paquet d''allumettes. Tremblante de froid et de faim, elle se traînait de rue en rue.
\n
Des flocons de neige couvraient sa longue chevelure blonde. De toutes les fenêtres brillaient des lumières: 
de presque toutes les maisons sortait une délicieuse odeur, celle de l''oie, qu''on rôtissait pour le festin du soir: c''était la Saint-Sylvestre. 
Cela, oui, cela lui faisait arrêter ses pas errants.
\n
Enfin, après avoir une dernière fois offert en vain son paquet d''allumettes, l''enfant aperçoit une encoignure entre deux maisons, dont l''une dépassait un peu l''autre. 
Harassée, elle s''y assied et s''y blottit, tirant à elle ses petits pieds: mais elle grelotte et frissonne encore plus qu''avant et cependant elle n''ose rentrer chez elle. 
Elle n''y rapporterait pas la plus petite monnaie, et son père la battrait.');