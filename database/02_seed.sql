-- ########################################################################################################
-- LOGICALLY COMPLETE SAMPLE DATA  (PostgreSQL-compatible)
--
-- Insertion order respects ALL foreign key dependencies:
--   timezone, content_rating, genre, language_list  (fully independent)
--   → country          (needs timezone)
--   → app_user         (needs country)
--   → person           (needs app_user for create_by)
--   → content          (needs app_user, content_rating, country)
--   → tv_show, movie, season, episode, media_path, content_genre,
--     content_language, content_role
--   → transaction_list, transaction_detail, reviews,
--     user_content, playlist, playlist_item
-- ########################################################################################################


-- ══════════════════════════════════════════════════════════════════════
-- 1. FULLY INDEPENDENT TABLES
-- ══════════════════════════════════════════════════════════════════════

-- ── timezone ──────────────────────────────────────────────────────────
INSERT INTO timezone (iana_name, current_offset, abbreviation) VALUES
('UTC',                 '+00:00', 'UTC'),   -- 1
('Asia/Bangkok',        '+07:00', 'ICT'),   -- 2
('Asia/Tokyo',          '+09:00', 'JST'),   -- 3
('Asia/Shanghai',       '+08:00', 'CST'),   -- 4
('Asia/Seoul',          '+09:00', 'KST'),   -- 5
('Europe/Berlin',       '+01:00', 'CET'),   -- 6
('Europe/London',       '+00:00', 'GMT'),   -- 7
('Europe/Paris',        '+01:00', 'CET'),   -- 8
('America/New_York',    '-05:00', 'EST'),   -- 9
('America/Chicago',     '-06:00', 'CST'),   -- 10
('America/Los_Angeles', '-08:00', 'PST'),   -- 11
('Australia/Sydney',    '+11:00', 'AEDT'),  -- 12
('Pacific/Auckland',    '+13:00', 'NZDT'),  -- 13
('America/Sao_Paulo',   '-03:00', 'BRT'),   -- 14
('America/Mexico_City', '-06:00', 'CST');   -- 15

-- ── content_rating ────────────────────────────────────────────────────
INSERT INTO content_rating (rating_label, maturity_level, rating_description) VALUES
('G',      1, 'General Audiences — suitable for all ages.'),
('PG',     2, 'Parental Guidance suggested — some material may not suit young children.'),
('PG-13',  3, 'Parents strongly cautioned — some material may be inappropriate for children under 13.'),
('TV-14',  4, 'Parents strongly cautioned for children under 14 — contains intense content.'),
('R',      5, 'Restricted — under 17 requires accompanying parent or adult guardian.'),
('TV-MA',  5, 'Mature Audiences Only — may be unsuitable for children under 17.'),
('NC-17',  5, 'Adults Only — no one 17 and under admitted.');

-- ── genre ─────────────────────────────────────────────────────────────
INSERT INTO genre (genre_name) VALUES
('Sci-Fi'), ('Anime'), ('Comedy'), ('Action'), ('Mystery'),
('Thriller'), ('Romance'), ('Horror'), ('Documentary'), ('Fantasy'),
('Drama'), ('Adventure'), ('Crime'), ('Historical'), ('Psychological');

-- ── language_list ─────────────────────────────────────────────────────
INSERT INTO language_list (language_name, native_name) VALUES
('English',    'English'),    -- 1
('Thai',       'ไทย'),        -- 2
('Japanese',   '日本語'),       -- 3
('Spanish',    'Español'),    -- 4
('Korean',     '한국어'),       -- 5
('French',     'Français'),   -- 6
('German',     'Deutsch'),    -- 7
('Mandarin',   '中文'),        -- 8
('Italian',    'Italiano'),   -- 9
('Russian',    'Русский'),    -- 10
('Portuguese', 'Português'),  -- 11
('Arabic',     'العربية'),    -- 12
('Hindi',      'हिन्दी'),        -- 13
('Turkish',    'Türkçe'),     -- 14
('Dutch',      'Nederlands'); -- 15


-- ══════════════════════════════════════════════════════════════════════
-- 2. TABLES THAT DEPEND ON timezone
-- ══════════════════════════════════════════════════════════════════════

-- ── country ───────────────────────────────────────────────────────────
INSERT INTO country (country_name, primary_timezone_id) VALUES
('Thailand',         2),   -- 1
('China',            4),   -- 2
('Germany',          6),   -- 3
('Japan',            3),   -- 4
('United States',    9),   -- 5
('South Korea',      5),   -- 6
('France',           8),   -- 7
('United Kingdom',   7),   -- 8
('Australia',       12),   -- 9
('Brazil',          14),   -- 10
('Mexico',          15),   -- 11
('New Zealand',     13),   -- 12
('Canada',          10),   -- 13
('Spain',            8),   -- 14
('Italy',            8);   -- 15


-- ══════════════════════════════════════════════════════════════════════
-- 3. TABLES THAT DEPEND ON country
-- ══════════════════════════════════════════════════════════════════════

-- ── app_user ──────────────────────────────────────────────────────────
-- NOTE: app_user must be inserted before person, because person.create_by
--       references app_user(user_id).
INSERT INTO app_user (username, email, user_password, register_date, country_id, user_type, user_status) VALUES
('Wirachat_Admin',   'wirachat@kmutt.ac.th',    'safe123',       '2021-01-15 09:00:00',  1,  'Admin',    'active'),   -- 1
('GenshinLover',     'traveler@teyvat.com',      'paimon',        '2021-02-03 14:22:11',  2,  'Premium',  'active'),   -- 2
('Anya_Fans',        'wakuwaku@spy.com',         'peanuts',       '2021-03-18 08:45:30',  3,  'Free',     'active'),   -- 3
('Luffy_Pirate',     'luffy@grandline.com',      'meat',          '2021-05-07 20:10:05',  4,  'Premium',  'active'),   -- 4
('Zoro_Lost',        'zoro@swords.com',          'bushido',       '2021-06-14 11:33:47',  4,  'Free',     'active'),   -- 5
('Nami_Money',       'nami@berries.com',         'gold',          '2021-07-29 16:55:22',  4,  'Premium',  'active'),   -- 6
('Sanji_Cook',       'sanji@allblue.com',        'mellorine',     '2021-08-05 07:12:59',  4,  'Free',     'active'),   -- 7
('Robin_History',    'robin@ohara.com',          'archaeology',   '2021-09-20 13:40:00',  4,  'Premium',  'active'),   -- 8
('Chopper_Doc',      'chopper@drum.com',         'candy',         '2021-10-11 19:08:34',  4,  'Free',     'active'),   -- 9
('Franky_Super',     'franky@water7.com',        'cola',          '2021-11-28 10:27:16',  4,  'Premium',  'active'),   -- 10
('Brook_Soul',       'brook@soul.com',           'laboon',        '2022-01-04 22:15:50',  4,  'Free',     'active'),   -- 11
('Jimbei_Fish',      'jimbei@sea.com',           'karate',        '2022-02-17 09:03:41',  4,  'Premium',  'active'),   -- 12
('Usopp_Sniper',     'usopp@brave.com',          'popgreen',      '2022-03-30 15:49:07',  4,  'Free',     'active'),   -- 13
('Law_Heart',        'law@op.com',               'shambles',      '2022-05-12 18:22:33', 14,  'Premium',  'active'),   -- 14
('Kid_Metal',        'kid@punk.com',             'magnet',        '2022-06-08 06:57:44',  9,  'Free',     'active'),   -- 15
('Hancock_Love',     'hancock@kuja.com',         'salome',        '2022-08-01 12:34:19',  6,  'Premium',  'active'),   -- 16
('Ace_Fire',         'ace@spade.com',            'meramera',      '2022-09-23 21:05:02', 10,  'Free',     'suspended'),-- 17
('Sabo_Dragon',      'sabo@rev.com',             'dragonclaw',    '2022-10-16 17:48:55', 10,  'Premium',  'active'),   -- 18
('Shanks_Red',       'shanks@yonko.com',         'haki',          '2022-11-07 08:31:28',  8,  'Free',     'active'),   -- 19
('Buggy_Clown',      'buggy@cross.com',          'flashy',        '2022-12-25 23:59:00', 15,  'Premium',  'active'),   -- 20
('Naruto_Uzumaki',   'naruto@konoha.com',        'dattebayo',     '2023-01-09 10:14:37',  4,  'Premium',  'active'),   -- 21
('Sasuke_Uchiha',    'sasuke@avenger.com',       'chidori',       '2023-02-14 14:00:00',  4,  'Free',     'active'),   -- 22
('Sakura_Haruno',    'sakura@medic.com',         'shannaro',      '2023-03-22 09:30:15',  4,  'Premium',  'active'),   -- 23
('Kakashi_Sensei',   'kakashi@sharingan.com',    'copycat',       '2023-04-01 00:00:01',  4,  'Free',     'active'),   -- 24
('Itachi_Crow',      'itachi@akatsuki.com',      'tsukuyomi',     '2023-05-18 03:33:33',  4,  'Premium',  'active'),   -- 25
('Goku_Saiyan',      'goku@capsule.com',         'kamehameha',    '2023-06-29 12:00:00',  5,  'Free',     'active'),   -- 26
('Vegeta_Prince',    'vegeta@saiyan.com',        'finalflash',    '2023-07-04 08:08:08',  5,  'Premium',  'active'),   -- 27
('Bulma_Genius',     'bulma@brief.com',          'dragonball',    '2023-08-15 16:45:20',  5,  'Free',     'active'),   -- 28
('Tanjiro_Blade',    'tanjiro@hashira.com',      'hinokami',      '2023-09-03 11:22:44',  4,  'Premium',  'active'),   -- 29
('Nezuko_Box',       'nezuko@demon.com',         'bamboo',        '2023-10-10 19:55:10',  4,  'Free',     'active'),   -- 30
('Edward_Elric',     'edward@alchemy.com',       'equivalent',    '2024-01-07 08:00:00',  3,  'Premium',  'active'),   -- 31
('Roy_Mustang',      'roy@flame.com',            'colonel',       '2024-02-14 09:14:59',  3,  'Free',     'active'),   -- 32
('Mikasa_Ackerman',  'mikasa@survey.com',        'scarf',         '2024-03-05 07:30:00',  3,  'Premium',  'active'),   -- 33
('Armin_Strategist', 'armin@brain.com',          'colossal',      '2024-04-18 13:13:13',  3,  'Free',     'active'),   -- 34
('Levi_Captain',     'levi@clean.com',           'HumanitysBest', '2024-05-01 05:00:00',  3,  'Premium',  'active'),   -- 35
('Sasha_Potato',     'sasha@potato.com',         'potatoes',      '2024-06-20 12:30:00',  3,  'Free',     'active'),   -- 36
('Historia_Queen',   'historia@wall.com',        'reiss',         '2024-07-14 18:00:00',  3,  'Premium',  'active'),   -- 37
('Erwin_Smith',      'erwin@commander.com',      'chargefwd',     '2024-08-09 06:45:00',  3,  'Free',     'active'),   -- 38
('Hange_Zoe',        'hange@titan.com',          'experiment',    '2024-09-27 20:20:20',  3,  'Premium',  'active'),   -- 39
('Reiner_Armor',     'reiner@warrior.com',       'bertholt',      '2024-11-11 11:11:11',  3,  'Free',     'active');   -- 40


