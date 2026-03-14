use streamingDB;

-- ########################################################################################################
-- LOGICALLY COMPLETE SAMPLE DATA  (EXPANDED — 2–3× ORIGINAL, WITH REALISTIC TIMESTAMPS)
--
-- Insertion order respects ALL foreign key dependencies:
--   Timezone, ContentRating, Genre, LanguageList, Person  (fully independent)
--   → Country  (needs Timezone)
--   → AppUser, Content  (both need Country; Content also needs ContentRating)
--   → everything else
-- ########################################################################################################


-- ══════════════════════════════════════════════════════════════════════
-- 1. FULLY INDEPENDENT TABLES
-- ══════════════════════════════════════════════════════════════════════

-- ── Timezone ──────────────────────────────────────────────────────────
-- TimezoneID (by insertion order):
--   1=UTC               2=Asia/Bangkok      3=Asia/Tokyo
--   4=Asia/Shanghai     5=Asia/Seoul        6=Europe/Berlin
--   7=Europe/London     8=Europe/Paris      9=America/New_York
--  10=America/Chicago  11=America/Los_Angeles  12=Australia/Sydney
--  13=Pacific/Auckland 14=America/Sao_Paulo 15=America/Mexico_City
INSERT INTO Timezone (IANA_Name, Current_Offset) VALUES
('UTC',                 '+00:00'),  -- 1
('Asia/Bangkok',        '+07:00'),  -- 2
('Asia/Tokyo',          '+09:00'),  -- 3
('Asia/Shanghai',       '+08:00'),  -- 4
('Asia/Seoul',          '+09:00'),  -- 5
('Europe/Berlin',       '+01:00'),  -- 6
('Europe/London',       '+00:00'),  -- 7
('Europe/Paris',        '+01:00'),  -- 8
('America/New_York',    '-05:00'),  -- 9
('America/Chicago',     '-06:00'),  -- 10
('America/Los_Angeles', '-08:00'),  -- 11
('Australia/Sydney',    '+11:00'),  -- 12
('Pacific/Auckland',    '+13:00'),  -- 13
('America/Sao_Paulo',   '-03:00'),  -- 14
('America/Mexico_City', '-06:00');  -- 15

-- ── ContentRating ─────────────────────────────────────────────────────
-- Using a familiar TV/film-style rating system.
-- MaturityLevel 1 (youngest) → 5 (adults only).
-- RatingID (by insertion order):
--   1=G   2=PG   3=PG-13   4=TV-14   5=R   6=TV-MA   7=NC-17
INSERT INTO ContentRating (RatingLabel, MaturityLevel, Description) VALUES
('G',      1, 'General Audiences — suitable for all ages.'),
('PG',     2, 'Parental Guidance suggested — some material may not suit young children.'),
('PG-13',  3, 'Parents strongly cautioned — some material may be inappropriate for children under 13.'),
('TV-14',  4, 'Parents strongly cautioned for children under 14 — contains intense content.'),
('R',      5, 'Restricted — under 17 requires accompanying parent or adult guardian.'),
('TV-MA',  5, 'Mature Audiences Only — may be unsuitable for children under 17.'),
('NC-17',  5, 'Adults Only — no one 17 and under admitted.');

-- ── Genre ─────────────────────────────────────────────────────────────
-- GenreID: 1=Sci-Fi 2=Anime 3=Comedy 4=Action 5=Mystery 6=Thriller
--          7=Romance 8=Horror 9=Documentary 10=Fantasy 11=Drama
--          12=Adventure 13=Crime 14=Historical 15=Psychological
INSERT INTO Genre (GenreName) VALUES 
('Sci-Fi'), ('Anime'), ('Comedy'), ('Action'), ('Mystery'),
('Thriller'), ('Romance'), ('Horror'), ('Documentary'), ('Fantasy'),
('Drama'), ('Adventure'), ('Crime'), ('Historical'), ('Psychological');

-- ── LanguageList ──────────────────────────────────────────────────────
-- LanguageID: 1=English 2=Thai 3=Japanese 4=Spanish 5=Korean 6=French
--             7=German 8=Mandarin 9=Italian 10=Russian
INSERT INTO LanguageList (langName) VALUES 
('English'), ('Thai'), ('Japanese'), ('Spanish'), ('Korean'),
('French'), ('German'), ('Mandarin'), ('Italian'), ('Russian'),
('Portuguese'), ('Arabic'), ('Hindi'), ('Turkish'), ('Dutch');

-- ── Person ────────────────────────────────────────────────────────────
INSERT INTO Person (fName, mName, lName, Nationality, BirthDate) VALUES 
('Christopher',  NULL,      'Nolan',       'British',      '1970-07-30'), -- 1
('Tatsuya',      NULL,      'Endo',        'Japanese',     '1980-07-23'), -- 2
('Steve',        NULL,      'Carell',      'American',     '1962-08-16'), -- 3
('Heath',        NULL,      'Ledger',      'Australian',   '1979-04-04'), -- 4
('Eiichiro',     NULL,      'Oda',         'Japanese',     '1975-01-01'), -- 5
('Bryan',        NULL,      'Cranston',    'American',     '1956-03-07'), -- 6
('Zendaya',      NULL,      'Coleman',     'American',     '1996-09-01'), -- 7
('Bong',         NULL,      'Joon-ho',     'Korean',       '1969-09-14'), -- 8
('Pedro',        NULL,      'Pascal',      'Chilean',      '1975-04-02'), -- 9
('Michelle',     NULL,      'Yeoh',        'Malaysian',    '1962-08-06'), -- 10
('Hajime',       NULL,      'Isayama',     'Japanese',     '1986-08-29'), -- 11
('Quentin',      NULL,      'Tarantino',   'American',     '1963-03-27'), -- 12
('Martin',       NULL,      'Scorsese',    'American',     '1942-11-17'), -- 13
('Denis',        NULL,      'Villeneuve',  'Canadian',     '1967-10-03'), -- 14
('Makoto',       NULL,      'Shinkai',     'Japanese',     '1973-02-09'), -- 15
('Hayao',        NULL,      'Miyazaki',    'Japanese',     '1941-01-05'), -- 16
('Greta',        NULL,      'Gerwig',      'American',     '1983-08-04'), -- 17
('Wes',          NULL,      'Anderson',    'American',     '1969-05-01'), -- 18
('Guillermo',    NULL,      'del Toro',    'Mexican',      '1964-10-09'), -- 19
('Taika',        NULL,      'Waititi',     'New Zealand',  '1975-08-16'), -- 20
('Masashi',      NULL,      'Kishimoto',   'Japanese',     '1974-11-08'), -- 21
('Akira',        NULL,      'Toriyama',    'Japanese',     '1955-05-05'), -- 22
('Koyoharu',     NULL,      'Gotouge',     'Japanese',     '1989-05-05'), -- 23
('Hiromu',       NULL,      'Arakawa',     'Japanese',     '1973-05-08'), -- 24
('Aaron',        NULL,      'Paul',        'American',     '1979-08-27'), -- 25
('Anna',         NULL,      'Gunn',        'American',     '1968-08-11'), -- 26
('Millie',       'Bobby',   'Brown',       'British',      '2004-02-19'), -- 27
('Winona',       NULL,      'Ryder',       'American',     '1971-10-29'), -- 28
('Al',           NULL,      'Pacino',      'American',     '1940-04-25'), -- 29
('Marlon',       NULL,      'Brando',      'American',     '1924-04-03'), -- 30
('Timothee',     NULL,      'Chalamet',    'American',     '1995-12-27'), -- 31
('Zoe',          NULL,      'Saldana',     'American',     '1978-06-19'), -- 32
('Ryan',         NULL,      'Gosling',     'Canadian',     '1980-11-12'), -- 33
('Cate',         NULL,      'Blanchett',   'Australian',   '1969-05-14'), -- 34
('Tom',          NULL,      'Hanks',       'American',     '1956-07-09'); -- 35