-- ══════════════════════════════════════════════════════════════════════
-- 4. TABLES THAT DEPEND ON app_user
-- ══════════════════════════════════════════════════════════════════════

-- ── person ────────────────────────────────────────────────────────────
-- create_by = 1 (Wirachat_Admin) for all persons; update_by = NULL (never modified)
INSERT INTO person (first_name, middle_name, last_name, nationality, birth_date, create_by, update_by) VALUES
('Christopher',  NULL,      'Nolan',       'British',      '1970-07-30', 1, NULL),  -- 1
('Tatsuya',      NULL,      'Endo',        'Japanese',     '1980-07-23', 1, NULL),  -- 2
('Steve',        NULL,      'Carell',      'American',     '1962-08-16', 1, NULL),  -- 3
('Heath',        NULL,      'Ledger',      'Australian',   '1979-04-04', 1, NULL),  -- 4
('Eiichiro',     NULL,      'Oda',         'Japanese',     '1975-01-01', 1, NULL),  -- 5
('Bryan',        NULL,      'Cranston',    'American',     '1956-03-07', 1, NULL),  -- 6
('Zendaya',      NULL,      'Coleman',     'American',     '1996-09-01', 1, NULL),  -- 7
('Bong',         NULL,      'Joon-ho',     'Korean',       '1969-09-14', 1, NULL),  -- 8
('Pedro',        NULL,      'Pascal',      'Chilean',      '1975-04-02', 1, NULL),  -- 9
('Michelle',     NULL,      'Yeoh',        'Malaysian',    '1962-08-06', 1, NULL),  -- 10
('Hajime',       NULL,      'Isayama',     'Japanese',     '1986-08-29', 1, NULL),  -- 11
('Quentin',      NULL,      'Tarantino',   'American',     '1963-03-27', 1, NULL),  -- 12
('Martin',       NULL,      'Scorsese',    'American',     '1942-11-17', 1, NULL),  -- 13
('Denis',        NULL,      'Villeneuve',  'Canadian',     '1967-10-03', 1, NULL),  -- 14
('Makoto',       NULL,      'Shinkai',     'Japanese',     '1973-02-09', 1, NULL),  -- 15
('Hayao',        NULL,      'Miyazaki',    'Japanese',     '1941-01-05', 1, NULL),  -- 16
('Greta',        NULL,      'Gerwig',      'American',     '1983-08-04', 1, NULL),  -- 17
('Wes',          NULL,      'Anderson',    'American',     '1969-05-01', 1, NULL),  -- 18
('Guillermo',    NULL,      'del Toro',    'Mexican',      '1964-10-09', 1, NULL),  -- 19
('Taika',        NULL,      'Waititi',     'New Zealand',  '1975-08-16', 1, NULL),  -- 20
('Masashi',      NULL,      'Kishimoto',   'Japanese',     '1974-11-08', 1, NULL),  -- 21
('Akira',        NULL,      'Toriyama',    'Japanese',     '1955-05-05', 1, NULL),  -- 22
('Koyoharu',     NULL,      'Gotouge',     'Japanese',     '1989-05-05', 1, NULL),  -- 23
('Hiromu',       NULL,      'Arakawa',     'Japanese',     '1973-05-08', 1, NULL),  -- 24
('Aaron',        NULL,      'Paul',        'American',     '1979-08-27', 1, NULL),  -- 25
('Anna',         NULL,      'Gunn',        'American',     '1968-08-11', 1, NULL),  -- 26
('Millie',       'Bobby',   'Brown',       'British',      '2004-02-19', 1, NULL),  -- 27
('Winona',       NULL,      'Ryder',       'American',     '1971-10-29', 1, NULL),  -- 28
('Al',           NULL,      'Pacino',      'American',     '1940-04-25', 1, NULL),  -- 29
('Marlon',       NULL,      'Brando',      'American',     '1924-04-03', 1, NULL),  -- 30
('Timothee',     NULL,      'Chalamet',    'American',     '1995-12-27', 1, NULL),  -- 31
('Zoe',          NULL,      'Saldana',     'American',     '1978-06-19', 1, NULL),  -- 32
('Ryan',         NULL,      'Gosling',     'Canadian',     '1980-11-12', 1, NULL),  -- 33
('Cate',         NULL,      'Blanchett',   'Australian',   '1969-05-14', 1, NULL),  -- 34
('Tom',          NULL,      'Hanks',       'American',     '1956-07-09', 1, NULL);  -- 35


-- ══════════════════════════════════════════════════════════════════════
-- 5. CONTENT
-- ══════════════════════════════════════════════════════════════════════

-- update_by = 1 (Wirachat_Admin) for all content entries
INSERT INTO content (title, content_description, release_date, price, content_type, rating_id, country_id, update_by) VALUES
('Interstellar',                     'Space exploration.',                          '2014-11-07',  9.99,  'Movie',    3,  8,  1),  -- 1
('Spy x Family',                     'Spy family.',                                 '2022-04-09',  19.99, 'TV_Show',  3,  4,  1),  -- 2
('The Office',                       'Paper company.',                              '2005-03-24',  24.99, 'TV_Show',  4,  5,  1),  -- 3
('Inception',                        'Dream heist.',                                '2010-07-16',  7.99,  'Movie',    3,  8,  1),  -- 4
('One Piece',                        'Pirate treasure.',                            '1999-10-20',  49.99, 'TV_Show',  3,  4,  1),  -- 5
('Breaking Bad',                     'Chemistry teacher.',                          '2008-01-20',  29.99, 'TV_Show',  6,  5,  1),  -- 6
('Your Name',                        'Star-crossed swap.',                          '2016-08-26',  12.99, 'Movie',    3,  4,  1),  -- 7
('Dune',                             'Spice wars.',                                 '2021-10-22',  14.99, 'Movie',    3, 13,  1),  -- 8
('Attack on Titan',                  'Giant war.',                                  '2013-04-07',  35.00, 'TV_Show',  4,  4,  1),  -- 9
('The Mandalorian',                  'Bounty hunter.',                              '2019-11-12',  19.99, 'TV_Show',  4,  5,  1),  -- 10
('Parasite',                         'Class struggle.',                             '2019-05-30',  9.50,  'Movie',    5,  6,  1),  -- 11
('The Dark Knight',                  'Gotham hero.',                                '2008-07-18',  5.99,  'Movie',    5,  8,  1),  -- 12
('Tenet',                            'Reverse time.',                               '2020-08-26',  11.99, 'Movie',    5,  8,  1),  -- 13
('Everything Everywhere All at Once','Multiverse.',                                 '2022-03-25',  13.50, 'Movie',    3,  5,  1),  -- 14
('Jujutsu Kaisen',                   'Curse hunters.',                              '2020-10-03',  25.00, 'TV_Show',  4,  4,  1),  -- 15
('Better Call Saul',                 'Criminal lawyer.',                            '2015-02-08',  22.00, 'TV_Show',  6,  5,  1),  -- 16
('Stranger Things',                  'Mysterious girl.',                            '2016-07-15',  18.00, 'TV_Show',  4,  5,  1),  -- 17
('The Godfather',                    'Crime family.',                               '1972-03-24',  15.00, 'Movie',    5,  5,  1),  -- 18
('Spirited Away',                    'Ghost world.',                                '2001-07-20',  10.00, 'Movie',    1,  4,  1),  -- 19
('Chernobyl',                        'Power plant.',                                '2019-05-06',  12.00, 'TV_Show',  4,  8,  1),  -- 20
('Naruto',                           'Ninja who dreams of being Hokage.',           '2002-10-03',  29.99, 'TV_Show',  2,  4,  1),  -- 21
('Dragon Ball Z',                    'Saiyan warriors protect Earth.',              '1989-04-26',  24.99, 'TV_Show',  2,  4,  1),  -- 22
('Demon Slayer',                     'Tanjiro fights demons for Nezuko.',           '2019-04-06',  22.00, 'TV_Show',  3,  4,  1),  -- 23
('Fullmetal Alchemist: Brotherhood', 'Brothers seek the Philosopher Stone.',       '2009-04-05',  26.00, 'TV_Show',  3,  4,  1),  -- 24
('Dune: Part Two',                   'Paul leads the Fremen to war.',              '2024-03-01',  16.99, 'Movie',    5, 13,  1),  -- 25
('Oppenheimer',                      'Father of the atomic bomb.',                 '2023-07-21',  12.99, 'Movie',    3,  8,  1),  -- 26
('The Grand Budapest Hotel',         'Legendary concierge in a fading empire.',    '2014-03-07',  8.99,  'Movie',    3,  3,  1),  -- 27
('Pulp Fiction',                     'Interconnected crime stories in L.A.',       '1994-10-14',  7.99,  'Movie',    5,  5,  1),  -- 28
('Squid Game',                       'Desperate people compete in deadly games.',  '2021-09-17',  18.00, 'TV_Show',  6,  6,  1),  -- 29
('Arcane',                           'The origins of Vi and Jinx.',                '2021-11-06',  15.00, 'TV_Show',  3,  7,  1),  -- 30
('Severance',                        'Office workers with severed memories.',       '2022-02-18',  14.99, 'TV_Show',  4,  5,  1),  -- 31
('Blade Runner 2049',                'A replicant hunter uncovers secrets.',        '2017-10-06',  11.99, 'Movie',    3, 13,  1),  -- 32
('Princess Mononoke',                'Humans clash with forest spirits.',           '1997-07-12',  9.99,  'Movie',    1,  4,  1),  -- 33
('Goodfellas',                       'Rise and fall of a mob associate.',           '1990-09-19',  8.50,  'Movie',    5,  5,  1),  -- 34
('The Bear',                         'A fine-dining chef runs a sandwich shop.',   '2022-06-23',  12.00, 'TV_Show',  4,  5,  1);  -- 35


-- ══════════════════════════════════════════════════════════════════════
-- 6. CONTENT SUBCLASSES — movie, tv_show, season, episode
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO movie (content_id, run_time) VALUES
(1,  169),
(4,  148),
(7,  106),
(8,  155),
(11, 132),
(12, 152),
(13, 150),
(14, 139),
(18, 175),
(19, 125),
(25, 166),
(26, 180),
(27,  99),
(28, 154),
(32, 164),
(33, 133),
(34, 146);

INSERT INTO tv_show (content_id, curr_status) VALUES
(2,  'On-going'),
(3,  'Ended'),
(5,  'On-going'),
(6,  'Ended'),
(9,  'Ended'),
(10, 'On-going'),
(15, 'On-going'),
(16, 'Ended'),
(17, 'On-going'),
(20, 'Ended'),
(21, 'Ended'),
(22, 'Ended'),
(23, 'On-going'),
(24, 'Ended'),
(29, 'On-going'),
(30, 'On-going'),
(31, 'On-going'),
(35, 'On-going');

-- Fixed typo: Sypnosis → synopsis
INSERT INTO season (content_id, season_num, air_date, synopsis) VALUES
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

-- episode_id values are assigned sequentially by IDENTITY (1–75) in insertion order.
-- These are documented in comments for use in the media_path section below.
INSERT INTO episode (content_id, season_num, episode_num, title, run_time) VALUES
-- content 2 (Spy x Family) → episode_id 1–5
(2,  1, 1, 'Operation Strix',                                        24),  -- ep_id 1
(2,  1, 2, 'Secure a Wife',                                          24),  -- ep_id 2
(2,  1, 3, 'Prepare for the Interview',                              24),  -- ep_id 3
(2,  2, 1, 'The Tender Lie',                                         24),  -- ep_id 4
(2,  2, 2, 'Showdown in the School',                                 24),  -- ep_id 5
-- content 3 (The Office) → episode_id 6–11
(3,  1, 1, 'Pilot',                                                  22),  -- ep_id 6
(3,  1, 2, 'Diversity Day',                                          22),  -- ep_id 7
(3,  2, 1, 'The Dundies',                                            22),  -- ep_id 8
(3,  2, 2, 'Sexual Harassment',                                      22),  -- ep_id 9
(3,  3, 1, 'Gay Witch Hunt',                                         22),  -- ep_id 10
(3,  3, 2, 'The Convention',                                         22),  -- ep_id 11
-- content 5 (One Piece) → episode_id 12–15
(5,  1, 1, 'I''m Luffy! The Man Who Will Become the Pirate King!',  24),  -- ep_id 12
(5,  1, 2, 'Enter the Great Swordsman! Pirate Hunter Zoro!',         24),  -- ep_id 13
(5,  2, 1, 'Farewell, Drum Island! I''ll Always Be Dreaming',        24),  -- ep_id 14
(5,  2, 2, 'Alabasta Animal Land and the Kung Fu Dugongs!',          24),  -- ep_id 15
-- content 6 (Breaking Bad) → episode_id 16–21
(6,  1, 1, 'Pilot',                                                  58),  -- ep_id 16
(6,  1, 2, 'Cat''s in the Bag',                                      48),  -- ep_id 17
(6,  2, 1, 'Seven Thirty-Seven',                                     47),  -- ep_id 18
(6,  2, 2, 'Down',                                                   47),  -- ep_id 19
(6,  3, 1, 'No Mas',                                                 47),  -- ep_id 20
(6,  3, 2, 'Caballo Sin Nombre',                                     47),  -- ep_id 21
-- content 9 (Attack on Titan) → episode_id 22–27
(9,  1, 1, 'To You, 2000 Years Later',                               24),  -- ep_id 22
(9,  1, 2, 'That Day',                                               24),  -- ep_id 23
(9,  2, 1, 'Beast Titan',                                            24),  -- ep_id 24
(9,  2, 2, 'I''m Home',                                              24),  -- ep_id 25
(9,  3, 1, 'Smoke Signal',                                           24),  -- ep_id 26
(9,  3, 2, 'Midnight Sun',                                           24),  -- ep_id 27
-- content 10 (The Mandalorian) → episode_id 28–31
(10, 1, 1, 'Chapter 1: The Mandalorian',                             39),  -- ep_id 28
(10, 1, 2, 'Chapter 2: The Child',                                   32),  -- ep_id 29
(10, 2, 1, 'Chapter 9: The Marshal',                                 55),  -- ep_id 30
(10, 2, 2, 'Chapter 10: The Passenger',                              41),  -- ep_id 31
-- content 15 (Jujutsu Kaisen) → episode_id 32–35
(15, 1, 1, 'Ryomen Sukuna',                                          24),  -- ep_id 32
(15, 1, 2, 'For Myself',                                             24),  -- ep_id 33
(15, 2, 1, 'The Gojo Arc',                                           24),  -- ep_id 34
(15, 2, 2, 'Hidden Inventory',                                       24),  -- ep_id 35
-- content 16 (Better Call Saul) → episode_id 36–39
(16, 1, 1, 'Uno',                                                    53),  -- ep_id 36
(16, 1, 2, 'Mijo',                                                   43),  -- ep_id 37
(16, 2, 1, 'Switch',                                                 46),  -- ep_id 38
(16, 2, 2, 'Cobbler',                                                47),  -- ep_id 39
-- content 17 (Stranger Things) → episode_id 40–45
(17, 1, 1, 'The Vanishing of Will Byers',                            48),  -- ep_id 40
(17, 1, 2, 'The Weirdo on Maple Street',                             55),  -- ep_id 41
(17, 2, 1, 'MADMAX',                                                 48),  -- ep_id 42
(17, 2, 2, 'Trick or Treat, Freak',                                  56),  -- ep_id 43
(17, 3, 1, 'Suzie, Do You Copy?',                                    51),  -- ep_id 44
(17, 3, 2, 'The Mall Rats',                                          52),  -- ep_id 45
-- content 20 (Chernobyl) → episode_id 46–47
(20, 1, 1, '1:23:45',                                                59),  -- ep_id 46
(20, 1, 2, 'Please Remain Calm',                                     59),  -- ep_id 47
-- content 21 (Naruto) → episode_id 48–51
(21, 1, 1, 'Enter: Naruto Uzumaki!',                                 24),  -- ep_id 48
(21, 1, 2, 'My Name Is Konohamaru!',                                 24),  -- ep_id 49
(21, 2, 1, 'Chunin Exam on Fire! Naruto vs. Konohamaru!',            24),  -- ep_id 50
(21, 2, 2, 'The Fourth Hokage',                                      24),  -- ep_id 51
-- content 22 (Dragon Ball Z) → episode_id 52–55
(22, 1, 1, 'The New Threat',                                         24),  -- ep_id 52
(22, 1, 2, 'Reunions',                                               24),  -- ep_id 53
(22, 2, 1, 'A New Goal: Namek',                                      24),  -- ep_id 54
(22, 2, 2, 'Journey to Namek',                                       24),  -- ep_id 55
-- content 23 (Demon Slayer) → episode_id 56–59
(23, 1, 1, 'Cruelty',                                                26),  -- ep_id 56
(23, 1, 2, 'Trainer Sakonji Urokodaki',                              23),  -- ep_id 57
(23, 2, 1, 'Sound Hashira Tengen Uzui',                              47),  -- ep_id 58
(23, 2, 2, 'Infiltrating the Entertainment District',                29),  -- ep_id 59
-- content 24 (Fullmetal Alchemist: Brotherhood) → episode_id 60–63
(24, 1, 1, 'Fullmetal Alchemist',                                    24),  -- ep_id 60
(24, 1, 2, 'The First Day',                                          24),  -- ep_id 61
(24, 2, 1, 'Greed',                                                  24),  -- ep_id 62
(24, 2, 2, 'The Dwarf in the Flask',                                 24),  -- ep_id 63
-- content 29 (Squid Game) → episode_id 64–65
(29, 1, 1, 'Red Light, Green Light',                                 60),  -- ep_id 64
(29, 1, 2, 'Hell',                                                   63),  -- ep_id 65
-- content 30 (Arcane) → episode_id 66–67
(30, 1, 1, 'Welcome to the Playground',                              39),  -- ep_id 66
(30, 1, 2, 'Some Mysteries Are Better Left Unsolved',                41),  -- ep_id 67
-- content 31 (Severance) → episode_id 68–71
(31, 1, 1, 'Good News About Hell',                                   60),  -- ep_id 68
(31, 1, 2, 'Half Loop',                                              37),  -- ep_id 69
(31, 2, 1, 'Cold Harbor',                                            60),  -- ep_id 70
(31, 2, 2, 'Goodbye, Mrs. Selvig',                                   52),  -- ep_id 71
-- content 35 (The Bear) → episode_id 72–75
(35, 1, 1, 'System',                                                 35),  -- ep_id 72
(35, 1, 2, 'Hands',                                                  27),  -- ep_id 73
(35, 2, 1, 'Entree',                                                 27),  -- ep_id 74
(35, 2, 2, 'Pasta',                                                  27);  -- ep_id 75