-- ══════════════════════════════════════════════════════════════════════
-- 2. TABLES THAT DEPEND ON Timezone
-- ══════════════════════════════════════════════════════════════════════

-- ── Country ───────────────────────────────────────────────────────────
-- CountryID: 1=Thailand 2=China 3=Germany 4=Japan 5=United States
--            6=South Korea 7=France 8=United Kingdom 9=Australia 10=Brazil
--           11=Mexico 12=New Zealand 13=Canada 14=Spain 15=Italy
INSERT INTO Country (CountryName, PrimaryTimezoneID) VALUES
('Thailand',         2),   -- 1  → Asia/Bangkok
('China',            4),   -- 2  → Asia/Shanghai
('Germany',          6),   -- 3  → Europe/Berlin
('Japan',            3),   -- 4  → Asia/Tokyo
('United States',    9),   -- 5  → America/New_York
('South Korea',      5),   -- 6  → Asia/Seoul
('France',           8),   -- 7  → Europe/Paris
('United Kingdom',   7),   -- 8  → Europe/London
('Australia',       12),   -- 9  → Australia/Sydney
('Brazil',          14),   -- 10 → America/Sao_Paulo
('Mexico',          15),   -- 11 → America/Mexico_City
('New Zealand',     13),   -- 12 → Pacific/Auckland
('Canada',          10),   -- 13 → America/Chicago
('Spain',            8),   -- 14 → Europe/Paris (UTC+1, same offset)
('Italy',            8);   -- 15 → Europe/Paris (UTC+1, same offset)


-- ══════════════════════════════════════════════════════════════════════
-- 3. TABLES THAT DEPEND ON Country
-- ══════════════════════════════════════════════════════════════════════

-- ── AppUser (with CountryID) ──────────────────────────────────────────
-- Country assignment rationale (lore-faithful):
--   Wirachat_Admin            → Thailand (1)    KMUTT is a Thai university
--   GenshinLover              → China    (2)    Genshin Impact is a Chinese game
--   Anya_Fans                 → Germany  (3)    Spy x Family is set in "Berlint"
--   One Piece crew (10 users) → Japan    (4)    Manga/anime origin country
--   Law_Heart                 → Spain   (14)    Flevance has a Mediterranean feel
--   Kid_Metal                 → Australia (9)   Punk / frontier energy
--   Hancock_Love              → South Korea (6) K-beauty queen vibes
--   Ace_Fire, Sabo_Dragon     → Brazil  (10)    Tropical / revolutionary spirit
--   Shanks_Red                → United Kingdom (8) Red-haired European seafarer
--   Buggy_Clown               → Italy   (15)    Circus / commedia dell'arte flair
--   Naruto crew (5 users)     → Japan    (4)    Hidden Leaf Village
--   Goku, Vegeta, Bulma       → United States (5) DBZ English-dub cultural home
--   Tanjiro, Nezuko           → Japan    (4)    Taisho-era Japan setting
--   FMA & AoT crews (10 users)→ Germany  (3)    Amestris / the Walls are Central-Europe inspired
--
-- RegisterDate waves:
--   Wave 1 (IDs 1–10)  → early adopters 2021
--   Wave 2 (IDs 11–20) → mid-growth     2022
--   Wave 3 (IDs 21–30) → expansion      2023
--   Wave 4 (IDs 31–40) → recent users   2024
INSERT INTO AppUser (Username, Email, Password, RegisterDate, CountryID, UserType) VALUES
('Wirachat_Admin',   'wirachat@kmutt.ac.th',    'safe123',       '2021-01-15 09:00:00',  1,  'Admin'),     -- Thailand
('GenshinLover',     'traveler@teyvat.com',      'paimon',        '2021-02-03 14:22:11',  2,  'Premium'),   -- China
('Anya_Fans',        'wakuwaku@spy.com',         'peanuts',       '2021-03-18 08:45:30',  3,  'Free'),      -- Germany
('Luffy_Pirate',     'luffy@grandline.com',      'meat',          '2021-05-07 20:10:05',  4,  'Premium'),   -- Japan
('Zoro_Lost',        'zoro@swords.com',          'bushido',       '2021-06-14 11:33:47',  4,  'Free'),      -- Japan
('Nami_Money',       'nami@berries.com',         'gold',          '2021-07-29 16:55:22',  4,  'Premium'),   -- Japan
('Sanji_Cook',       'sanji@allblue.com',        'mellorine',     '2021-08-05 07:12:59',  4,  'Free'),      -- Japan
('Robin_History',    'robin@ohara.com',          'archaeology',   '2021-09-20 13:40:00',  4,  'Premium'),   -- Japan
('Chopper_Doc',      'chopper@drum.com',         'candy',         '2021-10-11 19:08:34',  4,  'Free'),      -- Japan
('Franky_Super',     'franky@water7.com',        'cola',          '2021-11-28 10:27:16',  4,  'Premium'),   -- Japan
-- Wave 2
('Brook_Soul',       'brook@soul.com',           'laboon',        '2022-01-04 22:15:50',  4,  'Free'),      -- Japan
('Jimbei_Fish',      'jimbei@sea.com',           'karate',        '2022-02-17 09:03:41',  4,  'Premium'),   -- Japan
('Usopp_Sniper',     'usopp@brave.com',          'popgreen',      '2022-03-30 15:49:07',  4,  'Free'),      -- Japan
('Law_Heart',        'law@op.com',               'shambles',      '2022-05-12 18:22:33', 14,  'Premium'),   -- Spain
('Kid_Metal',        'kid@punk.com',             'magnet',        '2022-06-08 06:57:44',  9,  'Free'),      -- Australia
('Hancock_Love',     'hancock@kuja.com',         'salome',        '2022-08-01 12:34:19',  6,  'Premium'),   -- South Korea
('Ace_Fire',         'ace@spade.com',            'meramera',      '2022-09-23 21:05:02', 10,  'Free'),      -- Brazil
('Sabo_Dragon',      'sabo@rev.com',             'dragonclaw',    '2022-10-16 17:48:55', 10,  'Premium'),   -- Brazil
('Shanks_Red',       'shanks@yonko.com',         'haki',          '2022-11-07 08:31:28',  8,  'Free'),      -- United Kingdom
('Buggy_Clown',      'buggy@cross.com',          'flashy',        '2022-12-25 23:59:00', 15,  'Premium'),   -- Italy
-- Wave 3
('Naruto_Uzumaki',   'naruto@konoha.com',        'dattebayo',     '2023-01-09 10:14:37',  4,  'Premium'),   -- Japan
('Sasuke_Uchiha',    'sasuke@avenger.com',       'chidori',       '2023-02-14 14:00:00',  4,  'Free'),      -- Japan
('Sakura_Haruno',    'sakura@medic.com',         'shannaro',      '2023-03-22 09:30:15',  4,  'Premium'),   -- Japan
('Kakashi_Sensei',   'kakashi@sharingan.com',    'copycat',       '2023-04-01 00:00:01',  4,  'Free'),      -- Japan
('Itachi_Crow',      'itachi@akatsuki.com',      'tsukuyomi',     '2023-05-18 03:33:33',  4,  'Premium'),   -- Japan
('Goku_Saiyan',      'goku@capsule.com',         'kamehameha',    '2023-06-29 12:00:00',  5,  'Free'),      -- United States
('Vegeta_Prince',    'vegeta@saiyan.com',        'finalflash',    '2023-07-04 08:08:08',  5,  'Premium'),   -- United States
('Bulma_Genius',     'bulma@brief.com',          'dragonball',    '2023-08-15 16:45:20',  5,  'Free'),      -- United States
('Tanjiro_Blade',    'tanjiro@hashira.com',      'hinokami',      '2023-09-03 11:22:44',  4,  'Premium'),   -- Japan
('Nezuko_Box',       'nezuko@demon.com',         'bamboo',        '2023-10-10 19:55:10',  4,  'Free'),      -- Japan
-- Wave 4
('Edward_Elric',     'edward@alchemy.com',       'equivalent',    '2024-01-07 08:00:00',  3,  'Premium'),   -- Germany
('Roy_Mustang',      'roy@flame.com',            'colonel',       '2024-02-14 09:14:59',  3,  'Free'),      -- Germany
('Mikasa_Ackerman',  'mikasa@survey.com',        'scarf',         '2024-03-05 07:30:00',  3,  'Premium'),   -- Germany
('Armin_Strategist', 'armin@brain.com',          'colossal',      '2024-04-18 13:13:13',  3,  'Free'),      -- Germany
('Levi_Captain',     'levi@clean.com',           'HumanitysBest', '2024-05-01 05:00:00',  3,  'Premium'),   -- Germany
('Sasha_Potato',     'sasha@potato.com',         'potatoes',      '2024-06-20 12:30:00',  3,  'Free'),      -- Germany
('Historia_Queen',   'historia@wall.com',        'reiss',         '2024-07-14 18:00:00',  3,  'Premium'),   -- Germany
('Erwin_Smith',      'erwin@commander.com',      'chargefwd',     '2024-08-09 06:45:00',  3,  'Free'),      -- Germany
('Hange_Zoe',        'hange@titan.com',          'experiment',    '2024-09-27 20:20:20',  3,  'Premium'),   -- Germany
('Reiner_Armor',     'reiner@warrior.com',       'bertholt',      '2024-11-11 11:11:11',  3,  'Free');      -- Germany