-- ══════════════════════════════════════════════════════════════════════
-- 7. MEDIA PATH
-- ══════════════════════════════════════════════════════════════════════
-- Replaces the old VideoQuality table.
-- Movies:   episode_id = NULL  (one row per quality)
-- TV Shows: episode_id = <episode.episode_id>  (one row per episode per quality)
-- file_path convention:
--   Movies  → /media/movies/{content_id}/{quality}.mp4
--   TV Shows → /media/shows/{content_id}/ep_{episode_id}/{quality}.mp4

INSERT INTO media_path (content_id, episode_id, quality, file_path, priority) VALUES
-- ── Movies (episode_id = NULL) ────────────────────────────────────────
-- content 1  (Interstellar): 4K, 1080p, 720p
(1,  NULL, '4K',    '/media/movies/1/4K.mp4',    1),
(1,  NULL, '1080p', '/media/movies/1/1080p.mp4', 1),
(1,  NULL, '720p',  '/media/movies/1/720p.mp4',  1),
-- content 4  (Inception): 4K, 1080p
(4,  NULL, '4K',    '/media/movies/4/4K.mp4',    1),
(4,  NULL, '1080p', '/media/movies/4/1080p.mp4', 1),
-- content 7  (Your Name): 1080p, 720p
(7,  NULL, '1080p', '/media/movies/7/1080p.mp4', 1),
(7,  NULL, '720p',  '/media/movies/7/720p.mp4',  1),
-- content 8  (Dune): 4K, 1080p, 720p
(8,  NULL, '4K',    '/media/movies/8/4K.mp4',    1),
(8,  NULL, '1080p', '/media/movies/8/1080p.mp4', 1),
(8,  NULL, '720p',  '/media/movies/8/720p.mp4',  1),
-- content 11 (Parasite): 1080p
(11, NULL, '1080p', '/media/movies/11/1080p.mp4',1),
-- content 12 (The Dark Knight): 4K, 1080p, 720p
(12, NULL, '4K',    '/media/movies/12/4K.mp4',   1),
(12, NULL, '1080p', '/media/movies/12/1080p.mp4',1),
(12, NULL, '720p',  '/media/movies/12/720p.mp4', 1),
-- content 13 (Tenet): 4K, 1080p
(13, NULL, '4K',    '/media/movies/13/4K.mp4',   1),
(13, NULL, '1080p', '/media/movies/13/1080p.mp4',1),
-- content 14 (Everything Everywhere All at Once): 4K, 1080p
(14, NULL, '4K',    '/media/movies/14/4K.mp4',   1),
(14, NULL, '1080p', '/media/movies/14/1080p.mp4',1),
-- content 18 (The Godfather): 1080p, 720p
(18, NULL, '1080p', '/media/movies/18/1080p.mp4',1),
(18, NULL, '720p',  '/media/movies/18/720p.mp4', 1),
-- content 19 (Spirited Away): 1080p, 720p
(19, NULL, '1080p', '/media/movies/19/1080p.mp4',1),
(19, NULL, '720p',  '/media/movies/19/720p.mp4', 1),
-- content 25 (Dune: Part Two): 4K, 1080p, 720p
(25, NULL, '4K',    '/media/movies/25/4K.mp4',   1),
(25, NULL, '1080p', '/media/movies/25/1080p.mp4',1),
(25, NULL, '720p',  '/media/movies/25/720p.mp4', 1),
-- content 26 (Oppenheimer): 4K, 1080p
(26, NULL, '4K',    '/media/movies/26/4K.mp4',   1),
(26, NULL, '1080p', '/media/movies/26/1080p.mp4',1),
-- content 27 (The Grand Budapest Hotel): 1080p, 720p
(27, NULL, '1080p', '/media/movies/27/1080p.mp4',1),
(27, NULL, '720p',  '/media/movies/27/720p.mp4', 1),
-- content 28 (Pulp Fiction): 1080p, 720p
(28, NULL, '1080p', '/media/movies/28/1080p.mp4',1),
(28, NULL, '720p',  '/media/movies/28/720p.mp4', 1),
-- content 32 (Blade Runner 2049): 4K, 1080p
(32, NULL, '4K',    '/media/movies/32/4K.mp4',   1),
(32, NULL, '1080p', '/media/movies/32/1080p.mp4',1),
-- content 33 (Princess Mononoke): 1080p, 720p
(33, NULL, '1080p', '/media/movies/33/1080p.mp4',1),
(33, NULL, '720p',  '/media/movies/33/720p.mp4', 1),
-- content 34 (Goodfellas): 1080p, 720p
(34, NULL, '1080p', '/media/movies/34/1080p.mp4',1),
(34, NULL, '720p',  '/media/movies/34/720p.mp4', 1),

-- ── TV Shows (one row per episode per quality) ────────────────────────
-- content 2 (Spy x Family): 1080p, 720p — ep_id 1–5
(2,  1, '1080p', '/media/shows/2/ep_1/1080p.mp4',  1),
(2,  1, '720p',  '/media/shows/2/ep_1/720p.mp4',   1),
(2,  2, '1080p', '/media/shows/2/ep_2/1080p.mp4',  1),
(2,  2, '720p',  '/media/shows/2/ep_2/720p.mp4',   1),
(2,  3, '1080p', '/media/shows/2/ep_3/1080p.mp4',  1),
(2,  3, '720p',  '/media/shows/2/ep_3/720p.mp4',   1),
(2,  4, '1080p', '/media/shows/2/ep_4/1080p.mp4',  1),
(2,  4, '720p',  '/media/shows/2/ep_4/720p.mp4',   1),
(2,  5, '1080p', '/media/shows/2/ep_5/1080p.mp4',  1),
(2,  5, '720p',  '/media/shows/2/ep_5/720p.mp4',   1),
-- content 3 (The Office): 720p only — ep_id 6–11
(3,  6,  '720p', '/media/shows/3/ep_6/720p.mp4',   1),
(3,  7,  '720p', '/media/shows/3/ep_7/720p.mp4',   1),
(3,  8,  '720p', '/media/shows/3/ep_8/720p.mp4',   1),
(3,  9,  '720p', '/media/shows/3/ep_9/720p.mp4',   1),
(3,  10, '720p', '/media/shows/3/ep_10/720p.mp4',  1),
(3,  11, '720p', '/media/shows/3/ep_11/720p.mp4',  1),
-- content 5 (One Piece): 1080p, 720p — ep_id 12–15
(5,  12, '1080p', '/media/shows/5/ep_12/1080p.mp4',1),
(5,  12, '720p',  '/media/shows/5/ep_12/720p.mp4', 1),
(5,  13, '1080p', '/media/shows/5/ep_13/1080p.mp4',1),
(5,  13, '720p',  '/media/shows/5/ep_13/720p.mp4', 1),
(5,  14, '1080p', '/media/shows/5/ep_14/1080p.mp4',1),
(5,  14, '720p',  '/media/shows/5/ep_14/720p.mp4', 1),
(5,  15, '1080p', '/media/shows/5/ep_15/1080p.mp4',1),
(5,  15, '720p',  '/media/shows/5/ep_15/720p.mp4', 1),
-- content 6 (Breaking Bad): 4K, 1080p — ep_id 16–21
(6,  16, '4K',    '/media/shows/6/ep_16/4K.mp4',   1),
(6,  16, '1080p', '/media/shows/6/ep_16/1080p.mp4',1),
(6,  17, '4K',    '/media/shows/6/ep_17/4K.mp4',   1),
(6,  17, '1080p', '/media/shows/6/ep_17/1080p.mp4',1),
(6,  18, '4K',    '/media/shows/6/ep_18/4K.mp4',   1),
(6,  18, '1080p', '/media/shows/6/ep_18/1080p.mp4',1),
(6,  19, '4K',    '/media/shows/6/ep_19/4K.mp4',   1),
(6,  19, '1080p', '/media/shows/6/ep_19/1080p.mp4',1),
(6,  20, '4K',    '/media/shows/6/ep_20/4K.mp4',   1),
(6,  20, '1080p', '/media/shows/6/ep_20/1080p.mp4',1),
(6,  21, '4K',    '/media/shows/6/ep_21/4K.mp4',   1),
(6,  21, '1080p', '/media/shows/6/ep_21/1080p.mp4',1),
-- content 9 (Attack on Titan): 1080p, 720p — ep_id 22–27
(9,  22, '1080p', '/media/shows/9/ep_22/1080p.mp4',1),
(9,  22, '720p',  '/media/shows/9/ep_22/720p.mp4', 1),
(9,  23, '1080p', '/media/shows/9/ep_23/1080p.mp4',1),
(9,  23, '720p',  '/media/shows/9/ep_23/720p.mp4', 1),
(9,  24, '1080p', '/media/shows/9/ep_24/1080p.mp4',1),
(9,  24, '720p',  '/media/shows/9/ep_24/720p.mp4', 1),
(9,  25, '1080p', '/media/shows/9/ep_25/1080p.mp4',1),
(9,  25, '720p',  '/media/shows/9/ep_25/720p.mp4', 1),
(9,  26, '1080p', '/media/shows/9/ep_26/1080p.mp4',1),
(9,  26, '720p',  '/media/shows/9/ep_26/720p.mp4', 1),
(9,  27, '1080p', '/media/shows/9/ep_27/1080p.mp4',1),
(9,  27, '720p',  '/media/shows/9/ep_27/720p.mp4', 1),
-- content 10 (The Mandalorian): 4K, 1080p — ep_id 28–31
(10, 28, '4K',    '/media/shows/10/ep_28/4K.mp4',   1),
(10, 28, '1080p', '/media/shows/10/ep_28/1080p.mp4',1),
(10, 29, '4K',    '/media/shows/10/ep_29/4K.mp4',   1),
(10, 29, '1080p', '/media/shows/10/ep_29/1080p.mp4',1),
(10, 30, '4K',    '/media/shows/10/ep_30/4K.mp4',   1),
(10, 30, '1080p', '/media/shows/10/ep_30/1080p.mp4',1),
(10, 31, '4K',    '/media/shows/10/ep_31/4K.mp4',   1),
(10, 31, '1080p', '/media/shows/10/ep_31/1080p.mp4',1),
-- content 15 (Jujutsu Kaisen): 1080p, 720p — ep_id 32–35
(15, 32, '1080p', '/media/shows/15/ep_32/1080p.mp4',1),
(15, 32, '720p',  '/media/shows/15/ep_32/720p.mp4', 1),
(15, 33, '1080p', '/media/shows/15/ep_33/1080p.mp4',1),
(15, 33, '720p',  '/media/shows/15/ep_33/720p.mp4', 1),
(15, 34, '1080p', '/media/shows/15/ep_34/1080p.mp4',1),
(15, 34, '720p',  '/media/shows/15/ep_34/720p.mp4', 1),
(15, 35, '1080p', '/media/shows/15/ep_35/1080p.mp4',1),
(15, 35, '720p',  '/media/shows/15/ep_35/720p.mp4', 1),
-- content 16 (Better Call Saul): 1080p, 720p — ep_id 36–39
(16, 36, '1080p', '/media/shows/16/ep_36/1080p.mp4',1),
(16, 36, '720p',  '/media/shows/16/ep_36/720p.mp4', 1),
(16, 37, '1080p', '/media/shows/16/ep_37/1080p.mp4',1),
(16, 37, '720p',  '/media/shows/16/ep_37/720p.mp4', 1),
(16, 38, '1080p', '/media/shows/16/ep_38/1080p.mp4',1),
(16, 38, '720p',  '/media/shows/16/ep_38/720p.mp4', 1),
(16, 39, '1080p', '/media/shows/16/ep_39/1080p.mp4',1),
(16, 39, '720p',  '/media/shows/16/ep_39/720p.mp4', 1),
-- content 17 (Stranger Things): 4K, 1080p — ep_id 40–45
(17, 40, '4K',    '/media/shows/17/ep_40/4K.mp4',   1),
(17, 40, '1080p', '/media/shows/17/ep_40/1080p.mp4',1),
(17, 41, '4K',    '/media/shows/17/ep_41/4K.mp4',   1),
(17, 41, '1080p', '/media/shows/17/ep_41/1080p.mp4',1),
(17, 42, '4K',    '/media/shows/17/ep_42/4K.mp4',   1),
(17, 42, '1080p', '/media/shows/17/ep_42/1080p.mp4',1),
(17, 43, '4K',    '/media/shows/17/ep_43/4K.mp4',   1),
(17, 43, '1080p', '/media/shows/17/ep_43/1080p.mp4',1),
(17, 44, '4K',    '/media/shows/17/ep_44/4K.mp4',   1),
(17, 44, '1080p', '/media/shows/17/ep_44/1080p.mp4',1),
(17, 45, '4K',    '/media/shows/17/ep_45/4K.mp4',   1),
(17, 45, '1080p', '/media/shows/17/ep_45/1080p.mp4',1),
-- content 20 (Chernobyl): 4K, 1080p — ep_id 46–47
(20, 46, '4K',    '/media/shows/20/ep_46/4K.mp4',   1),
(20, 46, '1080p', '/media/shows/20/ep_46/1080p.mp4',1),
(20, 47, '4K',    '/media/shows/20/ep_47/4K.mp4',   1),
(20, 47, '1080p', '/media/shows/20/ep_47/1080p.mp4',1),
-- content 21 (Naruto): 1080p, 720p — ep_id 48–51
(21, 48, '1080p', '/media/shows/21/ep_48/1080p.mp4',1),
(21, 48, '720p',  '/media/shows/21/ep_48/720p.mp4', 1),
(21, 49, '1080p', '/media/shows/21/ep_49/1080p.mp4',1),
(21, 49, '720p',  '/media/shows/21/ep_49/720p.mp4', 1),
(21, 50, '1080p', '/media/shows/21/ep_50/1080p.mp4',1),
(21, 50, '720p',  '/media/shows/21/ep_50/720p.mp4', 1),
(21, 51, '1080p', '/media/shows/21/ep_51/1080p.mp4',1),
(21, 51, '720p',  '/media/shows/21/ep_51/720p.mp4', 1),
-- content 22 (Dragon Ball Z): 720p only — ep_id 52–55
(22, 52, '720p',  '/media/shows/22/ep_52/720p.mp4', 1),
(22, 53, '720p',  '/media/shows/22/ep_53/720p.mp4', 1),
(22, 54, '720p',  '/media/shows/22/ep_54/720p.mp4', 1),
(22, 55, '720p',  '/media/shows/22/ep_55/720p.mp4', 1),
-- content 23 (Demon Slayer): 4K, 1080p — ep_id 56–59
(23, 56, '4K',    '/media/shows/23/ep_56/4K.mp4',   1),
(23, 56, '1080p', '/media/shows/23/ep_56/1080p.mp4',1),
(23, 57, '4K',    '/media/shows/23/ep_57/4K.mp4',   1),
(23, 57, '1080p', '/media/shows/23/ep_57/1080p.mp4',1),
(23, 58, '4K',    '/media/shows/23/ep_58/4K.mp4',   1),
(23, 58, '1080p', '/media/shows/23/ep_58/1080p.mp4',1),
(23, 59, '4K',    '/media/shows/23/ep_59/4K.mp4',   1),
(23, 59, '1080p', '/media/shows/23/ep_59/1080p.mp4',1),
-- content 24 (FMA: Brotherhood): 1080p, 720p — ep_id 60–63
(24, 60, '1080p', '/media/shows/24/ep_60/1080p.mp4',1),
(24, 60, '720p',  '/media/shows/24/ep_60/720p.mp4', 1),
(24, 61, '1080p', '/media/shows/24/ep_61/1080p.mp4',1),
(24, 61, '720p',  '/media/shows/24/ep_61/720p.mp4', 1),
(24, 62, '1080p', '/media/shows/24/ep_62/1080p.mp4',1),
(24, 62, '720p',  '/media/shows/24/ep_62/720p.mp4', 1),
(24, 63, '1080p', '/media/shows/24/ep_63/1080p.mp4',1),
(24, 63, '720p',  '/media/shows/24/ep_63/720p.mp4', 1),
-- content 29 (Squid Game): 4K, 1080p — ep_id 64–65
(29, 64, '4K',    '/media/shows/29/ep_64/4K.mp4',   1),
(29, 64, '1080p', '/media/shows/29/ep_64/1080p.mp4',1),
(29, 65, '4K',    '/media/shows/29/ep_65/4K.mp4',   1),
(29, 65, '1080p', '/media/shows/29/ep_65/1080p.mp4',1),
-- content 30 (Arcane): 4K, 1080p — ep_id 66–67
(30, 66, '4K',    '/media/shows/30/ep_66/4K.mp4',   1),
(30, 66, '1080p', '/media/shows/30/ep_66/1080p.mp4',1),
(30, 67, '4K',    '/media/shows/30/ep_67/4K.mp4',   1),
(30, 67, '1080p', '/media/shows/30/ep_67/1080p.mp4',1),
-- content 31 (Severance): 4K, 1080p — ep_id 68–71
(31, 68, '4K',    '/media/shows/31/ep_68/4K.mp4',   1),
(31, 68, '1080p', '/media/shows/31/ep_68/1080p.mp4',1),
(31, 69, '4K',    '/media/shows/31/ep_69/4K.mp4',   1),
(31, 69, '1080p', '/media/shows/31/ep_69/1080p.mp4',1),
(31, 70, '4K',    '/media/shows/31/ep_70/4K.mp4',   1),
(31, 70, '1080p', '/media/shows/31/ep_70/1080p.mp4',1),
(31, 71, '4K',    '/media/shows/31/ep_71/4K.mp4',   1),
(31, 71, '1080p', '/media/shows/31/ep_71/1080p.mp4',1),
-- content 35 (The Bear): 4K, 1080p — ep_id 72–75
(35, 72, '4K',    '/media/shows/35/ep_72/4K.mp4',   1),
(35, 72, '1080p', '/media/shows/35/ep_72/1080p.mp4',1),
(35, 73, '4K',    '/media/shows/35/ep_73/4K.mp4',   1),
(35, 73, '1080p', '/media/shows/35/ep_73/1080p.mp4',1),
(35, 74, '4K',    '/media/shows/35/ep_74/4K.mp4',   1),
(35, 74, '1080p', '/media/shows/35/ep_74/1080p.mp4',1),
(35, 75, '4K',    '/media/shows/35/ep_75/4K.mp4',   1),
(35, 75, '1080p', '/media/shows/35/ep_75/1080p.mp4',1);