-- ══════════════════════════════════════════════════════════════════════
-- 4. CONTENT (IDs 1–35, with RatingID + CountryID)
-- ══════════════════════════════════════════════════════════════════════
-- RatingID reference:
--   1=G      → All ages, no concerning content
--   2=PG     → Mild themes, suitable with parental guidance
--   3=PG-13  → Moderate intensity, fine for teens
--   4=TV-14  → Intense themes, violence, or language for 14+
--   5=R      → Mature theatrical film (strong violence/language)
--   6=TV-MA  → Mature TV series (explicit content)
--   7=NC-17  → Adults only (not used here; no content warrants it)
--
-- Rating assignment reasoning per title:
--   G      : Spirited Away, Princess Mononoke (family friendly Ghibli)
--   PG     : Dragon Ball Z, Naruto (action for kids/teens, mild violence)
--   PG-13  : Interstellar, Inception, Dune 1&2, Oppenheimer, Your Name,
--             Blade Runner 2049, Grand Budapest Hotel, Everything Everywhere,
--             Demon Slayer, FMA Brotherhood, Arcane, Spy x Family, One Piece
--   TV-14  : Attack on Titan, Jujutsu Kaisen, Stranger Things, Mandalorian,
--             Severance, The Bear, Better Call Saul, Chernobyl, Squid Game
--   R      : The Dark Knight, Tenet, Parasite, The Godfather, Goodfellas,
--             Pulp Fiction, Dune Part Two
--   TV-MA  : Breaking Bad, Better Call Saul (note: listed as TV-14 above
--             for BCS early seasons; Breaking Bad clearly TV-MA),
--             Squid Game, Chernobyl, The Office (TV-14 fits better actually)
--
-- Final clean mapping (one rating per title, no contradictions):
--   G(1):     19, 33
--   PG(2):    21, 22
--   PG-13(3): 1, 2, 4, 5, 7, 8, 14, 23, 24, 25, 27, 30, 32
--   TV-14(4): 3, 9, 10, 15, 17, 20, 26, 31, 35
--   R(5):     11, 12, 13, 18, 28, 34
--   TV-MA(6): 6, 16, 29
--
-- CountryID (production country):
--   Nolan films     → United Kingdom (8)
--   Villeneuve films→ Canada (13)
--   US productions  → United States (5)
--   Japanese anime  → Japan (4)
--   Korean originals→ South Korea (6)
--   Arcane          → France (7)   (Fortiche Production, Paris)
--   Chernobyl       → United Kingdom (8)  (HBO/Sky UK co-production)
--   Grand Budapest  → Germany (3)  (Babelsberg Studios co-production)
INSERT INTO Content (Title, Description, ReleaseDate, Price, ContentType, RatingID, CountryID) VALUES
('Interstellar',                     'Space exploration.',                          '2014-11-07',  9.99,  'Movie',    3,  8),  -- 1
('Spy x Family',                     'Spy family.',                                 '2022-04-09',  19.99, 'TV_Show',  3,  4),  -- 2
('The Office',                       'Paper company.',                              '2005-03-24',  24.99, 'TV_Show',  4,  5),  -- 3
('Inception',                        'Dream heist.',                                '2010-07-16',  7.99,  'Movie',    3,  8),  -- 4
('One Piece',                        'Pirate treasure.',                            '1999-10-20',  49.99, 'TV_Show',  3,  4),  -- 5
('Breaking Bad',                     'Chemistry teacher.',                          '2008-01-20',  29.99, 'TV_Show',  6,  5),  -- 6
('Your Name',                        'Star-crossed swap.',                          '2016-08-26',  12.99, 'Movie',    3,  4),  -- 7
('Dune',                             'Spice wars.',                                 '2021-10-22',  14.99, 'Movie',    3, 13),  -- 8
('Attack on Titan',                  'Giant war.',                                  '2013-04-07',  35.00, 'TV_Show',  4,  4),  -- 9
('The Mandalorian',                  'Bounty hunter.',                              '2019-11-12',  19.99, 'TV_Show',  4,  5),  -- 10
('Parasite',                         'Class struggle.',                             '2019-05-30',  9.50,  'Movie',    5,  6),  -- 11
('The Dark Knight',                  'Gotham hero.',                                '2008-07-18',  5.99,  'Movie',    5,  8),  -- 12
('Tenet',                            'Reverse time.',                               '2020-08-26',  11.99, 'Movie',    5,  8),  -- 13
('Everything Everywhere All at Once','Multiverse.',                                 '2022-03-25',  13.50, 'Movie',    3,  5),  -- 14
('Jujutsu Kaisen',                   'Curse hunters.',                              '2020-10-03',  25.00, 'TV_Show',  4,  4),  -- 15
('Better Call Saul',                 'Criminal lawyer.',                            '2015-02-08',  22.00, 'TV_Show',  6,  5),  -- 16
('Stranger Things',                  'Mysterious girl.',                            '2016-07-15',  18.00, 'TV_Show',  4,  5),  -- 17
('The Godfather',                    'Crime family.',                               '1972-03-24',  15.00, 'Movie',    5,  5),  -- 18
('Spirited Away',                    'Ghost world.',                                '2001-07-20',  10.00, 'Movie',    1,  4),  -- 19
('Chernobyl',                        'Power plant.',                                '2019-05-06',  12.00, 'TV_Show',  4,  8),  -- 20
('Naruto',                           'Ninja who dreams of being Hokage.',           '2002-10-03',  29.99, 'TV_Show',  2,  4),  -- 21
('Dragon Ball Z',                    'Saiyan warriors protect Earth.',              '1989-04-26',  24.99, 'TV_Show',  2,  4),  -- 22
('Demon Slayer',                     'Tanjiro fights demons for Nezuko.',           '2019-04-06',  22.00, 'TV_Show',  3,  4),  -- 23
('Fullmetal Alchemist: Brotherhood', 'Brothers seek the Philosopher Stone.',       '2009-04-05',  26.00, 'TV_Show',  3,  4),  -- 24
('Dune: Part Two',                   'Paul leads the Fremen to war.',              '2024-03-01',  16.99, 'Movie',    5, 13),  -- 25
('Oppenheimer',                      'Father of the atomic bomb.',                 '2023-07-21',  12.99, 'Movie',    3,  8),  -- 26
('The Grand Budapest Hotel',         'Legendary concierge in a fading empire.',    '2014-03-07',  8.99,  'Movie',    3,  3),  -- 27
('Pulp Fiction',                     'Interconnected crime stories in L.A.',       '1994-10-14',  7.99,  'Movie',    5,  5),  -- 28
('Squid Game',                       'Desperate people compete in deadly games.',  '2021-09-17',  18.00, 'TV_Show',  6,  6),  -- 29
('Arcane',                           'The origins of Vi and Jinx.',                '2021-11-06',  15.00, 'TV_Show',  3,  7),  -- 30
('Severance',                        'Office workers with severed memories.',       '2022-02-18',  14.99, 'TV_Show',  4,  5),  -- 31
('Blade Runner 2049',                'A replicant hunter uncovers secrets.',        '2017-10-06',  11.99, 'Movie',    3, 13),  -- 32
('Princess Mononoke',                'Humans clash with forest spirits.',           '1997-07-12',  9.99,  'Movie',    1,  4),  -- 33
('Goodfellas',                       'Rise and fall of a mob associate.',           '1990-09-19',  8.50,  'Movie',    5,  5),  -- 34
('The Bear',                         'A fine-dining chef runs a sandwich shop.',   '2022-06-23',  12.00, 'TV_Show',  4,  5);  -- 35