-- ══════════════════════════════════════════════════════════════════════
-- 8. CONTENT DETAILS — genres, languages, roles
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO content_genre (content_id, genre_id) VALUES
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

INSERT INTO content_language (content_id, language_id, lang_type) VALUES
(1,  1, 'Audio'),  (1,  2, 'Subtitle'), (1,  6, 'Subtitle'), (1,  7, 'Subtitle'),
(2,  3, 'Audio'),  (2,  1, 'Subtitle'), (2,  2, 'Subtitle'),
(3,  1, 'Audio'),  (3,  2, 'Subtitle'), (3,  4, 'Subtitle'),
(4,  1, 'Audio'),  (4,  2, 'Subtitle'), (4,  6, 'Subtitle'),
(5,  3, 'Audio'),  (5,  1, 'Subtitle'), (5,  2, 'Subtitle'), (5,  4, 'Subtitle'),
(6,  1, 'Audio'),  (6,  2, 'Subtitle'), (6,  4, 'Subtitle'),
(7,  3, 'Audio'),  (7,  1, 'Subtitle'), (7,  2, 'Subtitle'), (7,  5, 'Subtitle'),
(8,  1, 'Audio'),  (8,  3, 'Subtitle'), (8,  6, 'Subtitle'), (8,  4, 'Subtitle'),
(9,  3, 'Audio'),  (9,  2, 'Subtitle'), (9,  1, 'Subtitle'),
(10, 1, 'Audio'),  (10, 1, 'Subtitle'), (10, 2, 'Subtitle'),
(11, 5, 'Audio'),  (11, 1, 'Subtitle'), (11, 2, 'Subtitle'), (11, 8, 'Subtitle'),
(12, 1, 'Audio'),  (12, 2, 'Subtitle'), (12, 4, 'Subtitle'),
(13, 1, 'Audio'),  (13, 2, 'Subtitle'), (13, 7, 'Subtitle'),
(14, 1, 'Audio'),  (14, 2, 'Subtitle'), (14, 4, 'Subtitle'),
(15, 3, 'Audio'),  (15, 1, 'Subtitle'), (15, 2, 'Subtitle'),
(16, 1, 'Audio'),  (16, 2, 'Subtitle'), (16, 4, 'Subtitle'),
(17, 1, 'Audio'),  (17, 2, 'Subtitle'), (17, 4, 'Subtitle'), (17, 6, 'Subtitle'),
(18, 1, 'Audio'),  (18, 2, 'Subtitle'), (18, 9, 'Subtitle'),
(19, 3, 'Audio'),  (19, 1, 'Subtitle'), (19, 2, 'Subtitle'),
(20, 1, 'Audio'),  (20, 2, 'Subtitle'), (20, 10, 'Subtitle'),
(21, 3, 'Audio'),  (21, 1, 'Subtitle'), (21, 2, 'Subtitle'),
(22, 3, 'Audio'),  (22, 1, 'Subtitle'), (22, 2, 'Subtitle'),
(23, 3, 'Audio'),  (23, 1, 'Subtitle'), (23, 2, 'Subtitle'),
(24, 3, 'Audio'),  (24, 1, 'Subtitle'), (24, 2, 'Subtitle'),
(25, 1, 'Audio'),  (25, 2, 'Subtitle'), (25, 6, 'Subtitle'), (25, 4, 'Subtitle'),
(26, 1, 'Audio'),  (26, 2, 'Subtitle'), (26, 7, 'Subtitle'),
(27, 1, 'Audio'),  (27, 6, 'Subtitle'), (27, 7, 'Subtitle'),
(28, 1, 'Audio'),  (28, 2, 'Subtitle'), (28, 4, 'Subtitle'),
(29, 5, 'Audio'),  (29, 1, 'Subtitle'), (29, 2, 'Subtitle'), (29, 3, 'Subtitle'),
(30, 1, 'Audio'),  (30, 6, 'Subtitle'), (30, 2, 'Subtitle'),
(31, 1, 'Audio'),  (31, 2, 'Subtitle'), (31, 4, 'Subtitle'),
(32, 1, 'Audio'),  (32, 2, 'Subtitle'), (32, 6, 'Subtitle'),
(33, 3, 'Audio'),  (33, 1, 'Subtitle'), (33, 2, 'Subtitle'),
(34, 1, 'Audio'),  (34, 2, 'Subtitle'), (34, 9, 'Subtitle'),
(35, 1, 'Audio'),  (35, 2, 'Subtitle'), (35, 4, 'Subtitle');

-- NOTE: content_role PK is (content_id, person_id) — one role per person per title.
-- Fixes applied vs. the original seed:
--   • Removed (20, 18, 'Director', NULL): Wes Anderson did NOT direct Chernobyl.
--   • Changed character for (8, 9) from 'Stilgar' to 'Duncan Idaho':
--     Pedro Pascal played Duncan Idaho in Dune (2021), not Stilgar.
INSERT INTO content_role (content_id, person_id, role_type, character_name) VALUES
(1,  1,  'Director', NULL),
(1,  7,  'Actor',    'Amelia Brand'),
(2,  2,  'Creator',  NULL),
(3,  3,  'Lead',     'Michael Scott'),
(5,  5,  'Creator',  NULL),
(6,  6,  'Lead',     'Walter White'),
(6,  25, 'Actor',    'Jesse Pinkman'),
(6,  26, 'Actor',    'Skyler White'),
(7,  15, 'Director', NULL),
(8,  14, 'Director', NULL),
(8,  31, 'Actor',    'Paul Atreides'),
(8,  9,  'Actor',    'Duncan Idaho'),   -- corrected from 'Stilgar'
(9,  11, 'Creator',  NULL),
(10, 9,  'Lead',     'Din Djarin'),
(11, 8,  'Director', NULL),
(12, 4,  'Actor',    'Joker'),
(12, 1,  'Director', NULL),
(17, 27, 'Actor',    'Eleven'),
(17, 28, 'Actor',    'Joyce Byers'),
(18, 29, 'Actor',    'Michael Corleone'),
(18, 30, 'Lead',     'Vito Corleone'),
(19, 16, 'Director', NULL),
-- (20, 18, 'Director', NULL) removed — Wes Anderson did not direct Chernobyl
(21, 21, 'Creator',  NULL),
(22, 22, 'Creator',  NULL),
(23, 23, 'Creator',  NULL),
(24, 24, 'Creator',  NULL),
(25, 14, 'Director', NULL),
(25, 31, 'Actor',    'Paul Atreides'),
(26, 1,  'Director', NULL),
(27, 18, 'Director', NULL),
(28, 12, 'Director', NULL),
(32, 14, 'Director', NULL),
(33, 16, 'Director', NULL),
(34, 13, 'Director', NULL);