-- ══════════════════════════════════════════════════════════════════════
-- 5. LOGICAL COMPLETENESS — VideoQuality, Genres, Languages
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO VideoQuality (ContentID, Quality) VALUES 
(1,  '4K'), (1,  '1080p'), (1,  '720p'),
(2,  '1080p'), (2,  '720p'),
(3,  '720p'),
(4,  '4K'), (4,  '1080p'),
(5,  '1080p'), (5,  '720p'),
(6,  '4K'), (6,  '1080p'),
(7,  '1080p'), (7,  '720p'),
(8,  '4K'), (8,  '1080p'), (8,  '720p'),
(9,  '1080p'), (9,  '720p'),
(10, '4K'), (10, '1080p'),
(11, '1080p'),
(12, '4K'), (12, '1080p'), (12, '720p'),
(13, '4K'), (13, '1080p'),
(14, '4K'), (14, '1080p'),
(15, '1080p'), (15, '720p'),
(16, '1080p'), (16, '720p'),
(17, '4K'), (17, '1080p'),
(18, '1080p'), (18, '720p'),
(19, '1080p'), (19, '720p'),
(20, '4K'), (20, '1080p'),
(21, '1080p'), (21, '720p'),
(22, '720p'),
(23, '4K'), (23, '1080p'),
(24, '1080p'), (24, '720p'),
(25, '4K'), (25, '1080p'), (25, '720p'),
(26, '4K'), (26, '1080p'),
(27, '1080p'), (27, '720p'),
(28, '1080p'), (28, '720p'),
(29, '4K'), (29, '1080p'),
(30, '4K'), (30, '1080p'),
(31, '4K'), (31, '1080p'),
(32, '4K'), (32, '1080p'),
(33, '1080p'), (33, '720p'),
(34, '1080p'), (34, '720p'),
(35, '4K'), (35, '1080p');

INSERT INTO Content_Genre (ContentID, GenreID) VALUES 
(1,  1), (1,  11),
(2,  2), (2,  3),  (2,  7),
(3,  3), (3,  11),
(4,  1), (4,  15), (4,  6),
(5,  2), (5,  4),  (5,  12),
(6,  6), (6,  11), (6,  13),
(7,  7), (7,  2),  (7,  11),
(8,  1), (8,  4),  (8,  12),
(9,  2), (9,  4),  (9,  11),
(10, 10),(10, 4),  (10, 12),
(11, 6), (11, 11), (11, 13),
(12, 4), (12, 13), (12, 6),
(13, 1), (13, 6),  (13, 15),
(14, 10),(14, 3),  (14, 11),
(15, 2), (15, 4),  (15, 6),
(16, 13),(16, 11), (16, 6),
(17, 10),(17, 8),  (17, 6),
(18, 13),(18, 11), (18, 14),
(19, 10),(19, 2),  (19, 11),
(20, 9), (20, 11), (20, 14),
(21, 2), (21, 4),  (21, 12),
(22, 2), (22, 4),  (22, 12),
(23, 2), (23, 4),  (23, 6),
(24, 2), (24, 4),  (24, 11),
(25, 1), (25, 4),  (25, 12),
(26, 14),(26, 11), (26, 9),
(27, 3), (27, 13), (27, 11),
(28, 13),(28, 6),  (28, 11),
(29, 6), (29, 11), (29, 15),
(30, 10),(30, 4),  (30, 11),
(31, 1), (31, 15), (31, 6),
(32, 1), (32, 11), (32, 15),
(33, 10),(33, 4),  (33, 11),
(34, 13),(34, 11), (34, 6),
(35, 11),(35, 3);

INSERT INTO Content_Language (ContentID, LanguageID, LangType) VALUES 
(1,  1, 'Audio'),  (1,  2, 'Subtitle'), (1,  6, 'Subtitle'), (1,  7, 'Subtitle'),
(2,  3, 'Audio'),  (2,  1, 'Subtitle'), (2,  2, 'Subtitle'),
(3,  1, 'Audio'),  (3,  1, 'Subtitle'), (3,  2, 'Subtitle'), (3,  4, 'Subtitle'),
(4,  1, 'Audio'),  (4,  2, 'Subtitle'), (4,  6, 'Subtitle'),
(5,  3, 'Audio'),  (5,  1, 'Subtitle'), (5,  2, 'Subtitle'), (5,  4, 'Subtitle'),
(6,  1, 'Audio'),  (6,  2, 'Subtitle'), (6,  4, 'Subtitle'),
(7,  3, 'Audio'),  (7,  1, 'Subtitle'), (7,  2, 'Subtitle'), (7,  5, 'Subtitle'),
(8,  1, 'Audio'),  (8,  3, 'Subtitle'), (8,  6, 'Subtitle'), (8,  4, 'Subtitle'),
(9,  3, 'Audio'),  (9,  2, 'Subtitle'), (9,  1, 'Subtitle'),
(10, 1, 'Audio'),  (10, 1, 'Subtitle'), (10, 2, 'Subtitle'),
(11, 5, 'Audio'),  (11, 1, 'Subtitle'), (11, 2, 'Subtitle'), (11, 8, 'Subtitle'),
(12, 1, 'Audio'),  (12, 2, 'Subtitle'), (12, 6, 'Subtitle'),
(13, 1, 'Audio'),  (13, 4, 'Subtitle'), (13, 2, 'Subtitle'),
(14, 8, 'Audio'),  (14, 1, 'Subtitle'), (14, 2, 'Subtitle'),
(15, 3, 'Audio'),  (15, 2, 'Subtitle'), (15, 1, 'Subtitle'),
(16, 1, 'Audio'),  (16, 1, 'Subtitle'), (16, 2, 'Subtitle'),
(17, 1, 'Audio'),  (17, 2, 'Subtitle'), (17, 6, 'Subtitle'),
(18, 1, 'Audio'),  (18, 9, 'Audio'),    (18, 1, 'Subtitle'), (18, 2, 'Subtitle'),
(19, 3, 'Audio'),  (19, 1, 'Subtitle'), (19, 2, 'Subtitle'), (19, 8, 'Subtitle'),
(20, 1, 'Audio'),  (20, 1, 'Subtitle'), (20, 10,'Subtitle'), (20, 2, 'Subtitle'),
(21, 3, 'Audio'),  (21, 1, 'Subtitle'), (21, 2, 'Subtitle'), (21, 4, 'Subtitle'),
(22, 3, 'Audio'),  (22, 1, 'Subtitle'), (22, 2, 'Subtitle'),
(23, 3, 'Audio'),  (23, 1, 'Subtitle'), (23, 2, 'Subtitle'), (23, 5, 'Subtitle'),
(24, 3, 'Audio'),  (24, 1, 'Subtitle'), (24, 2, 'Subtitle'),
(25, 1, 'Audio'),  (25, 3, 'Subtitle'), (25, 6, 'Subtitle'), (25, 4, 'Subtitle'),
(26, 1, 'Audio'),  (26, 2, 'Subtitle'), (26, 7, 'Subtitle'),
(27, 1, 'Audio'),  (27, 6, 'Subtitle'), (27, 7, 'Subtitle'),
(28, 1, 'Audio'),  (28, 2, 'Subtitle'), (28, 4, 'Subtitle'), (28, 6, 'Subtitle'),
(29, 5, 'Audio'),  (29, 1, 'Subtitle'), (29, 2, 'Subtitle'), (29, 3, 'Subtitle'),
(30, 1, 'Audio'),  (30, 2, 'Subtitle'), (30, 6, 'Subtitle'),
(31, 1, 'Audio'),  (31, 2, 'Subtitle'), (31, 6, 'Subtitle'),
(32, 1, 'Audio'),  (32, 2, 'Subtitle'), (32, 6, 'Subtitle'),
(33, 3, 'Audio'),  (33, 1, 'Subtitle'), (33, 2, 'Subtitle'),
(34, 1, 'Audio'),  (34, 9, 'Subtitle'), (34, 2, 'Subtitle'),
(35, 1, 'Audio'),  (35, 2, 'Subtitle'), (35, 4, 'Subtitle');


-- ══════════════════════════════════════════════════════════════════════
-- 6. SUBCLASSES, HIERARCHY & ROLES
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO Movie (ContentID, RunTime) VALUES 
(1,  169), (4,  148), (7,  107), (8,  155), (11, 132),
(12, 152), (13, 150), (14, 139), (18, 175), (19, 125),
(25, 166), (26, 180), (27,  99), (28, 154), (32, 163),
(33, 134), (34, 146);

INSERT INTO TV_Show (ContentID, currStatus) VALUES 
(2,  'On-going'), (3,  'Ended'),    (5,  'On-going'), (6,  'Ended'),
(9,  'Ended'),    (10, 'On-going'), (15, 'On-going'), (16, 'Ended'),
(17, 'On-going'), (20, 'Ended'),    (21, 'Ended'),    (22, 'Ended'),
(23, 'On-going'), (24, 'Ended'),    (29, 'On-going'), (30, 'On-going'),
(31, 'On-going'), (35, 'On-going');

INSERT INTO Season (ContentID, SeasonNum, AirDate, Sypnosis) VALUES 
(2,  1, '2022-04-09', 'Loid Forger assembles his fake family for Operation Strix.'),
(2,  2, '2023-10-07', 'The Forger family faces new missions and deeper bonds.'),
(3,  1, '2005-03-24', 'Dunder Mifflin Scranton introduces Michael Scott and his team.'),
(3,  2, '2005-09-20', 'Michael''s antics escalate while Jim and Pam grow closer.'),
(3,  3, '2006-09-21', 'Andy Bernard arrives; Dwight plants a web of schemes.'),
(5,  1, '1999-10-20', 'Luffy sets sail and gathers the beginning of the Straw Hat crew.'),
(5,  2, '2000-03-19', 'The crew navigates the Grand Line and reaches Alabasta.'),
(6,  1, '2008-01-20', 'Walter White cooks his first batch of crystal meth.'),
(6,  2, '2009-03-08', 'Walt and Jesse navigate the Salamanca cartel.'),
(6,  3, '2010-03-21', 'The rivalry with Gus Fring heats to a boiling point.'),
(9,  1, '2013-04-07', 'Humanity fights for survival behind the walls.'),
(9,  2, '2017-04-01', 'Secrets of the Titans are slowly uncovered.'),
(9,  3, '2018-07-22', 'The Survey Corps venture beyond the walls.'),
(10, 1, '2019-11-12', 'A lone bounty hunter protects a mysterious child.'),
(10, 2, '2020-10-30', 'Mando searches for the Jedi to return Grogu home.'),
(15, 1, '2020-10-03', 'Yuji Itadori swallows Sukuna''s finger and enters jujutsu society.'),
(15, 2, '2023-07-06', 'The Culling Game begins; sorcerers fight for survival.'),
(16, 1, '2015-02-08', 'Jimmy McGill hustles his way through Albuquerque''s legal scene.'),
(16, 2, '2016-02-15', 'Jimmy''s ambitions clash with Chuck''s disapproval.'),
(17, 1, '2016-07-15', 'Will Byers vanishes; Eleven escapes Hawkins Lab.'),
(17, 2, '2017-10-27', 'The Mind Flayer emerges from the Upside Down.'),
(17, 3, '2019-07-04', 'Starcourt Mall hides a Soviet experiment beneath its floors.'),
(20, 1, '2019-05-06', 'The catastrophic explosion at Reactor No. 4 and its cover-up.'),
(21, 1, '2002-10-03', 'Naruto graduates from the Academy and is placed on Team 7.'),
(21, 2, '2003-06-04', 'The Chunin Exams and the invasion of the Hidden Leaf.'),
(22, 1, '1989-04-26', 'Raditz arrives; Goku makes the ultimate sacrifice.'),
(22, 2, '1990-03-19', 'The Z Fighters train for the Namek saga.'),
(23, 1, '2019-04-06', 'Tanjiro begins his journey to save Nezuko.'),
(23, 2, '2021-12-05', 'The Entertainment District Arc: Tengen Uzui leads the hunt.'),
(24, 1, '2009-04-05', 'Edward and Alphonse begin their search for the Philosopher''s Stone.'),
(24, 2, '2009-09-06', 'The brothers uncover the depths of the homunculi conspiracy.'),
(29, 1, '2021-09-17', 'Hundreds of indebted people compete in deadly children''s games.'),
(30, 1, '2021-11-06', 'Sisters Vi and Powder are torn apart by conflict in Piltover.'),
(31, 1, '2022-02-18', 'Mark Scout navigates the bizarre world of Lumon Industries.'),
(31, 2, '2025-01-17', 'The severed workers push back against Lumon''s control.'),
(35, 1, '2022-06-23', 'Carmy returns to Chicago to run The Original Beef.'),
(35, 2, '2023-06-22', 'The crew races to transform into an upscale restaurant.');