-- ══════════════════════════════════════════════════════════════════════
-- 9. ACTIVITY — transactions, reviews, user_content, playlists
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO transaction_list (user_id, transaction_date, total_amount, payment_method) VALUES
(2,  '2021-03-10 20:15:00',  9.99,  'Credit Card'),   -- 1
(3,  '2022-05-20 11:30:00', 19.99,  'Credit Card'),   -- 2
(4,  '2021-08-01 18:45:00',  7.99,  'Debit Card'),    -- 3
(5,  '2021-10-05 09:00:00', 49.99,  'Credit Card'),   -- 4
(6,  '2021-09-14 14:22:00', 15.99,  'PayPal'),        -- 5
(7,  '2021-10-30 21:00:00', 12.99,  'Credit Card'),   -- 6
(8,  '2021-11-01 16:05:00', 29.99,  'Credit Card'),   -- 7
(9,  '2021-11-05 10:10:00', 14.99,  'Debit Card'),    -- 8
(10, '2022-01-07 08:30:00', 11.99,  'PayPal'),        -- 9
(11, '2022-02-14 19:45:00', 35.00,  'Credit Card'),   -- 10
(12, '2022-03-05 13:20:00', 19.99,  'Credit Card'),   -- 11
(13, '2022-04-11 17:55:00',  9.50,  'Apple Pay'),     -- 12
(14, '2022-06-19 22:10:00',  5.99,  'Debit Card'),    -- 13
(15, '2022-07-04 15:40:00', 11.99,  'Credit Card'),   -- 14
(16, '2022-09-01 09:05:00', 13.50,  'Google Pay'),    -- 15
(17, '2022-10-28 20:30:00', 25.00,  'Credit Card'),   -- 16
(18, '2022-11-15 11:00:00', 22.00,  'Credit Card'),   -- 17
(19, '2022-12-03 14:15:00', 18.00,  'PayPal'),        -- 18
(20, '2023-01-20 16:00:00', 15.00,  'Credit Card'),   -- 19
(2,  '2023-02-08 10:45:00', 10.00,  'Credit Card'),   -- 20
(21, '2023-03-12 19:00:00', 29.99,  'Debit Card'),    -- 21
(22, '2023-04-05 08:20:00', 24.99,  'Credit Card'),   -- 22
(23, '2023-05-19 13:45:00', 22.00,  'Apple Pay'),     -- 23
(24, '2023-06-30 21:10:00', 26.00,  'Credit Card'),   -- 24
(25, '2024-04-02 12:00:00', 16.99,  'Credit Card'),   -- 25
(26, '2023-09-14 17:30:00', 12.99,  'Google Pay'),    -- 26
(27, '2023-10-01 09:50:00',  8.99,  'Debit Card'),    -- 27
(28, '2023-11-11 22:22:00',  7.99,  'Credit Card'),   -- 28
(29, '2023-12-25 15:00:00', 18.00,  'Credit Card'),   -- 29
(30, '2024-01-08 11:11:00', 15.00,  'Credit Card'),   -- 30
(31, '2024-02-20 20:05:00', 14.99,  'Credit Card'),   -- 31
(32, '2024-03-15 07:45:00', 11.99,  'Apple Pay'),     -- 32
(33, '2024-04-28 18:30:00',  9.99,  'Debit Card'),    -- 33
(34, '2024-05-10 14:00:00',  8.50,  'Credit Card'),   -- 34
(35, '2024-06-03 10:20:00', 12.00,  'PayPal'),        -- 35
(36, '2024-07-22 16:40:00', 14.99,  'Credit Card'),   -- 36
(37, '2024-08-15 09:15:00',  9.99,  'Credit Card'),   -- 37
(38, '2024-09-30 19:55:00', 29.99,  'Debit Card'),    -- 38
(39, '2024-10-18 13:05:00', 35.00,  'Credit Card'),   -- 39
(40, '2024-11-29 21:30:00', 25.00,  'Credit Card');   -- 40

INSERT INTO transaction_detail (transaction_id, content_id, content_name, sold_price) VALUES
(1,  1,  'Interstellar',                       9.99),
(2,  2,  'Spy x Family',                      19.99),
(3,  4,  'Inception',                          7.99),
(4,  5,  'One Piece',                         49.99),
(5,  3,  'The Office',                        15.99),
(6,  7,  'Your Name',                         12.99),
(7,  6,  'Breaking Bad',                      29.99),
(8,  8,  'Dune',                              14.99),
(9,  13, 'Tenet',                             11.99),
(10, 9,  'Attack on Titan',                   35.00),
(11, 10, 'The Mandalorian',                   19.99),
(12, 11, 'Parasite',                           9.50),
(13, 12, 'The Dark Knight',                    5.99),
(14, 13, 'Tenet',                             11.99),
(15, 14, 'Everything Everywhere All at Once', 13.50),
(16, 15, 'Jujutsu Kaisen',                    25.00),
(17, 16, 'Better Call Saul',                  22.00),
(18, 17, 'Stranger Things',                   18.00),
(19, 18, 'The Godfather',                     15.00),
(20, 19, 'Spirited Away',                     10.00),
(21, 21, 'Naruto',                            29.99),
(22, 22, 'Dragon Ball Z',                     24.99),
(23, 23, 'Demon Slayer',                      22.00),
(24, 24, 'Fullmetal Alchemist: Brotherhood',  26.00),
(25, 25, 'Dune: Part Two',                    16.99),
(26, 26, 'Oppenheimer',                       12.99),
(27, 27, 'The Grand Budapest Hotel',           8.99),
(28, 28, 'Pulp Fiction',                       7.99),
(29, 29, 'Squid Game',                        18.00),
(30, 30, 'Arcane',                            15.00),
(31, 31, 'Severance',                         14.99),
(32, 32, 'Blade Runner 2049',                 11.99),
(33, 33, 'Princess Mononoke',                  9.99),
(34, 34, 'Goodfellas',                         8.50),
(35, 35, 'The Bear',                          12.00),
(36, 8,  'Dune',                              14.99),
(37, 1,  'Interstellar',                       9.99),
(38, 6,  'Breaking Bad',                      29.99),
(39, 9,  'Attack on Titan',                   35.00),
(40, 15, 'Jujutsu Kaisen',                    25.00);

-- post_status = 'published' for all reviews (visible to public)
INSERT INTO reviews (user_id, content_id, rating, comment_text, post_time, post_status) VALUES
(2,  1,  5.0, 'A masterpiece of visual storytelling.',                    '2021-03-17 22:10:00', 'published'),
(3,  2,  4.5, 'So cute and funny, Anya is adorable!',                     '2022-05-28 14:00:00', 'published'),
(4,  4,  4.8, 'Dreams within dreams — blew my mind.',                     '2021-08-10 19:30:00', 'published'),
(5,  5,  5.0, 'Legendary. The only show that keeps going and stays great.','2021-10-15 09:45:00', 'published'),
(6,  3,  4.2, 'Michael Scott is pure comedy gold.',                       '2021-09-25 20:00:00', 'published'),
(7,  7,  4.7, 'Beautiful and heartbreaking at the same time.',            '2021-11-12 17:20:00', 'published'),
(8,  6,  5.0, 'The best TV drama ever made.',                             '2021-11-20 21:55:00', 'published'),
(9,  8,  4.3, 'Epic world-building, stunning visuals.',                   '2021-11-19 10:30:00', 'published'),
(10, 13, 3.8, 'Wait... what direction did that bullet go?',               '2022-01-18 23:05:00', 'published'),
(11, 9,  4.9, 'Cried three times. No regrets.',                           '2022-02-28 18:40:00', 'published'),
(12, 10, 4.6, 'Baby Yoda alone is worth the price.',                      '2022-03-19 13:10:00', 'published'),
(13, 11, 4.8, 'Bong Joon-ho is a genius.',                               '2022-04-24 16:50:00', 'published'),
(14, 12, 5.0, 'Heath Ledger''s Joker is untouchable.',                    '2022-07-01 20:15:00', 'published'),
(15, 13, 3.5, 'Visually amazing but hard to follow.',                     '2022-07-22 11:00:00', 'published'),
(16, 14, 4.7, 'So wild, yet so emotionally resonant.',                    '2022-09-15 08:30:00', 'published'),
(17, 15, 4.5, 'The animation during Domain Expansions is insane.',        '2022-11-08 22:45:00', 'published'),
(18, 16, 4.9, 'Better than Breaking Bad? Dare I say yes.',                '2022-11-30 19:00:00', 'published'),
(19, 17, 4.4, 'Season 1 is flawless.',                                    '2022-12-20 14:25:00', 'published'),
(20, 18, 5.0, 'Leave the gun. Take the cannoli.',                         '2023-02-01 21:00:00', 'published'),
(2,  19, 4.9, 'Miyazaki''s greatest work.',                               '2023-02-20 16:30:00', 'published'),
(21, 21, 5.0, 'Believe it! Naruto is my all-time favourite.',             '2023-03-25 10:00:00', 'published'),
(22, 22, 4.8, 'Over 9000/10. Timeless classic.',                          '2023-04-18 07:30:00', 'published'),
(23, 23, 4.9, 'The Mugen Train arc made me sob.',                         '2023-06-01 20:10:00', 'published'),
(24, 24, 5.0, 'Brotherhood is peak anime storytelling.',                  '2023-07-14 15:55:00', 'published'),
(25, 25, 4.7, 'Denis did it again — Dune Part Two is a war epic.',        '2024-04-20 18:00:00', 'published'),
(26, 26, 4.9, 'Cillian Murphy deserved every award.',                     '2023-09-30 22:30:00', 'published'),
(27, 27, 4.5, 'Wes Anderson is in a league of his own.',                  '2023-10-15 12:40:00', 'published'),
(28, 28, 5.0, 'Cool, cool, cool. Tarantino''s magnum opus.',              '2023-11-25 20:00:00', 'published'),
(29, 29, 4.8, 'Red light green light will haunt me forever.',             '2024-01-05 09:15:00', 'published'),
(30, 30, 5.0, 'The animation quality is absolutely stunning.',            '2024-01-22 17:45:00', 'published'),
(31, 31, 4.6, 'The most unsettling office drama since The Office.',       '2024-03-04 11:30:00', 'published'),
(32, 32, 4.4, 'Atmospheric and visually breathtaking.',                   '2024-03-28 14:00:00', 'published'),
(33, 33, 4.8, 'San and Ashitaka''s story is timeless.',                   '2024-05-09 19:20:00', 'published'),
(34, 34, 4.7, 'Scorsese at his most electrifying.',                       '2024-05-24 21:10:00', 'published'),
(35, 35, 4.9, 'The kitchen chaos is so real it gives me anxiety.',        '2024-06-18 08:50:00', 'published'),
(36, 8,  4.3, 'Dune is a slow burn done perfectly.',                      '2024-08-05 16:00:00', 'published'),
(37, 1,  4.8, 'Interstellar made me call my dad.',                        '2024-08-29 20:30:00', 'published'),
(38, 6,  5.0, 'Mr. White... I am the danger.',                            '2024-10-14 13:45:00', 'published'),
(39, 9,  4.9, 'Season 3 of AoT broke me completely.',                     '2024-11-02 22:00:00', 'published'),
(40, 15, 4.6, 'Gojo Satoru is the most iconic character in anime.',       '2024-12-10 18:20:00', 'published');