INSERT INTO Episode (ContentID, SeasonNum, EpisodeNum, Title, RunTime) VALUES 
(2,  1, 1, 'Operation Strix',                                        24),
(2,  1, 2, 'Secure a Wife',                                          24),
(2,  1, 3, 'Prepare for the Interview',                              24),
(2,  2, 1, 'The Tender Lie',                                         24),
(2,  2, 2, 'Showdown in the School',                                 24),
(3,  1, 1, 'Pilot',                                                  22),
(3,  1, 2, 'Diversity Day',                                          22),
(3,  2, 1, 'The Dundies',                                            22),
(3,  2, 2, 'Sexual Harassment',                                      22),
(3,  3, 1, 'Gay Witch Hunt',                                         22),
(3,  3, 2, 'The Convention',                                         22),
(5,  1, 1, 'I''m Luffy! The Man Who Will Become the Pirate King!',   24),
(5,  1, 2, 'Enter the Great Swordsman! Pirate Hunter Zoro!',         24),
(5,  2, 1, 'Farewell, Drum Island! I''ll Always Be Dreaming',        24),
(5,  2, 2, 'Alabasta Animal Land and the Kung Fu Dugongs!',          24),
(6,  1, 1, 'Pilot',                                                  58),
(6,  1, 2, 'Cat''s in the Bag',                                      48),
(6,  2, 1, 'Seven Thirty-Seven',                                     47),
(6,  2, 2, 'Down',                                                   47),
(6,  3, 1, 'No Mas',                                                 47),
(6,  3, 2, 'Caballo Sin Nombre',                                     47),
(9,  1, 1, 'To You, 2000 Years Later',                               24),
(9,  1, 2, 'That Day',                                               24),
(9,  2, 1, 'Beast Titan',                                            24),
(9,  2, 2, 'I''m Home',                                              24),
(9,  3, 1, 'Smoke Signal',                                           24),
(9,  3, 2, 'Midnight Sun',                                           24),
(10, 1, 1, 'Chapter 1: The Mandalorian',                             39),
(10, 1, 2, 'Chapter 2: The Child',                                   32),
(10, 2, 1, 'Chapter 9: The Marshal',                                 55),
(10, 2, 2, 'Chapter 10: The Passenger',                              41),
(15, 1, 1, 'Ryomen Sukuna',                                          24),
(15, 1, 2, 'For Myself',                                             24),
(15, 2, 1, 'The Gojo Arc',                                           24),
(15, 2, 2, 'Hidden Inventory',                                       24),
(16, 1, 1, 'Uno',                                                    53),
(16, 1, 2, 'Mijo',                                                   43),
(16, 2, 1, 'Switch',                                                 46),
(16, 2, 2, 'Cobbler',                                                47),
(17, 1, 1, 'The Vanishing of Will Byers',                            48),
(17, 1, 2, 'The Weirdo on Maple Street',                             55),
(17, 2, 1, 'MADMAX',                                                 48),
(17, 2, 2, 'Trick or Treat, Freak',                                  56),
(17, 3, 1, 'Suzie, Do You Copy?',                                    51),
(17, 3, 2, 'The Mall Rats',                                          52),
(20, 1, 1, '1:23:45',                                                59),
(20, 1, 2, 'Please Remain Calm',                                     59),
(21, 1, 1, 'Enter: Naruto Uzumaki!',                                 24),
(21, 1, 2, 'My Name Is Konohamaru!',                                 24),
(21, 2, 1, 'Chunin Exam on Fire! Naruto vs. Konohamaru!',            24),
(21, 2, 2, 'The Fourth Hokage',                                      24),
(22, 1, 1, 'The New Threat',                                         24),
(22, 1, 2, 'Reunions',                                               24),
(22, 2, 1, 'A New Goal: Namek',                                      24),
(22, 2, 2, 'Journey to Namek',                                       24),
(23, 1, 1, 'Cruelty',                                                26),
(23, 1, 2, 'Trainer Sakonji Urokodaki',                              23),
(23, 2, 1, 'Sound Hashira Tengen Uzui',                              47),
(23, 2, 2, 'Infiltrating the Entertainment District',                29),
(24, 1, 1, 'Fullmetal Alchemist',                                    24),
(24, 1, 2, 'The First Day',                                          24),
(24, 2, 1, 'Greed',                                                  24),
(24, 2, 2, 'The Dwarf in the Flask',                                 24),
(29, 1, 1, 'Red Light, Green Light',                                 60),
(29, 1, 2, 'Hell',                                                   63),
(30, 1, 1, 'Welcome to the Playground',                              39),
(30, 1, 2, 'Some Mysteries Are Better Left Unsolved',                41),
(31, 1, 1, 'Good News About Hell',                                   60),
(31, 1, 2, 'Half Loop',                                              37),
(31, 2, 1, 'Cold Harbor',                                            60),
(31, 2, 2, 'Goodbye, Mrs. Selvig',                                   52),
(35, 1, 1, 'System',                                                 35),
(35, 1, 2, 'Hands',                                                  27),
(35, 2, 1, 'Entree',                                                 27),
(35, 2, 2, 'Pasta',                                                  27);

INSERT INTO Content_Role (ContentID, PersonID, RoleType, CharacterName) VALUES 
(1,  1,  'Director',  NULL),
(1,  7,  'Actor',     'Amelia Brand'),
(2,  2,  'Creator',   NULL),
(3,  3,  'Lead',      'Michael Scott'),
(5,  5,  'Creator',   NULL),
(6,  6,  'Lead',      'Walter White'),
(6,  25, 'Actor',     'Jesse Pinkman'),
(6,  26, 'Actor',     'Skyler White'),
(7,  15, 'Director',  NULL),
(8,  14, 'Director',  NULL),
(8,  31, 'Actor',     'Paul Atreides'),
(8,  9,  'Actor',     'Stilgar'),
(9,  11, 'Creator',   NULL),
(10, 9,  'Lead',      'Din Djarin'),
(11, 8,  'Director',  NULL),
(12, 4,  'Actor',     'Joker'),
(12, 1,  'Director',  NULL),
(17, 27, 'Actor',     'Eleven'),
(17, 28, 'Actor',     'Joyce Byers'),
(18, 29, 'Actor',     'Michael Corleone'),
(18, 30, 'Lead',      'Vito Corleone'),
(19, 16, 'Director',  NULL),
(20, 18, 'Director',  NULL),
(21, 21, 'Creator',   NULL),
(22, 22, 'Creator',   NULL),
(23, 23, 'Creator',   NULL),
(24, 24, 'Creator',   NULL),
(25, 14, 'Director',  NULL),
(25, 31, 'Actor',     'Paul Atreides'),
(26, 1,  'Director',  NULL),
(27, 18, 'Director',  NULL),
(28, 12, 'Director',  NULL),
(32, 14, 'Director',  NULL),
(33, 16, 'Director',  NULL),
(34, 13, 'Director',  NULL);


-- ══════════════════════════════════════════════════════════════════════
-- 7. ACTIVITY — Transactions, Reviews, Playlists, User_Content
-- ══════════════════════════════════════════════════════════════════════

-- TransactionDate rules:
--   (a) AFTER the user's RegisterDate
--   (b) AFTER the content's ReleaseDate
--   (c) Spread organically across 2021–2024
INSERT INTO TransactionList (UserID, TransactionDate, TotalAmount) VALUES 
(2,  '2021-03-10 20:15:00', 9.99),   -- T1  GenshinLover → Interstellar
(3,  '2022-05-20 11:30:00', 19.99),  -- T2  Anya_Fans → Spy x Family
(4,  '2021-08-01 18:45:00', 7.99),   -- T3  Luffy_Pirate → Inception
(5,  '2021-10-05 09:00:00', 49.99),  -- T4  Zoro_Lost → One Piece
(6,  '2021-09-14 14:22:00', 15.99),  -- T5  Nami_Money → The Office
(7,  '2021-10-30 21:00:00', 12.99),  -- T6  Sanji_Cook → Your Name
(8,  '2021-11-01 16:05:00', 29.99),  -- T7  Robin_History → Breaking Bad
(9,  '2021-11-05 10:10:00', 14.99),  -- T8  Chopper_Doc → Dune
(10, '2022-01-07 08:30:00', 11.99),  -- T9  Franky_Super → Tenet
(11, '2022-02-14 19:45:00', 35.00),  -- T10 Brook_Soul → Attack on Titan
(12, '2022-03-05 13:20:00', 19.99),  -- T11 Jimbei_Fish → The Mandalorian
(13, '2022-04-11 17:55:00', 9.50),   -- T12 Usopp_Sniper → Parasite
(14, '2022-06-19 22:10:00', 5.99),   -- T13 Law_Heart → The Dark Knight
(15, '2022-07-04 15:40:00', 11.99),  -- T14 Kid_Metal → Tenet
(16, '2022-09-01 09:05:00', 13.50),  -- T15 Hancock_Love → EEAAO
(17, '2022-10-28 20:30:00', 25.00),  -- T16 Ace_Fire → Jujutsu Kaisen
(18, '2022-11-15 11:00:00', 22.00),  -- T17 Sabo_Dragon → Better Call Saul
(19, '2022-12-03 14:15:00', 18.00),  -- T18 Shanks_Red → Stranger Things
(20, '2023-01-20 16:00:00', 15.00),  -- T19 Buggy_Clown → The Godfather
(2,  '2023-02-08 10:45:00', 10.00),  -- T20 GenshinLover → Spirited Away (2nd purchase)
(21, '2023-03-12 19:00:00', 29.99),  -- T21 Naruto_Uzumaki → Naruto
(22, '2023-04-05 08:20:00', 24.99),  -- T22 Sasuke_Uchiha → Dragon Ball Z
(23, '2023-05-19 13:45:00', 22.00),  -- T23 Sakura_Haruno → Demon Slayer
(24, '2023-06-30 21:10:00', 26.00),  -- T24 Kakashi_Sensei → FMA Brotherhood
(25, '2024-04-02 12:00:00', 16.99),  -- T25 Itachi_Crow → Dune Part Two
(26, '2023-09-14 17:30:00', 12.99),  -- T26 Goku_Saiyan → Oppenheimer
(27, '2023-10-01 09:50:00', 8.99),   -- T27 Vegeta_Prince → Grand Budapest Hotel
(28, '2023-11-11 22:22:00', 7.99),   -- T28 Bulma_Genius → Pulp Fiction
(29, '2023-12-25 15:00:00', 18.00),  -- T29 Tanjiro_Blade → Squid Game
(30, '2024-01-08 11:11:00', 15.00),  -- T30 Nezuko_Box → Arcane
(31, '2024-02-20 20:05:00', 14.99),  -- T31 Edward_Elric → Severance
(32, '2024-03-15 07:45:00', 11.99),  -- T32 Roy_Mustang → Blade Runner 2049
(33, '2024-04-28 18:30:00', 9.99),   -- T33 Mikasa_Ackerman → Princess Mononoke
(34, '2024-05-10 14:00:00', 8.50),   -- T34 Armin_Strategist → Goodfellas
(35, '2024-06-03 10:20:00', 12.00),  -- T35 Levi_Captain → The Bear
(36, '2024-07-22 16:40:00', 14.99),  -- T36 Sasha_Potato → Dune
(37, '2024-08-15 09:15:00', 9.99),   -- T37 Historia_Queen → Interstellar
(38, '2024-09-30 19:55:00', 29.99),  -- T38 Erwin_Smith → Breaking Bad
(39, '2024-10-18 13:05:00', 35.00),  -- T39 Hange_Zoe → Attack on Titan
(40, '2024-11-29 21:30:00', 25.00);  -- T40 Reiner_Armor → Jujutsu Kaisen

INSERT INTO Transaction_Detail (TransactionID, ContentID, ContentName, SoldPrice) VALUES 
(1,  1,  'Interstellar',                      9.99),
(2,  2,  'Spy x Family',                     19.99),
(3,  4,  'Inception',                         7.99),
(4,  5,  'One Piece',                        49.99),
(5,  3,  'The Office',                       15.99),
(6,  7,  'Your Name',                        12.99),
(7,  6,  'Breaking Bad',                     29.99),
(8,  8,  'Dune',                             14.99),
(9,  13, 'Tenet',                            11.99),
(10, 9,  'Attack on Titan',                  35.00),
(11, 10, 'The Mandalorian',                  19.99),
(12, 11, 'Parasite',                          9.50),
(13, 12, 'The Dark Knight',                   5.99),
(14, 13, 'Tenet',                            11.99),
(15, 14, 'Everything Everywhere All at Once',13.50),
(16, 15, 'Jujutsu Kaisen',                   25.00),
(17, 16, 'Better Call Saul',                 22.00),
(18, 17, 'Stranger Things',                  18.00),
(19, 18, 'The Godfather',                    15.00),
(20, 19, 'Spirited Away',                    10.00),
(21, 21, 'Naruto',                           29.99),
(22, 22, 'Dragon Ball Z',                    24.99),
(23, 23, 'Demon Slayer',                     22.00),
(24, 24, 'Fullmetal Alchemist: Brotherhood', 26.00),
(25, 25, 'Dune: Part Two',                   16.99),
(26, 26, 'Oppenheimer',                      12.99),
(27, 27, 'The Grand Budapest Hotel',          8.99),
(28, 28, 'Pulp Fiction',                      7.99),
(29, 29, 'Squid Game',                       18.00),
(30, 30, 'Arcane',                           15.00),
(31, 31, 'Severance',                        14.99),
(32, 32, 'Blade Runner 2049',                11.99),
(33, 33, 'Princess Mononoke',                 9.99),
(34, 34, 'Goodfellas',                        8.50),
(35, 35, 'The Bear',                         12.00),
(36, 8,  'Dune',                             14.99),
(37, 1,  'Interstellar',                      9.99),
(38, 6,  'Breaking Bad',                     29.99),
(39, 9,  'Attack on Titan',                  35.00),
(40, 15, 'Jujutsu Kaisen',                   25.00);

-- PostTime: always AFTER the corresponding TransactionDate
INSERT INTO Reviews (UserID, ContentID, Rating, CommentText, PostTime) VALUES 
(2,  1,  5.0, 'A masterpiece of visual storytelling.',                   '2021-03-17 22:10:00'),
(3,  2,  4.5, 'So cute and funny, Anya is adorable!',                    '2022-05-28 14:00:00'),
(4,  4,  4.8, 'Dreams within dreams — blew my mind.',                    '2021-08-10 19:30:00'),
(5,  5,  5.0, 'Legendary. The only show that keeps going and stays great.','2021-10-15 09:45:00'),
(6,  3,  4.2, 'Michael Scott is pure comedy gold.',                      '2021-09-25 20:00:00'),
(7,  7,  4.7, 'Beautiful and heartbreaking at the same time.',           '2021-11-12 17:20:00'),
(8,  6,  5.0, 'The best TV drama ever made.',                            '2021-11-20 21:55:00'),
(9,  8,  4.3, 'Epic world-building, stunning visuals.',                  '2021-11-19 10:30:00'),
(10, 13, 3.8, 'Wait... what direction did that bullet go?',              '2022-01-18 23:05:00'),
(11, 9,  4.9, 'Cried three times. No regrets.',                          '2022-02-28 18:40:00'),
(12, 10, 4.6, 'Baby Yoda alone is worth the price.',                     '2022-03-19 13:10:00'),
(13, 11, 4.8, 'Bong Joon-ho is a genius.',                              '2022-04-24 16:50:00'),
(14, 12, 5.0, 'Heath Ledger''s Joker is untouchable.',                   '2022-07-01 20:15:00'),
(15, 13, 3.5, 'Visually amazing but hard to follow.',                    '2022-07-22 11:00:00'),
(16, 14, 4.7, 'So wild, yet so emotionally resonant.',                   '2022-09-15 08:30:00'),
(17, 15, 4.5, 'The animation during Domain Expansions is insane.',       '2022-11-08 22:45:00'),
(18, 16, 4.9, 'Better than Breaking Bad? Dare I say yes.',               '2022-11-30 19:00:00'),
(19, 17, 4.4, 'Season 1 is flawless.',                                   '2022-12-20 14:25:00'),
(20, 18, 5.0, 'Leave the gun. Take the cannoli.',                        '2023-02-01 21:00:00'),
(2,  19, 4.9, 'Miyazaki''s greatest work.',                              '2023-02-20 16:30:00'),
(21, 21, 5.0, 'Believe it! Naruto is my all-time favourite.',            '2023-03-25 10:00:00'),
(22, 22, 4.8, 'Over 9000/10. Timeless classic.',                         '2023-04-18 07:30:00'),
(23, 23, 4.9, 'The Mugen Train arc made me sob.',                        '2023-06-01 20:10:00'),
(24, 24, 5.0, 'Brotherhood is peak anime storytelling.',                 '2023-07-14 15:55:00'),
(25, 25, 4.7, 'Denis did it again — Dune Part Two is a war epic.',       '2024-04-20 18:00:00'),
(26, 26, 4.9, 'Cillian Murphy deserved every award.',                    '2023-09-30 22:30:00'),
(27, 27, 4.5, 'Wes Anderson is in a league of his own.',                 '2023-10-15 12:40:00'),
(28, 28, 5.0, 'Cool, cool, cool. Tarantino''s magnum opus.',             '2023-11-25 20:00:00'),
(29, 29, 4.8, 'Red light green light will haunt me forever.',            '2024-01-05 09:15:00'),
(30, 30, 5.0, 'The animation quality is absolutely stunning.',           '2024-01-22 17:45:00'),
(31, 31, 4.6, 'The most unsettling office drama since The Office.',      '2024-03-04 11:30:00'),
(32, 32, 4.4, 'Atmospheric and visually breathtaking.',                  '2024-03-28 14:00:00'),
(33, 33, 4.8, 'San and Ashitaka''s story is timeless.',                  '2024-05-09 19:20:00'),
(34, 34, 4.7, 'Scorsese at his most electrifying.',                      '2024-05-24 21:10:00'),
(35, 35, 4.9, 'The kitchen chaos is so real it gives me anxiety.',       '2024-06-18 08:50:00'),
(36, 8,  4.3, 'Dune is a slow burn done perfectly.',                     '2024-08-05 16:00:00'),
(37, 1,  4.8, 'Interstellar made me call my dad.',                       '2024-08-29 20:30:00'),
(38, 6,  5.0, 'Mr. White... I am the danger.',                           '2024-10-14 13:45:00'),
(39, 9,  4.9, 'Season 3 of AoT broke me completely.',                    '2024-11-02 22:00:00'),
(40, 15, 4.6, 'Gojo Satoru is the most iconic character in anime.',      '2024-12-10 18:20:00');