-- watch_status: 'Finished' for content the user has reviewed; otherwise 'Unfinished' or 'Unwatched'.
-- last_watch:   set to review post_time for 'Finished' entries; NULL for 'Unwatched'.
INSERT INTO user_content (user_id, content_id, last_watch, watch_status) VALUES
-- primary purchases / reviews
(2,  1,  '2021-03-17 22:10:00', 'Finished'),
(3,  2,  '2022-05-28 14:00:00', 'Finished'),
(4,  4,  '2021-08-10 19:30:00', 'Finished'),
(5,  5,  '2021-10-15 09:45:00', 'Finished'),
(6,  3,  '2021-09-25 20:00:00', 'Finished'),
(7,  7,  '2021-11-12 17:20:00', 'Finished'),
(8,  6,  '2021-11-20 21:55:00', 'Finished'),
(9,  8,  '2021-11-19 10:30:00', 'Finished'),
(10, 13, '2022-01-18 23:05:00', 'Finished'),
(11, 9,  '2022-02-28 18:40:00', 'Finished'),
(12, 10, '2022-03-19 13:10:00', 'Finished'),
(13, 11, '2022-04-24 16:50:00', 'Finished'),
(14, 12, '2022-07-01 20:15:00', 'Finished'),
(15, 13, '2022-07-22 11:00:00', 'Finished'),
(16, 14, '2022-09-15 08:30:00', 'Finished'),
(17, 15, '2022-11-08 22:45:00', 'Finished'),
(18, 16, '2022-11-30 19:00:00', 'Finished'),
(19, 17, '2022-12-20 14:25:00', 'Finished'),
(20, 18, '2023-02-01 21:00:00', 'Finished'),
(2,  19, '2023-02-20 16:30:00', 'Finished'),
(21, 21, '2023-03-25 10:00:00', 'Finished'),
(22, 22, '2023-04-18 07:30:00', 'Finished'),
(23, 23, '2023-06-01 20:10:00', 'Finished'),
(24, 24, '2023-07-14 15:55:00', 'Finished'),
(25, 25, '2024-04-20 18:00:00', 'Finished'),
(26, 26, '2023-09-30 22:30:00', 'Finished'),
(27, 27, '2023-10-15 12:40:00', 'Finished'),
(28, 28, '2023-11-25 20:00:00', 'Finished'),
(29, 29, '2024-01-05 09:15:00', 'Finished'),
(30, 30, '2024-01-22 17:45:00', 'Finished'),
(31, 31, '2024-03-04 11:30:00', 'Finished'),
(32, 32, '2024-03-28 14:00:00', 'Finished'),
(33, 33, '2024-05-09 19:20:00', 'Finished'),
(34, 34, '2024-05-24 21:10:00', 'Finished'),
(35, 35, '2024-06-18 08:50:00', 'Finished'),
(36, 8,  '2024-08-05 16:00:00', 'Finished'),
(37, 1,  '2024-08-29 20:30:00', 'Finished'),
(38, 6,  '2024-10-14 13:45:00', 'Finished'),
(39, 9,  '2024-11-02 22:00:00', 'Finished'),
(40, 15, '2024-12-10 18:20:00', 'Finished'),
-- additional purchases without reviews
(2,  4,  '2021-08-09 10:00:00', 'Unfinished'),
(2,  8,  '2022-03-15 19:00:00', 'Unfinished'),
(2,  25, NULL,                  'Unwatched'),
(5,  21, NULL,                  'Unwatched'),
(5,  22, NULL,                  'Unwatched'),
(5,  23, NULL,                  'Unwatched'),
(8,  11, '2022-05-01 15:00:00', 'Finished'),
(8,  18, '2023-01-15 20:00:00', 'Finished'),
(8,  34, '2024-05-01 18:00:00', 'Unfinished'),
(17, 17, NULL,                  'Unwatched'),
(17, 29, '2024-01-20 20:00:00', 'Unfinished'),
(17, 31, '2024-02-10 21:00:00', 'Unfinished'),
(4,  14, NULL,                  'Unwatched'),
(4,  27, NULL,                  'Unwatched');

-- visibility: 'public' for shared playlists, 'private' for personal ones
INSERT INTO playlist (playlist_id, user_id, playlist_name, create_date, visibility) VALUES
(1, 2,  'Sci-Fi Favourites',  '2021-04-15 18:00:00', 'public'),
(2, 2,  'Anime Watchlist',    '2021-07-20 21:30:00', 'public'),
(1, 4,  'Mind-Bending Films', '2021-08-25 15:45:00', 'private'),
(1, 6,  'Comedy Night',       '2021-10-03 20:10:00', 'public'),
(3, 2,  'Nolan Universe',     '2022-01-01 00:01:00', 'public'),
(1, 5,  'Pirate & Adventure', '2021-11-14 19:00:00', 'public'),
(1, 8,  'Prestige Drama',     '2022-02-28 14:30:00', 'public'),
(1, 17, 'Thriller & Horror',  '2022-10-31 22:00:00', 'private'),
(1, 21, 'Anime Classics',     '2023-04-10 11:20:00', 'public'),
(2, 21, 'Adventure Picks',    '2023-06-18 16:45:00', 'public'),
(1, 29, 'K-Drama & K-Film',   '2024-01-15 09:00:00', 'public'),
(1, 35, 'Chef''s Table Picks','2024-07-01 12:00:00', 'private');

INSERT INTO playlist_item (playlist_id, user_id, content_id, add_date) VALUES
(1, 2, 1,  '2021-04-15 18:05:00'),
(1, 2, 4,  '2021-08-05 10:30:00'),
(1, 2, 8,  '2021-11-10 19:00:00'),
(1, 2, 25, '2024-03-10 14:00:00'),
(1, 2, 32, '2024-04-01 20:00:00'),
(1, 2, 31, '2024-03-01 11:30:00'),
(2, 2, 2,  '2022-05-25 20:00:00'),
(2, 2, 9,  '2022-03-01 17:45:00'),
(2, 2, 15, '2022-11-10 22:00:00'),
(2, 2, 19, '2023-02-22 13:15:00'),
(3, 2, 1,  '2022-01-01 00:05:00'),
(3, 2, 4,  '2022-01-01 00:10:00'),
(3, 2, 12, '2022-01-02 09:00:00'),
(3, 2, 13, '2022-01-03 11:30:00'),
(1, 4, 4,  '2021-08-25 15:50:00'),
(1, 4, 14, '2022-10-01 18:00:00'),
(1, 4, 13, '2022-09-01 21:00:00'),
(1, 6, 3,  '2021-10-03 20:15:00'),
(1, 5, 5,  '2021-11-14 19:10:00'),
(1, 5, 8,  '2021-12-05 20:30:00'),
(1, 5, 21, '2023-03-20 10:00:00'),
(1, 5, 22, '2023-04-10 15:00:00'),
(1, 8, 6,  '2022-02-28 14:35:00'),
(1, 8, 11, '2022-04-15 16:00:00'),
(1, 8, 18, '2022-06-10 19:30:00'),
(1, 8, 34, '2024-06-01 21:00:00'),
(1, 17, 17, '2022-10-31 22:05:00'),
(1, 17, 29, '2022-11-20 20:00:00'),
(1, 17, 31, '2024-02-25 19:30:00'),
(1, 21, 21, '2023-04-10 11:25:00'),
(1, 21, 22, '2023-04-10 11:30:00'),
(1, 21, 23, '2023-06-05 18:00:00'),
(1, 21, 24, '2023-07-20 14:30:00'),
(1, 21, 5,  '2023-08-01 09:00:00'),
(1, 21, 9,  '2023-09-15 20:45:00'),
(2, 21, 8,  '2023-06-18 16:50:00'),
(2, 21, 10, '2023-07-02 10:00:00'),
(1, 29, 11, '2024-01-15 09:10:00'),
(1, 29, 29, '2024-01-28 21:30:00'),
(1, 35, 35, '2024-07-01 12:05:00');