INSERT INTO User_Content (UserID, ContentID) VALUES 
(2,  1),  (3,  2),  (4,  4),  (5,  5),  (6,  3),
(7,  7),  (8,  6),  (9,  8),  (10, 13), (11, 9),
(12, 10), (13, 11), (14, 12), (15, 13), (16, 14),
(17, 15), (18, 16), (19, 17), (20, 18), (2,  19),
(21, 21), (22, 22), (23, 23), (24, 24), (25, 25),
(26, 26), (27, 27), (28, 28), (29, 29), (30, 30),
(31, 31), (32, 32), (33, 33), (34, 34), (35, 35),
(36, 8),  (37, 1),  (38, 6),  (39, 9),  (40, 15),
(2,  4),  (2,  8),  (2,  25),
(5,  21), (5,  22), (5,  23),
(8,  11), (8,  18), (8,  34),
(17, 17), (17, 29), (17, 31),
(4,  14), (4,  27);

-- CreateDate: after user RegisterDate, after owning relevant content
INSERT INTO Playlist (PlaylistID, UserID, PlaylistName, CreateDate) VALUES 
(1, 2,  'Sci-Fi Favourites',  '2021-04-15 18:00:00'),
(2, 2,  'Anime Watchlist',    '2021-07-20 21:30:00'),
(1, 4,  'Mind-Bending Films', '2021-08-25 15:45:00'),
(1, 6,  'Comedy Night',       '2021-10-03 20:10:00'),
(3, 2,  'Nolan Universe',     '2022-01-01 00:01:00'),
(1, 5,  'Pirate & Adventure', '2021-11-14 19:00:00'),
(1, 8,  'Prestige Drama',     '2022-02-28 14:30:00'),
(1, 17, 'Thriller & Horror',  '2022-10-31 22:00:00'),
(1, 21, 'Anime Classics',     '2023-04-10 11:20:00'),
(2, 21, 'Adventure Picks',    '2023-06-18 16:45:00'),
(1, 29, 'K-Drama & K-Film',   '2024-01-15 09:00:00'),
(1, 35, 'Chef''s Table Picks','2024-07-01 12:00:00');

-- AddDate: always AFTER playlist CreateDate AND after content ReleaseDate
INSERT INTO Playlist_Item (PlaylistID, UserID, ContentID, AddDate) VALUES 
-- GenshinLover Sci-Fi (created 2021-04-15)
(1, 2, 1,  '2021-04-15 18:05:00'),
(1, 2, 4,  '2021-08-05 10:30:00'),
(1, 2, 8,  '2021-11-10 19:00:00'),
(1, 2, 25, '2024-03-10 14:00:00'),
(1, 2, 32, '2024-04-01 20:00:00'),
(1, 2, 31, '2024-03-01 11:30:00'),
-- GenshinLover Anime (created 2021-07-20)
(2, 2, 2,  '2022-05-25 20:00:00'),
(2, 2, 9,  '2022-03-01 17:45:00'),
(2, 2, 15, '2022-11-10 22:00:00'),
(2, 2, 19, '2023-02-22 13:15:00'),
-- GenshinLover Nolan Universe (created 2022-01-01)
(3, 2, 1,  '2022-01-01 00:05:00'),
(3, 2, 4,  '2022-01-01 00:10:00'),
(3, 2, 12, '2022-01-02 09:00:00'),
(3, 2, 13, '2022-01-03 11:30:00'),
-- Luffy Mind-Bending (created 2021-08-25)
(1, 4, 4,  '2021-08-25 15:50:00'),
(1, 4, 14, '2022-10-01 18:00:00'),
(1, 4, 13, '2022-09-01 21:00:00'),
-- Nami Comedy Night (created 2021-10-03)
(1, 6, 3,  '2021-10-03 20:15:00'),
-- Luffy Pirate & Adventure (created 2021-11-14)
(1, 5, 5,  '2021-11-14 19:10:00'),
(1, 5, 8,  '2021-12-05 20:30:00'),
(1, 5, 21, '2023-03-20 10:00:00'),
(1, 5, 22, '2023-04-10 15:00:00'),
-- Robin Prestige Drama (created 2022-02-28)
(1, 8, 6,  '2022-02-28 14:35:00'),
(1, 8, 11, '2022-04-15 16:00:00'),
(1, 8, 18, '2022-06-10 19:30:00'),
(1, 8, 34, '2024-06-01 21:00:00'),
-- Ace_Fire Thriller & Horror (created 2022-10-31)
(1, 17, 17, '2022-10-31 22:05:00'),
(1, 17, 29, '2022-11-20 20:00:00'),
(1, 17, 31, '2024-02-25 19:30:00'),
-- Naruto_Uzumaki Anime Classics (created 2023-04-10)
(1, 21, 21, '2023-04-10 11:25:00'),
(1, 21, 22, '2023-04-10 11:30:00'),
(1, 21, 23, '2023-06-05 18:00:00'),
(1, 21, 24, '2023-07-20 14:30:00'),
(1, 21, 5,  '2023-08-01 09:00:00'),
(1, 21, 9,  '2023-09-15 20:45:00'),
-- Naruto_Uzumaki Adventure Picks (created 2023-06-18)
(2, 21, 8,  '2023-06-18 16:50:00'),
(2, 21, 10, '2023-07-02 10:00:00'),
-- Tanjiro K-Drama & K-Film (created 2024-01-15)
(1, 29, 11, '2024-01-15 09:10:00'),
(1, 29, 29, '2024-01-28 21:30:00'),
-- Levi Chef's Table Picks (created 2024-07-01)
(1, 35, 35, '2024-07-01 12:05:00');