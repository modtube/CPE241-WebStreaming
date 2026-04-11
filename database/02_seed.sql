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
--     content_resource, content_role
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
INSERT INTO country (country_name, country_code, primary_timezone_id) VALUES -- country_code must be the ISO format
('Thailand',       'TH', 2),
('China',          'CN', 4),
('Germany',        'DE', 6),
('Japan',          'JP', 3),
('United States',  'US', 9),
('South Korea',    'KR', 5),
('France',         'FR', 8),
('United Kingdom', 'GB', 7),
('Australia',      'AU', 12),
('Brazil',         'BR', 14),
('Mexico',         'MX', 15),
('New Zealand',    'NZ', 13),
('Canada',         'CA', 10),
('Spain',          'ES', 8),
('Italy',          'IT', 8);


-- ══════════════════════════════════════════════════════════════════════
-- 3. TABLES THAT DEPEND ON country
-- ══════════════════════════════════════════════════════════════════════

-- ── membership_tier ──────────────────────────────────────────────────
INSERT INTO membership_tier (tier_name, monthly_price, discount_rate, duration_days, description) VALUES
('free',    0.00, 0.00,  0,  'Basic access with limited content and standard quality'),
('premium', 9.99, 0.20, 30, 'Full access to all content with 4K streaming'),
('admin',   0.00, 0.00,  0,  'System administrator with full platform management access');

-- ── app_user ──────────────────────────────────────────────────────────
-- NOTE: app_user must be inserted before person, because person.create_by
--       references app_user(user_id).
INSERT INTO app_user (username, email, img_path, user_password, register_date, country_id, tier_id, user_status, user_role) VALUES
('Wirachat_Admin',   'wirachat.thon@kmutt.ac.th',   NULL, 'safe123',       '2021-01-15 09:00:00',  1,  3,    'active', 'admin'),   -- 1
('GenshinLover',     'traveler@teyvat.com',         NULL, 'paimon',        '2021-02-03 14:22:11',  2,  2,  'active', 'customer'),   -- 2
('Anya_Fans',        'wakuwaku@spy.com',            NULL, 'peanuts',       '2021-03-18 08:45:30',  3,  1,     'active', 'customer'),   -- 3
('Luffy_Pirate',     'luffy@grandline.com',         NULL, 'meat',          '2021-05-07 20:10:05',  4,  2,  'active', 'customer'),   -- 4
('Zoro_Lost',        'zoro@swords.com',             NULL, 'bushido',       '2021-06-14 11:33:47',  4,  1,     'active', 'customer'),   -- 5
('Nami_Money',       'nami@berries.com',            NULL, 'gold',          '2021-07-29 16:55:22',  4,  2,  'active', 'customer'),   -- 6
('Sanji_Cook',       'sanji@allblue.com',           NULL, 'mellorine',     '2021-08-05 07:12:59',  4,  1,     'active', 'customer'),   -- 7
('Robin_History',    'robin@ohara.com',             NULL, 'archaeology',   '2021-09-20 13:40:00',  4,  2,  'active', 'customer'),   -- 8
('Chopper_Doc',      'chopper@drum.com',            NULL, 'candy',         '2021-10-11 19:08:34',  4,  1,     'active', 'customer'),   -- 9
('Franky_Super',     'franky@water7.com',           NULL, 'cola',          '2021-11-28 10:27:16',  4,  2,  'active', 'customer'),   -- 10
('Brook_Soul',       'brook@soul.com',              NULL, 'laboon',        '2022-01-04 22:15:50',  4,  1,     'active', 'customer'),   -- 11
('Jimbei_Fish',      'jimbei@sea.com',              NULL, 'karate',        '2022-02-17 09:03:41',  4,  2,  'active', 'customer'),   -- 12
('Usopp_Sniper',     'usopp@brave.com',             NULL, 'popgreen',      '2022-03-30 15:49:07',  4,  1,     'active', 'customer'),   -- 13
('Law_Heart',        'law@op.com',                  NULL, 'shambles',      '2022-05-12 18:22:33', 14,  2,  'active', 'customer'),   -- 14
('Kid_Metal',        'kid@punk.com',                NULL, 'magnet',        '2022-06-08 06:57:44',  9,  1,     'active', 'customer'),   -- 15
('Hancock_Love',     'hancock@kuja.com',            NULL, 'salome',        '2022-08-01 12:34:19',  6,  2,  'active', 'customer'),   -- 16
('Ace_Fire',         'ace@spade.com',               NULL, 'meramera',      '2022-09-23 21:05:02', 10,  1,     'suspended',  'customer'),-- 17
('Sabo_Dragon',      'sabo@rev.com',                NULL, 'dragonclaw',    '2022-10-16 17:48:55', 10,  2,  'active', 'customer'),   -- 18
('Whitebeard_Goat', 'newgate@yonko.com',            NULL, 'guranogura',    '2022-11-20 12:00:00',  4,  2,  'active', 'customer'), -- 19
('Shanks_Red',       'shanks@yonko.com',            NULL, 'haki',          '2022-12-25 23:59:00', 15,  2,  'active', 'customer'),   -- 20
('Naruto_Uzumaki',   'naruto@konoha.com',           NULL, 'dattebayo',     '2023-01-09 10:14:37',  4,  2,  'active', 'customer'),   -- 21
('Sasuke_Uchiha',    'sasuke@avenger.com',          NULL, 'chidori',       '2023-02-14 14:00:00',  4,  1,     'active', 'customer'),   -- 22
('Sakura_Haruno',    'sakura@medic.com',            NULL, 'shannaro',      '2023-03-22 09:30:15',  4,  2,  'active', 'customer'),   -- 23
('Kakashi_Sensei',   'kakashi@sharingan.com',       NULL, 'copycat',       '2023-04-01 00:00:01',  4,  1,     'active', 'customer'),   -- 24
('Itachi_Crow',      'itachi@akatsuki.com',         NULL, 'tsukuyomi',     '2023-05-18 03:33:33',  4,  2,  'active', 'customer'),   -- 25
('Goku_Saiyan',      'goku@capsule.com',            NULL, 'kamehameha',    '2023-06-29 12:00:00',  5,  1,     'active', 'customer'),   -- 26
('Vegeta_Prince',    'vegeta@saiyan.com',           NULL, 'finalflash',    '2023-07-04 08:08:08',  5,  2,  'active', 'customer'),   -- 27
('Bulma_Genius',     'bulma@brief.com',             NULL, 'dragonball',    '2023-08-15 16:45:20',  5,  1,     'active', 'customer'),   -- 28
('Tanjiro_Blade',    'tanjiro@hashira.com',         NULL, 'hinokami',      '2023-09-03 11:22:44',  4,  2,  'active', 'customer'),   -- 29
('Nezuko_Box',       'nezuko@demon.com',            NULL, 'bamboo',        '2023-10-10 19:55:10',  4,  1,     'active', 'customer'),   -- 30
('Edward_Elric',     'edward@alchemy.com',          NULL, 'equivalent',    '2024-01-07 08:00:00',  3,  2,  'active', 'customer'),   -- 31
('Roy_Mustang',      'roy@flame.com',               NULL, 'colonel',       '2024-02-14 09:14:59',  3,  1,     'active', 'customer'),   -- 32
('Mikasa_Ackerman',  'mikasa@survey.com',           NULL, 'scarf',         '2024-03-05 07:30:00',  3,  2,  'active', 'customer'),   -- 33
('Armin_Strategist', 'armin@brain.com',             NULL, 'colossal',      '2024-04-18 13:13:13',  3,  1,     'active', 'customer'),   -- 34
('Levi_Captain',     'levi@clean.com',              NULL, 'HumanitysBest', '2024-05-01 05:00:00',  3,  2,  'active', 'customer'),   -- 35
('Sasha_Potato',     'sasha@potato.com',            NULL, 'potatoes',      '2024-06-20 12:30:00',  3,  1,     'active', 'customer'),   -- 36
('Historia_Queen',   'historia@wall.com',           NULL, 'reiss',         '2024-07-14 18:00:00',  3,  2,  'active', 'customer'),   -- 37
('Erwin_Smith',      'erwin@commander.com',         NULL, 'chargefwd',     '2024-08-09 06:45:00',  3,  1,     'active', 'customer'),   -- 38
('Hange_Zoe',        'hange@titan.com',             NULL, 'experiment',    '2024-09-27 20:20:20',  3,  2,  'active', 'customer'),   -- 39
('Reiner_Armor',     'reiner@warrior.com',          NULL, 'bertholt',      '2024-11-11 11:11:11',  3,  1,     'active', 'customer');   -- 40


-- ══════════════════════════════════════════════════════════════════════
-- 4. TABLES THAT DEPEND ON app_user
-- ══════════════════════════════════════════════════════════════════════

-- ── person (create_by = 1 refers to Wirachat_Admin) ──────────────────
-- We use OVERRIDING SYSTEM VALUE so we can keep the IDs 1-35 consistent 
-- with your content_role table.

INSERT INTO person (person_id, first_name, middle_name, last_name, nationality, birth_date, birth_place, biography, create_by) 
OVERRIDING SYSTEM VALUE VALUES
(1,  'Christopher', NULL,    'Nolan',      'British',    '1970-07-30', 'London, UK', 'Visionary director known for non-linear storytelling and epics like Interstellar.', 1),
(2,  'Tatsuya',     NULL,    'Endo',       'Japanese',   '1980-07-23', 'Ibaraki, Japan', 'Manga artist and creator of the global hit series Spy x Family.', 1),
(3,  'Steve',       NULL,    'Carell',     'American',   '1962-08-16', 'Concord, MA, USA', 'Award-winning comedic actor famous for portraying Michael Scott in The Office.', 1),
(4,  'Heath',       NULL,    'Ledger',     'Australian', '1979-04-04', 'Perth, Australia', 'Acclaimed actor known for his legendary performance as The Joker.', 1),
(5,  'Eiichiro',    NULL,    'Oda',        'Japanese',   '1975-01-01', 'Kumamoto, Japan', 'World-renowned manga artist and creator of the long-running One Piece.', 1),
(6,  'Bryan',       NULL,    'Cranston',   'American',   '1956-03-07', 'Hollywood, CA, USA', 'Critically acclaimed actor famous for playing Walter White in Breaking Bad.', 1),
(7,  'Zendaya',     NULL,    'Coleman',    'American',   '1996-09-01', 'Oakland, CA, USA', 'Versatile actress and singer known for Euphoria and Dune.', 1),
(8,  'Bong',        NULL,    'Joon-ho',    'Korean',     '1969-09-14', 'Daegu, South Korea', 'Director of the Oscar-winning film Parasite.', 1),
(9,  'Pedro',       NULL,    'Pascal',     'Chilean',    '1975-04-02', 'Santiago, Chile', 'Leading actor in The Mandalorian and The Last of Us.', 1),
(10, 'Michelle',    NULL,    'Yeoh',       'Malaysian',  '1962-08-06', 'Ipoh, Malaysia', 'First Asian woman to win an Oscar for Best Actress.', 1),
(11, 'Hajime',      NULL,    'Isayama',    'Japanese',   '1986-08-29', 'Oyama, Japan', 'Manga artist famous for creating the dark fantasy series Attack on Titan.', 1),
(12, 'Quentin',     NULL,    'Tarantino',  'American',   '1963-03-27', 'Knoxville, TN, USA', 'Director known for stylized violence and sharp dialogue in Pulp Fiction.', 1),
(13, 'Martin',      NULL,    'Scorsese',   'American',   '1942-11-17', 'Queens, NY, USA', 'Legendary director focused on crime and religious themes.', 1),
(14, 'Denis',       NULL,    'Villeneuve', 'Canadian',   '1967-10-03', 'Gentilly, Canada', 'Visionary director of sci-fi films like Dune and Blade Runner 2049.', 1),
(15, 'Makoto',      NULL,    'Shinkai',    'Japanese',   '1973-02-09', 'Koumi, Japan', 'Director of beautiful anime films including Your Name.', 1),
(16, 'Hayao',       NULL,    'Miyazaki',   'Japanese',   '1941-01-05', 'Tokyo, Japan', 'Co-founder of Studio Ghibli and legendary animator.', 1),
(17, 'Greta',       NULL,    'Gerwig',     'American',   '1983-08-04', 'Sacramento, CA, USA', 'Director of Lady Bird, Little Women, and Barbie.', 1),
(18, 'Wes',         NULL,    'Anderson',   'American',   '1969-05-01', 'Houston, TX, USA', 'Director known for his unique visual and narrative styles.', 1),
(19, 'Guillermo',   NULL,    'del Toro',   'Mexican',    '1964-10-09', 'Guadalajara, Mexico', 'Famed director of dark fantasy and horror films.', 1),
(20, 'Taika',       NULL,    'Waititi',    'New Zealand','1975-08-16', 'Raukokore, NZ', 'Quirky director known for Hunt for the Wilderpeople and Thor: Ragnarok.', 1),
(21, 'Masashi',     NULL,    'Kishimoto',  'Japanese',   '1974-11-08', 'Nagi, Japan', 'Manga artist and creator of the massive Naruto series.', 1),
(22, 'Akira',       NULL,    'Toriyama',   'Japanese',   '1955-05-05', 'Nagoya, Japan', 'Legendary creator of Dragon Ball and character designer for Chrono Trigger.', 1),
(23, 'Koyoharu',    NULL,    'Gotouge',    'Japanese',   '1989-05-05', 'Fukuoka, Japan', 'The mysterious author behind the hit Demon Slayer series.', 1),
(24, 'Hiromu',      NULL,    'Arakawa',    'Japanese',   '1973-05-08', 'Makubetsu, Japan', 'Creator of the critically acclaimed Fullmetal Alchemist.', 1),
(25, 'Aaron',       NULL,    'Paul',       'American',   '1979-08-27', 'Emmett, ID, USA', 'Best known for playing Jesse Pinkman in Breaking Bad.', 1),
(26, 'Anna',        NULL,    'Gunn',       'American',   '1968-08-11', 'Cleveland, OH, USA', 'Emmy-winning actress who played Skyler White in Breaking Bad.', 1),
(27, 'Millie',      'Bobby', 'Brown',      'British',    '2004-02-19', 'Marbella, Spain', 'Breakout star of Stranger Things and Enola Holmes.', 1),
(28, 'Winona',      NULL,    'Ryder',      'American',   '1971-10-29', 'Winona, MN, USA', 'Iconic actress known for Beetlejuice and Stranger Things.', 1),
(29, 'Al',          NULL,    'Pacino',     'American',   '1940-04-25', 'Manhattan, NY, USA', 'Acting legend famous for The Godfather and Scarface.', 1),
(30, 'Marlon',      NULL,    'Brando',     'American',   '1924-04-03', 'Omaha, NE, USA', 'Considered one of the greatest actors of all time.', 1),
(31, 'Timothée',    NULL,    'Chalamet',   'American',   '1995-12-27', 'Manhattan, NY, USA', 'Rising star known for Call Me by Your Name and Dune.', 1),
(32, 'Zoe',         NULL,    'Saldaña',    'American',   '1978-06-19', 'Passaic, NJ, USA', 'Star of the three highest-grossing films of all time.', 1),
(33, 'Ryan',        NULL,    'Gosling',    'Canadian',   '1980-11-12', 'London, Canada', 'Known for Drive, La La Land, and Barbie.', 1),
(34, 'Cate',        NULL,    'Blanchett',  'Australian', '1969-05-14', 'Melbourne, Australia', 'Award-winning actress known for Tár and Carol.', 1),
(35, 'Tom',         NULL,    'Hanks',      'American',   '1956-07-09', 'Concord, CA, USA', 'Beloved actor famous for Forrest Gump and Toy Story.', 1);

-- ══════════════════════════════════════════════════════════════════════
-- 5. CONTENT
-- ══════════════════════════════════════════════════════════════════════

-- update_by = 1 (Wirachat_Admin) for all content entries
INSERT INTO content (title, content_description, release_date, price, content_type, rating_id, country_id, update_by) VALUES
('Interstellar',                     'Space exploration.',                          '2014-11-07',  9.99,  'Movie',    3,  8,  1),  -- 1
('Spy x Family',                     'Spy family.',                                 '2022-04-09',  19.99, 'TV Show',  3,  4,  1),  -- 2
('The Office',                       'Paper company.',                              '2005-03-24',  24.99, 'TV Show',  4,  5,  1),  -- 3
('Inception',                        'Dream heist.',                                '2010-07-16',  7.99,  'Movie',    3,  8,  1),  -- 4
('One Piece',                        'Pirate treasure.',                            '1999-10-20',  49.99, 'TV Show',  3,  4,  1),  -- 5
('Breaking Bad',                     'Chemistry teacher.',                          '2008-01-20',  29.99, 'TV Show',  6,  5,  1),  -- 6
('Your Name',                        'Star-crossed swap.',                          '2016-08-26',  12.99, 'Movie',    3,  4,  1),  -- 7
('Dune',                             'Spice wars.',                                 '2021-10-22',  14.99, 'Movie',    3, 13,  1),  -- 8
('Attack on Titan',                  'Giant war.',                                  '2013-04-07',  35.00, 'TV Show',  4,  4,  1),  -- 9
('The Mandalorian',                  'Bounty hunter.',                              '2019-11-12',  19.99, 'TV Show',  4,  5,  1),  -- 10
('Parasite',                         'Class struggle.',                             '2019-05-30',  9.50,  'Movie',    5,  6,  1),  -- 11
('The Dark Knight',                  'Gotham hero.',                                '2008-07-18',  5.99,  'Movie',    5,  8,  1),  -- 12
('Tenet',                            'Reverse time.',                               '2020-08-26',  11.99, 'Movie',    5,  8,  1),  -- 13
('Everything Everywhere All at Once','Multiverse.',                                 '2022-03-25',  13.50, 'Movie',    3,  5,  1),  -- 14
('Jujutsu Kaisen',                   'Curse hunters.',                              '2020-10-03',  25.00, 'TV Show',  4,  4,  1),  -- 15
('Better Call Saul',                 'Criminal lawyer.',                            '2015-02-08',  22.00, 'TV Show',  6,  5,  1),  -- 16
('Stranger Things',                  'Mysterious girl.',                            '2016-07-15',  18.00, 'TV Show',  4,  5,  1),  -- 17
('The Godfather',                    'Crime family.',                               '1972-03-24',  15.00, 'Movie',    5,  5,  1),  -- 18
('Spirited Away',                    'Ghost world.',                                '2001-07-20',  10.00, 'Movie',    1,  4,  1),  -- 19
('Chernobyl',                        'Power plant.',                                '2019-05-06',  12.00, 'TV Show',  4,  8,  1),  -- 20
('Naruto',                           'Ninja who dreams of being Hokage.',           '2002-10-03',  29.99, 'TV Show',  2,  4,  1),  -- 21
('Dragon Ball Z',                    'Saiyan warriors protect Earth.',              '1989-04-26',  24.99, 'TV Show',  2,  4,  1),  -- 22
('Demon Slayer',                     'Tanjiro fights demons for Nezuko.',           '2019-04-06',  22.00, 'TV Show',  3,  4,  1),  -- 23
('Fullmetal Alchemist: Brotherhood', 'Brothers seek the Philosopher Stone.',       '2009-04-05',  26.00, 'TV Show',  3,  4,  1),  -- 24
('Dune: Part Two',                   'Paul leads the Fremen to war.',              '2024-03-01',  16.99, 'Movie',    5, 13,  1),  -- 25
('Oppenheimer',                      'Father of the atomic bomb.',                 '2023-07-21',  12.99, 'Movie',    3,  8,  1),  -- 26
('The Grand Budapest Hotel',         'Legendary concierge in a fading empire.',    '2014-03-07',  8.99,  'Movie',    3,  3,  1),  -- 27
('Pulp Fiction',                     'Interconnected crime stories in L.A.',       '1994-10-14',  7.99,  'Movie',    5,  5,  1),  -- 28
('Squid Game',                       'Desperate people compete in deadly games.',  '2021-09-17',  18.00, 'TV Show',  6,  6,  1),  -- 29
('Arcane',                           'The origins of Vi and Jinx.',                '2021-11-06',  15.00, 'TV Show',  3,  7,  1),  -- 30
('Severance',                        'Office workers with severed memories.',       '2022-02-18',  14.99, 'TV Show',  4,  5,  1),  -- 31
('Blade Runner 2049',                'A replicant hunter uncovers secrets.',        '2017-10-06',  11.99, 'Movie',    3, 13,  1),  -- 32
('Princess Mononoke',                'Humans clash with forest spirits.',           '1997-07-12',  9.99,  'Movie',    1,  4,  1),  -- 33
('Goodfellas',                       'Rise and fall of a mob associate.',           '1990-09-19',  8.50,  'Movie',    5,  5,  1),  -- 34
('The Bear',                         'A fine-dining chef runs a sandwich shop.',   '2022-06-23',  12.00, 'TV Show',  4,  5,  1);  -- 35


-- ══════════════════════════════════════════════════════════════════════
-- 6. CONTENT SUBCLASSES — movie, tv_show, season, episode
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO movie (content_id, curr_status, run_time) VALUES
(1, 'Released',  169),
(4, 'Released',  148),
(7, 'Released',  106),
(8, 'Released',  155),
(11, 'Released', 132),
(12, 'Released', 152),
(13, 'Released', 150),
(14, 'Released', 139),
(18, 'Released', 175),
(19, 'Released', 125),
(25, 'Released', 166),
(26, 'Released', 180),
(27, 'Released', 99),
(28, 'Released', 154),
(32, 'Released', 164),
(33, 'Released', 133),
(34, 'Released', 146);

INSERT INTO tv_show (content_id, curr_status) VALUES
(2,  'Airing'),
(3,  'Off'),
(5,  'Airing'),
(6,  'Off'),
(9,  'Off'),
(10, 'Airing'),
(15, 'Airing'),
(16, 'Off'),
(17, 'Airing'),
(20, 'Off'),
(21, 'Off'),
(22, 'Off'),
(23, 'Airing'),
(24, 'Off'),
(29, 'Airing'),
(30, 'Airing'),
(31, 'Airing'),
(35, 'Airing');

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
(1,  NULL, 'UHD',    '/media/movies/1/UHD.mp4',    1),
(1,  NULL, 'FHD', '/media/movies/1/FHD.mp4', 1),
(1,  NULL, 'HD',  '/media/movies/1/HD.mp4',  1),
-- content 4  (Inception): 4K, 1080p
(4,  NULL, 'UHD',    '/media/movies/4/UHD.mp4',    1),
(4,  NULL, 'FHD', '/media/movies/4/FHD.mp4', 1),
-- content 7  (Your Name): 1080p, 720p
(7,  NULL, 'FHD', '/media/movies/7/FHD.mp4', 1),
(7,  NULL, 'HD',  '/media/movies/7/HD.mp4',  1),
-- content 8  (Dune): 4K, 1080p, 720p
(8,  NULL, 'UHD',    '/media/movies/8/UHD.mp4',    1),
(8,  NULL, 'FHD', '/media/movies/8/FHD.mp4', 1),
(8,  NULL, 'HD',  '/media/movies/8/HD.mp4',  1),
-- content 11 (Parasite): 1080p
(11, NULL, 'FHD', '/media/movies/11/FHD.mp4',1),
-- content 12 (The Dark Knight): 4K, 1080p, 720p
(12, NULL, 'UHD',    '/media/movies/12/UHD.mp4',   1),
(12, NULL, 'FHD', '/media/movies/12/FHD.mp4',1),
(12, NULL, 'HD',  '/media/movies/12/HD.mp4', 1),
-- content 13 (Tenet): 4K, 1080p
(13, NULL, 'UHD',    '/media/movies/13/UHD.mp4',   1),
(13, NULL, 'FHD', '/media/movies/13/FHD.mp4',1),
-- content 14 (Everything Everywhere All at Once): 4K, 1080p
(14, NULL, 'UHD',    '/media/movies/14/UHD.mp4',   1),
(14, NULL, 'FHD', '/media/movies/14/FHD.mp4',1),
-- content 18 (The Godfather): 1080p, 720p
(18, NULL, 'FHD', '/media/movies/18/FHD.mp4',1),
(18, NULL, 'HD',  '/media/movies/18/HD.mp4', 1),
-- content 19 (Spirited Away): 1080p, 720p
(19, NULL, 'FHD', '/media/movies/19/FHD.mp4',1),
(19, NULL, 'HD',  '/media/movies/19/HD.mp4', 1),
-- content 25 (Dune: Part Two): 4K, 1080p, 720p
(25, NULL, 'UHD',    '/media/movies/25/UHD.mp4',   1),
(25, NULL, 'FHD', '/media/movies/25/FHD.mp4',1),
(25, NULL, 'HD',  '/media/movies/25/HD.mp4', 1),
-- content 26 (Oppenheimer): 4K, 1080p
(26, NULL, 'UHD',    '/media/movies/26/UHD.mp4',   1),
(26, NULL, 'FHD', '/media/movies/26/FHD.mp4',1),
-- content 27 (The Grand Budapest Hotel): 1080p, 720p
(27, NULL, 'FHD', '/media/movies/27/FHD.mp4',1),
(27, NULL, 'HD',  '/media/movies/27/HD.mp4', 1),
-- content 28 (Pulp Fiction): 1080p, 720p
(28, NULL, 'FHD', '/media/movies/28/FHD.mp4',1),
(28, NULL, 'HD',  '/media/movies/28/HD.mp4', 1),
-- content 32 (Blade Runner 2049): 4K, 1080p
(32, NULL, 'UHD',    '/media/movies/32/UHD.mp4',   1),
(32, NULL, 'FHD', '/media/movies/32/FHD.mp4',1),
-- content 33 (Princess Mononoke): 1080p, 720p
(33, NULL, 'FHD', '/media/movies/33/FHD.mp4',1),
(33, NULL, 'HD',  '/media/movies/33/HD.mp4', 1),
-- content 34 (Goodfellas): 1080p, 720p
(34, NULL, 'FHD', '/media/movies/34/FHD.mp4',1),
(34, NULL, 'HD',  '/media/movies/34/HD.mp4', 1),

-- ── TV Shows (one row per episode per quality) ────────────────────────
-- content 2 (Spy x Family): 1080p, 720p — ep_id 1–5
(2,  1, 'FHD', '/media/shows/2/ep_1/FHD.mp4',  1),
(2,  1, 'HD',  '/media/shows/2/ep_1/HD.mp4',   1),
(2,  2, 'FHD', '/media/shows/2/ep_2/FHD.mp4',  1),
(2,  2, 'HD',  '/media/shows/2/ep_2/HD.mp4',   1),
(2,  3, 'FHD', '/media/shows/2/ep_3/FHD.mp4',  1),
(2,  3, 'HD',  '/media/shows/2/ep_3/HD.mp4',   1),
(2,  4, 'FHD', '/media/shows/2/ep_4/FHD.mp4',  1),
(2,  4, 'HD',  '/media/shows/2/ep_4/HD.mp4',   1),
(2,  5, 'FHD', '/media/shows/2/ep_5/FHD.mp4',  1),
(2,  5, 'HD',  '/media/shows/2/ep_5/HD.mp4',   1),
-- content 3 (The Office): 720p only — ep_id 6–11
(3,  6,  'HD', '/media/shows/3/ep_6/HD.mp4',   1),
(3,  7,  'HD', '/media/shows/3/ep_7/HD.mp4',   1),
(3,  8,  'HD', '/media/shows/3/ep_8/HD.mp4',   1),
(3,  9,  'HD', '/media/shows/3/ep_9/HD.mp4',   1),
(3,  10, 'HD', '/media/shows/3/ep_10/HD.mp4',  1),
(3,  11, 'HD', '/media/shows/3/ep_11/HD.mp4',  1),
-- content 5 (One Piece): 1080p, 720p — ep_id 12–15
(5,  12, 'FHD', '/media/shows/5/ep_12/FHD.mp4',1),
(5,  12, 'HD',  '/media/shows/5/ep_12/HD.mp4', 1),
(5,  13, 'FHD', '/media/shows/5/ep_13/FHD.mp4',1),
(5,  13, 'HD',  '/media/shows/5/ep_13/HD.mp4', 1),
(5,  14, 'FHD', '/media/shows/5/ep_14/FHD.mp4',1),
(5,  14, 'HD',  '/media/shows/5/ep_14/HD.mp4', 1),
(5,  15, 'FHD', '/media/shows/5/ep_15/FHD.mp4',1),
(5,  15, 'HD',  '/media/shows/5/ep_15/HD.mp4', 1),
-- content 6 (Breaking Bad): 4K, 1080p — ep_id 16–21
(6,  16, 'UHD',    '/media/shows/6/ep_16/UHD.mp4',   1),
(6,  16, 'FHD', '/media/shows/6/ep_16/FHD.mp4',1),
(6,  17, 'UHD',    '/media/shows/6/ep_17/UHD.mp4',   1),
(6,  17, 'FHD', '/media/shows/6/ep_17/FHD.mp4',1),
(6,  18, 'UHD',    '/media/shows/6/ep_18/UHD.mp4',   1),
(6,  18, 'FHD', '/media/shows/6/ep_18/FHD.mp4',1),
(6,  19, 'UHD',    '/media/shows/6/ep_19/UHD.mp4',   1),
(6,  19, 'FHD', '/media/shows/6/ep_19/FHD.mp4',1),
(6,  20, 'UHD',    '/media/shows/6/ep_20/UHD.mp4',   1),
(6,  20, 'FHD', '/media/shows/6/ep_20/FHD.mp4',1),
(6,  21, 'UHD',    '/media/shows/6/ep_21/UHD.mp4',   1),
(6,  21, 'FHD', '/media/shows/6/ep_21/FHD.mp4',1),
-- content 9 (Attack on Titan): 1080p, 720p — ep_id 22–27
(9,  22, 'FHD', '/media/shows/9/ep_22/FHD.mp4',1),
(9,  22, 'HD',  '/media/shows/9/ep_22/HD.mp4', 1),
(9,  23, 'FHD', '/media/shows/9/ep_23/FHD.mp4',1),
(9,  23, 'HD',  '/media/shows/9/ep_23/HD.mp4', 1),
(9,  24, 'FHD', '/media/shows/9/ep_24/FHD.mp4',1),
(9,  24, 'HD',  '/media/shows/9/ep_24/HD.mp4', 1),
(9,  25, 'FHD', '/media/shows/9/ep_25/FHD.mp4',1),
(9,  25, 'HD',  '/media/shows/9/ep_25/HD.mp4', 1),
(9,  26, 'FHD', '/media/shows/9/ep_26/FHD.mp4',1),
(9,  26, 'HD',  '/media/shows/9/ep_26/HD.mp4', 1),
(9,  27, 'FHD', '/media/shows/9/ep_27/FHD.mp4',1),
(9,  27, 'HD',  '/media/shows/9/ep_27/HD.mp4', 1),
-- content 10 (The Mandalorian): 4K, 1080p — ep_id 28–31
(10, 28, 'UHD',    '/media/shows/10/ep_28/UHD.mp4',   1),
(10, 28, 'FHD', '/media/shows/10/ep_28/FHD.mp4',1),
(10, 29, 'UHD',    '/media/shows/10/ep_29/UHD.mp4',   1),
(10, 29, 'FHD', '/media/shows/10/ep_29/FHD.mp4',1),
(10, 30, 'UHD',    '/media/shows/10/ep_30/UHD.mp4',   1),
(10, 30, 'FHD', '/media/shows/10/ep_30/FHD.mp4',1),
(10, 31, 'UHD',    '/media/shows/10/ep_31/UHD.mp4',   1),
(10, 31, 'FHD', '/media/shows/10/ep_31/FHD.mp4',1),
-- content 15 (Jujutsu Kaisen): 1080p, 720p — ep_id 32–35
(15, 32, 'FHD', '/media/shows/15/ep_32/FHD.mp4',1),
(15, 32, 'HD',  '/media/shows/15/ep_32/HD.mp4', 1),
(15, 33, 'FHD', '/media/shows/15/ep_33/FHD.mp4',1),
(15, 33, 'HD',  '/media/shows/15/ep_33/HD.mp4', 1),
(15, 34, 'FHD', '/media/shows/15/ep_34/FHD.mp4',1),
(15, 34, 'HD',  '/media/shows/15/ep_34/HD.mp4', 1),
(15, 35, 'FHD', '/media/shows/15/ep_35/FHD.mp4',1),
(15, 35, 'HD',  '/media/shows/15/ep_35/HD.mp4', 1),
-- content 16 (Better Call Saul): 1080p, 720p — ep_id 36–39
(16, 36, 'FHD', '/media/shows/16/ep_36/FHD.mp4',1),
(16, 36, 'HD',  '/media/shows/16/ep_36/HD.mp4', 1),
(16, 37, 'FHD', '/media/shows/16/ep_37/FHD.mp4',1),
(16, 37, 'HD',  '/media/shows/16/ep_37/HD.mp4', 1),
(16, 38, 'FHD', '/media/shows/16/ep_38/FHD.mp4',1),
(16, 38, 'HD',  '/media/shows/16/ep_38/HD.mp4', 1),
(16, 39, 'FHD', '/media/shows/16/ep_39/FHD.mp4',1),
(16, 39, 'HD',  '/media/shows/16/ep_39/HD.mp4', 1),
-- content 17 (Stranger Things): 4K, 1080p — ep_id 40–45
(17, 40, 'UHD',    '/media/shows/17/ep_40/UHD.mp4',   1),
(17, 40, 'FHD', '/media/shows/17/ep_40/FHD.mp4',1),
(17, 41, 'UHD',    '/media/shows/17/ep_41/UHD.mp4',   1),
(17, 41, 'FHD', '/media/shows/17/ep_41/FHD.mp4',1),
(17, 42, 'UHD',    '/media/shows/17/ep_42/UHD.mp4',   1),
(17, 42, 'FHD', '/media/shows/17/ep_42/FHD.mp4',1),
(17, 43, 'UHD',    '/media/shows/17/ep_43/UHD.mp4',   1),
(17, 43, 'FHD', '/media/shows/17/ep_43/FHD.mp4',1),
(17, 44, 'UHD',    '/media/shows/17/ep_44/UHD.mp4',   1),
(17, 44, 'FHD', '/media/shows/17/ep_44/FHD.mp4',1),
(17, 45, 'UHD',    '/media/shows/17/ep_45/UHD.mp4',   1),
(17, 45, 'FHD', '/media/shows/17/ep_45/FHD.mp4',1),
-- content 20 (Chernobyl): 4K, 1080p — ep_id 46–47
(20, 46, 'UHD',    '/media/shows/20/ep_46/UHD.mp4',   1),
(20, 46, 'FHD', '/media/shows/20/ep_46/FHD.mp4',1),
(20, 47, 'UHD',    '/media/shows/20/ep_47/UHD.mp4',   1),
(20, 47, 'FHD', '/media/shows/20/ep_47/FHD.mp4',1),
-- content 21 (Naruto): 1080p, 720p — ep_id 48–51
(21, 48, 'FHD', '/media/shows/21/ep_48/FHD.mp4',1),
(21, 48, 'HD',  '/media/shows/21/ep_48/HD.mp4', 1),
(21, 49, 'FHD', '/media/shows/21/ep_49/FHD.mp4',1),
(21, 49, 'HD',  '/media/shows/21/ep_49/HD.mp4', 1),
(21, 50, 'FHD', '/media/shows/21/ep_50/FHD.mp4',1),
(21, 50, 'HD',  '/media/shows/21/ep_50/HD.mp4', 1),
(21, 51, 'FHD', '/media/shows/21/ep_51/FHD.mp4',1),
(21, 51, 'HD',  '/media/shows/21/ep_51/HD.mp4', 1),
-- content 22 (Dragon Ball Z): 720p only — ep_id 52–55
(22, 52, 'HD',  '/media/shows/22/ep_52/HD.mp4', 1),
(22, 53, 'HD',  '/media/shows/22/ep_53/HD.mp4', 1),
(22, 54, 'HD',  '/media/shows/22/ep_54/HD.mp4', 1),
(22, 55, 'HD',  '/media/shows/22/ep_55/HD.mp4', 1),
-- content 23 (Demon Slayer): 4K, 1080p — ep_id 56–59
(23, 56, 'UHD',    '/media/shows/23/ep_56/UHD.mp4',   1),
(23, 56, 'FHD', '/media/shows/23/ep_56/FHD.mp4',1),
(23, 57, 'UHD',    '/media/shows/23/ep_57/UHD.mp4',   1),
(23, 57, 'FHD', '/media/shows/23/ep_57/FHD.mp4',1),
(23, 58, 'UHD',    '/media/shows/23/ep_58/UHD.mp4',   1),
(23, 58, 'FHD', '/media/shows/23/ep_58/FHD.mp4',1),
(23, 59, 'UHD',    '/media/shows/23/ep_59/UHD.mp4',   1),
(23, 59, 'FHD', '/media/shows/23/ep_59/FHD.mp4',1),
-- content 24 (FMA: Brotherhood): 1080p, 720p — ep_id 60–63
(24, 60, 'FHD', '/media/shows/24/ep_60/FHD.mp4',1),
(24, 60, 'HD',  '/media/shows/24/ep_60/HD.mp4', 1),
(24, 61, 'FHD', '/media/shows/24/ep_61/FHD.mp4',1),
(24, 61, 'HD',  '/media/shows/24/ep_61/HD.mp4', 1),
(24, 62, 'FHD', '/media/shows/24/ep_62/FHD.mp4',1),
(24, 62, 'HD',  '/media/shows/24/ep_62/HD.mp4', 1),
(24, 63, 'FHD', '/media/shows/24/ep_63/FHD.mp4',1),
(24, 63, 'HD',  '/media/shows/24/ep_63/HD.mp4', 1),
-- content 29 (Squid Game): 4K, 1080p — ep_id 64–65
(29, 64, 'UHD',    '/media/shows/29/ep_64/UHD.mp4',   1),
(29, 64, 'FHD', '/media/shows/29/ep_64/FHD.mp4',1),
(29, 65, 'UHD',    '/media/shows/29/ep_65/UHD.mp4',   1),
(29, 65, 'FHD', '/media/shows/29/ep_65/FHD.mp4',1),
-- content 30 (Arcane): 4K, 1080p — ep_id 66–67
(30, 66, 'UHD',    '/media/shows/30/ep_66/UHD.mp4',   1),
(30, 66, 'FHD', '/media/shows/30/ep_66/FHD.mp4',1),
(30, 67, 'UHD',    '/media/shows/30/ep_67/UHD.mp4',   1),
(30, 67, 'FHD', '/media/shows/30/ep_67/FHD.mp4',1),
-- content 31 (Severance): 4K, 1080p — ep_id 68–71
(31, 68, 'UHD',    '/media/shows/31/ep_68/UHD.mp4',   1),
(31, 68, 'FHD', '/media/shows/31/ep_68/FHD.mp4',1),
(31, 69, 'UHD',    '/media/shows/31/ep_69/UHD.mp4',   1),
(31, 69, 'FHD', '/media/shows/31/ep_69/FHD.mp4',1),
(31, 70, 'UHD',    '/media/shows/31/ep_70/UHD.mp4',   1),
(31, 70, 'FHD', '/media/shows/31/ep_70/FHD.mp4',1),
(31, 71, 'UHD',    '/media/shows/31/ep_71/UHD.mp4',   1),
(31, 71, 'FHD', '/media/shows/31/ep_71/FHD.mp4',1),
-- content 35 (The Bear): 4K, 1080p — ep_id 72–75
(35, 72, 'UHD',    '/media/shows/35/ep_72/UHD.mp4',   1),
(35, 72, 'FHD', '/media/shows/35/ep_72/FHD.mp4',1),
(35, 73, 'UHD',    '/media/shows/35/ep_73/UHD.mp4',   1),
(35, 73, 'FHD', '/media/shows/35/ep_73/FHD.mp4',1),
(35, 74, 'UHD',    '/media/shows/35/ep_74/UHD.mp4',   1),
(35, 74, 'FHD', '/media/shows/35/ep_74/FHD.mp4',1),
(35, 75, 'UHD',    '/media/shows/35/ep_75/UHD.mp4',   1),
(35, 75, 'FHD', '/media/shows/35/ep_75/FHD.mp4',1);


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

-- ══════════════════════════════════════════════════════════════════════
-- content_resource seed
-- Replaces: content_language
--
-- File-path convention:
--   Movies  → /media/movies/{content_id}/{audio|subtitles}/{lang}.{mp4|srt}
--   TV Shows → /media/shows/{content_id}/ep_{episode_id}/{audio|subtitles}/{lang}.{mp4|srt}
--
-- Language codes used in paths:
--   1=en  2=th  3=ja  4=es  5=ko  6=fr  7=de  8=zh  9=it  10=ru
--
-- episode_id reference (from episode table, assigned by IDENTITY):
--   content 2  (Spy x Family)              → ep_id  1– 5
--   content 3  (The Office)                → ep_id  6–11
--   content 5  (One Piece)                 → ep_id 12–15
--   content 6  (Breaking Bad)              → ep_id 16–21
--   content 9  (Attack on Titan)           → ep_id 22–27
--   content 10 (The Mandalorian)           → ep_id 28–31
--   content 15 (Jujutsu Kaisen)            → ep_id 32–35
--   content 16 (Better Call Saul)          → ep_id 36–39
--   content 17 (Stranger Things)           → ep_id 40–45
--   content 20 (Chernobyl)                 → ep_id 46–47
--   content 21 (Naruto)                    → ep_id 48–51
--   content 22 (Dragon Ball Z)             → ep_id 52–55
--   content 23 (Demon Slayer)              → ep_id 56–59
--   content 24 (FMA: Brotherhood)          → ep_id 60–63
--   content 29 (Squid Game)                → ep_id 64–65
--   content 30 (Arcane)                    → ep_id 66–67
--   content 31 (Severance)                 → ep_id 68–71
--   content 35 (The Bear)                  → ep_id 72–75
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO content_resource (content_id, episode_id, language_id, lang_type, file_path, priority) VALUES

-- ══════════════════════════════════════════════════════════════════════
-- MOVIES  (episode_id = NULL)
-- ══════════════════════════════════════════════════════════════════════

-- ── 1 · Interstellar ─────────────────────────────────────────────────
(1, NULL, 1, 'Audio',    '/media/movies/1/audio/en.mp4', 1),
(1, NULL, 2, 'Subtitle', '/media/movies/1/subtitles/th.srt', 1),
(1, NULL, 6, 'Subtitle', '/media/movies/1/subtitles/fr.srt', 1),
(1, NULL, 7, 'Subtitle', '/media/movies/1/subtitles/de.srt', 1),

-- ── 4 · Inception ────────────────────────────────────────────────────
(4, NULL, 1, 'Audio',    '/media/movies/4/audio/en.mp4', 1),
(4, NULL, 2, 'Subtitle', '/media/movies/4/subtitles/th.srt', 1),
(4, NULL, 6, 'Subtitle', '/media/movies/4/subtitles/fr.srt', 1),

-- ── 7 · Your Name ────────────────────────────────────────────────────
(7, NULL, 3, 'Audio',    '/media/movies/7/audio/ja.mp4', 1),
(7, NULL, 1, 'Subtitle', '/media/movies/7/subtitles/en.srt', 1),
(7, NULL, 2, 'Subtitle', '/media/movies/7/subtitles/th.srt', 1),
(7, NULL, 5, 'Subtitle', '/media/movies/7/subtitles/ko.srt', 1),

-- ── 8 · Dune ─────────────────────────────────────────────────────────
(8, NULL, 1, 'Audio',    '/media/movies/8/audio/en.mp4', 1),
(8, NULL, 3, 'Subtitle', '/media/movies/8/subtitles/ja.srt', 1),
(8, NULL, 6, 'Subtitle', '/media/movies/8/subtitles/fr.srt', 1),
(8, NULL, 4, 'Subtitle', '/media/movies/8/subtitles/es.srt', 1),

-- ── 11 · Parasite ────────────────────────────────────────────────────
(11, NULL, 5, 'Audio',    '/media/movies/11/audio/ko.mp4', 1),
(11, NULL, 1, 'Subtitle', '/media/movies/11/subtitles/en.srt', 1),
(11, NULL, 2, 'Subtitle', '/media/movies/11/subtitles/th.srt', 1),
(11, NULL, 8, 'Subtitle', '/media/movies/11/subtitles/zh.srt', 1),

-- ── 12 · The Dark Knight ─────────────────────────────────────────────
(12, NULL, 1, 'Audio',    '/media/movies/12/audio/en.mp4', 1),
(12, NULL, 2, 'Subtitle', '/media/movies/12/subtitles/th.srt', 1),
(12, NULL, 4, 'Subtitle', '/media/movies/12/subtitles/es.srt', 1),

-- ── 13 · Tenet ───────────────────────────────────────────────────────
(13, NULL, 1, 'Audio',    '/media/movies/13/audio/en.mp4', 1),
(13, NULL, 2, 'Subtitle', '/media/movies/13/subtitles/th.srt', 1),
(13, NULL, 7, 'Subtitle', '/media/movies/13/subtitles/de.srt', 1),

-- ── 14 · Everything Everywhere All at Once ───────────────────────────
(14, NULL, 1, 'Audio',    '/media/movies/14/audio/en.mp4', 1),
(14, NULL, 2, 'Subtitle', '/media/movies/14/subtitles/th.srt', 1),
(14, NULL, 4, 'Subtitle', '/media/movies/14/subtitles/es.srt', 1),

-- ── 18 · The Godfather ───────────────────────────────────────────────
(18, NULL, 1, 'Audio',    '/media/movies/18/audio/en.mp4', 1),
(18, NULL, 2, 'Subtitle', '/media/movies/18/subtitles/th.srt', 1),
(18, NULL, 9, 'Subtitle', '/media/movies/18/subtitles/it.srt', 1),

-- ── 19 · Spirited Away ───────────────────────────────────────────────
(19, NULL, 3, 'Audio',    '/media/movies/19/audio/ja.mp4', 1),
(19, NULL, 1, 'Subtitle', '/media/movies/19/subtitles/en.srt', 1),
(19, NULL, 2, 'Subtitle', '/media/movies/19/subtitles/th.srt', 1),

-- ── 25 · Dune: Part Two ──────────────────────────────────────────────
(25, NULL, 1, 'Audio',    '/media/movies/25/audio/en.mp4', 1),
(25, NULL, 2, 'Subtitle', '/media/movies/25/subtitles/th.srt', 1),
(25, NULL, 6, 'Subtitle', '/media/movies/25/subtitles/fr.srt', 1),
(25, NULL, 4, 'Subtitle', '/media/movies/25/subtitles/es.srt', 1),

-- ── 26 · Oppenheimer ─────────────────────────────────────────────────
(26, NULL, 1, 'Audio',    '/media/movies/26/audio/en.mp4', 1),
(26, NULL, 2, 'Subtitle', '/media/movies/26/subtitles/th.srt', 1),
(26, NULL, 7, 'Subtitle', '/media/movies/26/subtitles/de.srt', 1),

-- ── 27 · The Grand Budapest Hotel ────────────────────────────────────
(27, NULL, 1, 'Audio',    '/media/movies/27/audio/en.mp4', 1),
(27, NULL, 6, 'Subtitle', '/media/movies/27/subtitles/fr.srt', 1),
(27, NULL, 7, 'Subtitle', '/media/movies/27/subtitles/de.srt', 1),

-- ── 28 · Pulp Fiction ────────────────────────────────────────────────
(28, NULL, 1, 'Audio',    '/media/movies/28/audio/en.mp4', 1),
(28, NULL, 2, 'Subtitle', '/media/movies/28/subtitles/th.srt', 1),
(28, NULL, 4, 'Subtitle', '/media/movies/28/subtitles/es.srt', 1),

-- ── 32 · Blade Runner 2049 ───────────────────────────────────────────
(32, NULL, 1, 'Audio',    '/media/movies/32/audio/en.mp4', 1),
(32, NULL, 2, 'Subtitle', '/media/movies/32/subtitles/th.srt', 1),
(32, NULL, 6, 'Subtitle', '/media/movies/32/subtitles/fr.srt', 1),

-- ── 33 · Princess Mononoke ───────────────────────────────────────────
(33, NULL, 3, 'Audio',    '/media/movies/33/audio/ja.mp4', 1),
(33, NULL, 1, 'Subtitle', '/media/movies/33/subtitles/en.srt', 1),
(33, NULL, 2, 'Subtitle', '/media/movies/33/subtitles/th.srt', 1),

-- ── 34 · Goodfellas ──────────────────────────────────────────────────
(34, NULL, 1, 'Audio',    '/media/movies/34/audio/en.mp4', 1),
(34, NULL, 2, 'Subtitle', '/media/movies/34/subtitles/th.srt', 1),
(34, NULL, 9, 'Subtitle', '/media/movies/34/subtitles/it.srt', 1),


-- ══════════════════════════════════════════════════════════════════════
-- TV SHOWS  (one row per episode × language/type)
-- ══════════════════════════════════════════════════════════════════════

-- ── content 2 · Spy x Family  (ep_id 1–5) ────────────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(2,  1, 3, 'Audio',    '/media/shows/2/ep_1/audio/ja.mp4', 1),
(2,  1, 1, 'Subtitle', '/media/shows/2/ep_1/subtitles/en.srt', 1),
(2,  1, 2, 'Subtitle', '/media/shows/2/ep_1/subtitles/th.srt', 1),
(2,  2, 3, 'Audio',    '/media/shows/2/ep_2/audio/ja.mp4', 1),
(2,  2, 1, 'Subtitle', '/media/shows/2/ep_2/subtitles/en.srt', 1),
(2,  2, 2, 'Subtitle', '/media/shows/2/ep_2/subtitles/th.srt', 1),
(2,  3, 3, 'Audio',    '/media/shows/2/ep_3/audio/ja.mp4', 1),
(2,  3, 1, 'Subtitle', '/media/shows/2/ep_3/subtitles/en.srt', 1),
(2,  3, 2, 'Subtitle', '/media/shows/2/ep_3/subtitles/th.srt', 1),
(2,  4, 3, 'Audio',    '/media/shows/2/ep_4/audio/ja.mp4', 1),
(2,  4, 1, 'Subtitle', '/media/shows/2/ep_4/subtitles/en.srt', 1),
(2,  4, 2, 'Subtitle', '/media/shows/2/ep_4/subtitles/th.srt', 1),
(2,  5, 3, 'Audio',    '/media/shows/2/ep_5/audio/ja.mp4', 1),
(2,  5, 1, 'Subtitle', '/media/shows/2/ep_5/subtitles/en.srt', 1),
(2,  5, 2, 'Subtitle', '/media/shows/2/ep_5/subtitles/th.srt', 1),

-- ── content 3 · The Office  (ep_id 6–11) ─────────────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle
(3,  6,  1, 'Audio',    '/media/shows/3/ep_6/audio/en.mp4', 1),
(3,  6,  2, 'Subtitle', '/media/shows/3/ep_6/subtitles/th.srt', 1),
(3,  6,  4, 'Subtitle', '/media/shows/3/ep_6/subtitles/es.srt', 1),
(3,  7,  1, 'Audio',    '/media/shows/3/ep_7/audio/en.mp4', 1),
(3,  7,  2, 'Subtitle', '/media/shows/3/ep_7/subtitles/th.srt', 1),
(3,  7,  4, 'Subtitle', '/media/shows/3/ep_7/subtitles/es.srt', 1),
(3,  8,  1, 'Audio',    '/media/shows/3/ep_8/audio/en.mp4', 1),
(3,  8,  2, 'Subtitle', '/media/shows/3/ep_8/subtitles/th.srt', 1),
(3,  8,  4, 'Subtitle', '/media/shows/3/ep_8/subtitles/es.srt', 1),
(3,  9,  1, 'Audio',    '/media/shows/3/ep_9/audio/en.mp4', 1),
(3,  9,  2, 'Subtitle', '/media/shows/3/ep_9/subtitles/th.srt', 1),
(3,  9,  4, 'Subtitle', '/media/shows/3/ep_9/subtitles/es.srt', 1),
(3,  10, 1, 'Audio',    '/media/shows/3/ep_10/audio/en.mp4', 1),
(3,  10, 2, 'Subtitle', '/media/shows/3/ep_10/subtitles/th.srt', 1),
(3,  10, 4, 'Subtitle', '/media/shows/3/ep_10/subtitles/es.srt', 1),
(3,  11, 1, 'Audio',    '/media/shows/3/ep_11/audio/en.mp4', 1),
(3,  11, 2, 'Subtitle', '/media/shows/3/ep_11/subtitles/th.srt', 1),
(3,  11, 4, 'Subtitle', '/media/shows/3/ep_11/subtitles/es.srt', 1),

-- ── content 5 · One Piece  (ep_id 12–15) ─────────────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle | es Subtitle
(5,  12, 3, 'Audio',    '/media/shows/5/ep_12/audio/ja.mp4', 1),
(5,  12, 1, 'Subtitle', '/media/shows/5/ep_12/subtitles/en.srt', 1),
(5,  12, 2, 'Subtitle', '/media/shows/5/ep_12/subtitles/th.srt', 1),
(5,  12, 4, 'Subtitle', '/media/shows/5/ep_12/subtitles/es.srt', 1),
(5,  13, 3, 'Audio',    '/media/shows/5/ep_13/audio/ja.mp4', 1),
(5,  13, 1, 'Subtitle', '/media/shows/5/ep_13/subtitles/en.srt', 1),
(5,  13, 2, 'Subtitle', '/media/shows/5/ep_13/subtitles/th.srt', 1),
(5,  13, 4, 'Subtitle', '/media/shows/5/ep_13/subtitles/es.srt', 1),
(5,  14, 3, 'Audio',    '/media/shows/5/ep_14/audio/ja.mp4', 1),
(5,  14, 1, 'Subtitle', '/media/shows/5/ep_14/subtitles/en.srt', 1),
(5,  14, 2, 'Subtitle', '/media/shows/5/ep_14/subtitles/th.srt', 1),
(5,  14, 4, 'Subtitle', '/media/shows/5/ep_14/subtitles/es.srt', 1),
(5,  15, 3, 'Audio',    '/media/shows/5/ep_15/audio/ja.mp4', 1),
(5,  15, 1, 'Subtitle', '/media/shows/5/ep_15/subtitles/en.srt', 1),
(5,  15, 2, 'Subtitle', '/media/shows/5/ep_15/subtitles/th.srt', 1),
(5,  15, 4, 'Subtitle', '/media/shows/5/ep_15/subtitles/es.srt', 1),

-- ── content 6 · Breaking Bad  (ep_id 16–21) ──────────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle
(6,  16, 1, 'Audio',    '/media/shows/6/ep_16/audio/en.mp4', 1),
(6,  16, 2, 'Subtitle', '/media/shows/6/ep_16/subtitles/th.srt', 1),
(6,  16, 4, 'Subtitle', '/media/shows/6/ep_16/subtitles/es.srt', 1),
(6,  17, 1, 'Audio',    '/media/shows/6/ep_17/audio/en.mp4', 1),
(6,  17, 2, 'Subtitle', '/media/shows/6/ep_17/subtitles/th.srt', 1),
(6,  17, 4, 'Subtitle', '/media/shows/6/ep_17/subtitles/es.srt', 1),
(6,  18, 1, 'Audio',    '/media/shows/6/ep_18/audio/en.mp4', 1),
(6,  18, 2, 'Subtitle', '/media/shows/6/ep_18/subtitles/th.srt', 1),
(6,  18, 4, 'Subtitle', '/media/shows/6/ep_18/subtitles/es.srt', 1),
(6,  19, 1, 'Audio',    '/media/shows/6/ep_19/audio/en.mp4', 1),
(6,  19, 2, 'Subtitle', '/media/shows/6/ep_19/subtitles/th.srt', 1),
(6,  19, 4, 'Subtitle', '/media/shows/6/ep_19/subtitles/es.srt', 1),
(6,  20, 1, 'Audio',    '/media/shows/6/ep_20/audio/en.mp4', 1),
(6,  20, 2, 'Subtitle', '/media/shows/6/ep_20/subtitles/th.srt', 1),
(6,  20, 4, 'Subtitle', '/media/shows/6/ep_20/subtitles/es.srt', 1),
(6,  21, 1, 'Audio',    '/media/shows/6/ep_21/audio/en.mp4', 1),
(6,  21, 2, 'Subtitle', '/media/shows/6/ep_21/subtitles/th.srt', 1),
(6,  21, 4, 'Subtitle', '/media/shows/6/ep_21/subtitles/es.srt', 1),

-- ── content 9 · Attack on Titan  (ep_id 22–27) ───────────────────────
-- Languages: ja Audio | th Subtitle | en Subtitle
(9,  22, 3, 'Audio',    '/media/shows/9/ep_22/audio/ja.mp4', 1),
(9,  22, 2, 'Subtitle', '/media/shows/9/ep_22/subtitles/th.srt', 1),
(9,  22, 1, 'Subtitle', '/media/shows/9/ep_22/subtitles/en.srt', 1),
(9,  23, 3, 'Audio',    '/media/shows/9/ep_23/audio/ja.mp4', 1),
(9,  23, 2, 'Subtitle', '/media/shows/9/ep_23/subtitles/th.srt', 1),
(9,  23, 1, 'Subtitle', '/media/shows/9/ep_23/subtitles/en.srt', 1),
(9,  24, 3, 'Audio',    '/media/shows/9/ep_24/audio/ja.mp4', 1),
(9,  24, 2, 'Subtitle', '/media/shows/9/ep_24/subtitles/th.srt', 1),
(9,  24, 1, 'Subtitle', '/media/shows/9/ep_24/subtitles/en.srt', 1),
(9,  25, 3, 'Audio',    '/media/shows/9/ep_25/audio/ja.mp4', 1),
(9,  25, 2, 'Subtitle', '/media/shows/9/ep_25/subtitles/th.srt', 1),
(9,  25, 1, 'Subtitle', '/media/shows/9/ep_25/subtitles/en.srt', 1),
(9,  26, 3, 'Audio',    '/media/shows/9/ep_26/audio/ja.mp4', 1),
(9,  26, 2, 'Subtitle', '/media/shows/9/ep_26/subtitles/th.srt', 1),
(9,  26, 1, 'Subtitle', '/media/shows/9/ep_26/subtitles/en.srt', 1),
(9,  27, 3, 'Audio',    '/media/shows/9/ep_27/audio/ja.mp4', 1),
(9,  27, 2, 'Subtitle', '/media/shows/9/ep_27/subtitles/th.srt', 1),
(9,  27, 1, 'Subtitle', '/media/shows/9/ep_27/subtitles/en.srt', 1),

-- ── content 10 · The Mandalorian  (ep_id 28–31) ──────────────────────
-- Languages: en Audio | en Subtitle (SDH) | th Subtitle
-- (language_id=1 appears twice; UNIQUE holds because lang_type differs)
(10, 28, 1, 'Audio',    '/media/shows/10/ep_28/audio/en.mp4', 1),
(10, 28, 1, 'Subtitle', '/media/shows/10/ep_28/subtitles/en.srt', 1),
(10, 28, 2, 'Subtitle', '/media/shows/10/ep_28/subtitles/th.srt', 1),
(10, 29, 1, 'Audio',    '/media/shows/10/ep_29/audio/en.mp4', 1),
(10, 29, 1, 'Subtitle', '/media/shows/10/ep_29/subtitles/en.srt', 1),
(10, 29, 2, 'Subtitle', '/media/shows/10/ep_29/subtitles/th.srt', 1),
(10, 30, 1, 'Audio',    '/media/shows/10/ep_30/audio/en.mp4', 1),
(10, 30, 1, 'Subtitle', '/media/shows/10/ep_30/subtitles/en.srt', 1),
(10, 30, 2, 'Subtitle', '/media/shows/10/ep_30/subtitles/th.srt', 1),
(10, 31, 1, 'Audio',    '/media/shows/10/ep_31/audio/en.mp4', 1),
(10, 31, 1, 'Subtitle', '/media/shows/10/ep_31/subtitles/en.srt', 1),
(10, 31, 2, 'Subtitle', '/media/shows/10/ep_31/subtitles/th.srt', 1),

-- ── content 15 · Jujutsu Kaisen  (ep_id 32–35) ───────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(15, 32, 3, 'Audio',    '/media/shows/15/ep_32/audio/ja.mp4', 1),
(15, 32, 1, 'Subtitle', '/media/shows/15/ep_32/subtitles/en.srt', 1),
(15, 32, 2, 'Subtitle', '/media/shows/15/ep_32/subtitles/th.srt', 1),
(15, 33, 3, 'Audio',    '/media/shows/15/ep_33/audio/ja.mp4', 1),
(15, 33, 1, 'Subtitle', '/media/shows/15/ep_33/subtitles/en.srt', 1),
(15, 33, 2, 'Subtitle', '/media/shows/15/ep_33/subtitles/th.srt', 1),
(15, 34, 3, 'Audio',    '/media/shows/15/ep_34/audio/ja.mp4', 1),
(15, 34, 1, 'Subtitle', '/media/shows/15/ep_34/subtitles/en.srt', 1),
(15, 34, 2, 'Subtitle', '/media/shows/15/ep_34/subtitles/th.srt', 1),
(15, 35, 3, 'Audio',    '/media/shows/15/ep_35/audio/ja.mp4', 1),
(15, 35, 1, 'Subtitle', '/media/shows/15/ep_35/subtitles/en.srt', 1),
(15, 35, 2, 'Subtitle', '/media/shows/15/ep_35/subtitles/th.srt', 1),

-- ── content 16 · Better Call Saul  (ep_id 36–39) ─────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle
(16, 36, 1, 'Audio',    '/media/shows/16/ep_36/audio/en.mp4', 1),
(16, 36, 2, 'Subtitle', '/media/shows/16/ep_36/subtitles/th.srt', 1),
(16, 36, 4, 'Subtitle', '/media/shows/16/ep_36/subtitles/es.srt', 1),
(16, 37, 1, 'Audio',    '/media/shows/16/ep_37/audio/en.mp4', 1),
(16, 37, 2, 'Subtitle', '/media/shows/16/ep_37/subtitles/th.srt', 1),
(16, 37, 4, 'Subtitle', '/media/shows/16/ep_37/subtitles/es.srt', 1),
(16, 38, 1, 'Audio',    '/media/shows/16/ep_38/audio/en.mp4', 1),
(16, 38, 2, 'Subtitle', '/media/shows/16/ep_38/subtitles/th.srt', 1),
(16, 38, 4, 'Subtitle', '/media/shows/16/ep_38/subtitles/es.srt', 1),
(16, 39, 1, 'Audio',    '/media/shows/16/ep_39/audio/en.mp4', 1),
(16, 39, 2, 'Subtitle', '/media/shows/16/ep_39/subtitles/th.srt', 1),
(16, 39, 4, 'Subtitle', '/media/shows/16/ep_39/subtitles/es.srt', 1),

-- ── content 17 · Stranger Things  (ep_id 40–45) ──────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle | fr Subtitle
(17, 40, 1, 'Audio',    '/media/shows/17/ep_40/audio/en.mp4', 1),
(17, 40, 2, 'Subtitle', '/media/shows/17/ep_40/subtitles/th.srt', 1),
(17, 40, 4, 'Subtitle', '/media/shows/17/ep_40/subtitles/es.srt', 1),
(17, 40, 6, 'Subtitle', '/media/shows/17/ep_40/subtitles/fr.srt', 1),
(17, 41, 1, 'Audio',    '/media/shows/17/ep_41/audio/en.mp4', 1),
(17, 41, 2, 'Subtitle', '/media/shows/17/ep_41/subtitles/th.srt', 1),
(17, 41, 4, 'Subtitle', '/media/shows/17/ep_41/subtitles/es.srt', 1),
(17, 41, 6, 'Subtitle', '/media/shows/17/ep_41/subtitles/fr.srt', 1),
(17, 42, 1, 'Audio',    '/media/shows/17/ep_42/audio/en.mp4', 1),
(17, 42, 2, 'Subtitle', '/media/shows/17/ep_42/subtitles/th.srt', 1),
(17, 42, 4, 'Subtitle', '/media/shows/17/ep_42/subtitles/es.srt', 1),
(17, 42, 6, 'Subtitle', '/media/shows/17/ep_42/subtitles/fr.srt', 1),
(17, 43, 1, 'Audio',    '/media/shows/17/ep_43/audio/en.mp4', 1),
(17, 43, 2, 'Subtitle', '/media/shows/17/ep_43/subtitles/th.srt', 1),
(17, 43, 4, 'Subtitle', '/media/shows/17/ep_43/subtitles/es.srt', 1),
(17, 43, 6, 'Subtitle', '/media/shows/17/ep_43/subtitles/fr.srt', 1),
(17, 44, 1, 'Audio',    '/media/shows/17/ep_44/audio/en.mp4', 1),
(17, 44, 2, 'Subtitle', '/media/shows/17/ep_44/subtitles/th.srt', 1),
(17, 44, 4, 'Subtitle', '/media/shows/17/ep_44/subtitles/es.srt', 1),
(17, 44, 6, 'Subtitle', '/media/shows/17/ep_44/subtitles/fr.srt', 1),
(17, 45, 1, 'Audio',    '/media/shows/17/ep_45/audio/en.mp4', 1),
(17, 45, 2, 'Subtitle', '/media/shows/17/ep_45/subtitles/th.srt', 1),
(17, 45, 4, 'Subtitle', '/media/shows/17/ep_45/subtitles/es.srt', 1),
(17, 45, 6, 'Subtitle', '/media/shows/17/ep_45/subtitles/fr.srt', 1),

-- ── content 20 · Chernobyl  (ep_id 46–47) ────────────────────────────
-- Languages: en Audio | th Subtitle | ru Subtitle
(20, 46, 1, 'Audio',    '/media/shows/20/ep_46/audio/en.mp4', 1),
(20, 46, 2, 'Subtitle', '/media/shows/20/ep_46/subtitles/th.srt', 1),
(20, 46, 10,'Subtitle', '/media/shows/20/ep_46/subtitles/ru.srt', 1),
(20, 47, 1, 'Audio',    '/media/shows/20/ep_47/audio/en.mp4', 1),
(20, 47, 2, 'Subtitle', '/media/shows/20/ep_47/subtitles/th.srt', 1),
(20, 47, 10,'Subtitle', '/media/shows/20/ep_47/subtitles/ru.srt', 1),

-- ── content 21 · Naruto  (ep_id 48–51) ───────────────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(21, 48, 3, 'Audio',    '/media/shows/21/ep_48/audio/ja.mp4', 1),
(21, 48, 1, 'Subtitle', '/media/shows/21/ep_48/subtitles/en.srt', 1),
(21, 48, 2, 'Subtitle', '/media/shows/21/ep_48/subtitles/th.srt', 1),
(21, 49, 3, 'Audio',    '/media/shows/21/ep_49/audio/ja.mp4', 1),
(21, 49, 1, 'Subtitle', '/media/shows/21/ep_49/subtitles/en.srt', 1),
(21, 49, 2, 'Subtitle', '/media/shows/21/ep_49/subtitles/th.srt', 1),
(21, 50, 3, 'Audio',    '/media/shows/21/ep_50/audio/ja.mp4', 1),
(21, 50, 1, 'Subtitle', '/media/shows/21/ep_50/subtitles/en.srt', 1),
(21, 50, 2, 'Subtitle', '/media/shows/21/ep_50/subtitles/th.srt', 1),
(21, 51, 3, 'Audio',    '/media/shows/21/ep_51/audio/ja.mp4', 1),
(21, 51, 1, 'Subtitle', '/media/shows/21/ep_51/subtitles/en.srt', 1),
(21, 51, 2, 'Subtitle', '/media/shows/21/ep_51/subtitles/th.srt', 1),

-- ── content 22 · Dragon Ball Z  (ep_id 52–55) ────────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(22, 52, 3, 'Audio',    '/media/shows/22/ep_52/audio/ja.mp4', 1),
(22, 52, 1, 'Subtitle', '/media/shows/22/ep_52/subtitles/en.srt', 1),
(22, 52, 2, 'Subtitle', '/media/shows/22/ep_52/subtitles/th.srt', 1),
(22, 53, 3, 'Audio',    '/media/shows/22/ep_53/audio/ja.mp4', 1),
(22, 53, 1, 'Subtitle', '/media/shows/22/ep_53/subtitles/en.srt', 1),
(22, 53, 2, 'Subtitle', '/media/shows/22/ep_53/subtitles/th.srt', 1),
(22, 54, 3, 'Audio',    '/media/shows/22/ep_54/audio/ja.mp4', 1),
(22, 54, 1, 'Subtitle', '/media/shows/22/ep_54/subtitles/en.srt', 1),
(22, 54, 2, 'Subtitle', '/media/shows/22/ep_54/subtitles/th.srt', 1),
(22, 55, 3, 'Audio',    '/media/shows/22/ep_55/audio/ja.mp4', 1),
(22, 55, 1, 'Subtitle', '/media/shows/22/ep_55/subtitles/en.srt', 1),
(22, 55, 2, 'Subtitle', '/media/shows/22/ep_55/subtitles/th.srt', 1),

-- ── content 23 · Demon Slayer  (ep_id 56–59) ─────────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(23, 56, 3, 'Audio',    '/media/shows/23/ep_56/audio/ja.mp4', 1),
(23, 56, 1, 'Subtitle', '/media/shows/23/ep_56/subtitles/en.srt', 1),
(23, 56, 2, 'Subtitle', '/media/shows/23/ep_56/subtitles/th.srt', 1),
(23, 57, 3, 'Audio',    '/media/shows/23/ep_57/audio/ja.mp4', 1),
(23, 57, 1, 'Subtitle', '/media/shows/23/ep_57/subtitles/en.srt', 1),
(23, 57, 2, 'Subtitle', '/media/shows/23/ep_57/subtitles/th.srt', 1),
(23, 58, 3, 'Audio',    '/media/shows/23/ep_58/audio/ja.mp4', 1),
(23, 58, 1, 'Subtitle', '/media/shows/23/ep_58/subtitles/en.srt', 1),
(23, 58, 2, 'Subtitle', '/media/shows/23/ep_58/subtitles/th.srt', 1),
(23, 59, 3, 'Audio',    '/media/shows/23/ep_59/audio/ja.mp4', 1),
(23, 59, 1, 'Subtitle', '/media/shows/23/ep_59/subtitles/en.srt', 1),
(23, 59, 2, 'Subtitle', '/media/shows/23/ep_59/subtitles/th.srt', 1),

-- ── content 24 · FMA: Brotherhood  (ep_id 60–63) ─────────────────────
-- Languages: ja Audio | en Subtitle | th Subtitle
(24, 60, 3, 'Audio',    '/media/shows/24/ep_60/audio/ja.mp4', 1),
(24, 60, 1, 'Subtitle', '/media/shows/24/ep_60/subtitles/en.srt', 1),
(24, 60, 2, 'Subtitle', '/media/shows/24/ep_60/subtitles/th.srt', 1),
(24, 61, 3, 'Audio',    '/media/shows/24/ep_61/audio/ja.mp4', 1),
(24, 61, 1, 'Subtitle', '/media/shows/24/ep_61/subtitles/en.srt', 1),
(24, 61, 2, 'Subtitle', '/media/shows/24/ep_61/subtitles/th.srt', 1),
(24, 62, 3, 'Audio',    '/media/shows/24/ep_62/audio/ja.mp4', 1),
(24, 62, 1, 'Subtitle', '/media/shows/24/ep_62/subtitles/en.srt', 1),
(24, 62, 2, 'Subtitle', '/media/shows/24/ep_62/subtitles/th.srt', 1),
(24, 63, 3, 'Audio',    '/media/shows/24/ep_63/audio/ja.mp4', 1),
(24, 63, 1, 'Subtitle', '/media/shows/24/ep_63/subtitles/en.srt', 1),
(24, 63, 2, 'Subtitle', '/media/shows/24/ep_63/subtitles/th.srt', 1),

-- ── content 29 · Squid Game  (ep_id 64–65) ───────────────────────────
-- Languages: ko Audio | en Subtitle | th Subtitle | ja Subtitle
(29, 64, 5, 'Audio',    '/media/shows/29/ep_64/audio/ko.mp4', 1),
(29, 64, 1, 'Subtitle', '/media/shows/29/ep_64/subtitles/en.srt', 1),
(29, 64, 2, 'Subtitle', '/media/shows/29/ep_64/subtitles/th.srt', 1),
(29, 64, 3, 'Subtitle', '/media/shows/29/ep_64/subtitles/ja.srt', 1),
(29, 65, 5, 'Audio',    '/media/shows/29/ep_65/audio/ko.mp4', 1),
(29, 65, 1, 'Subtitle', '/media/shows/29/ep_65/subtitles/en.srt', 1),
(29, 65, 2, 'Subtitle', '/media/shows/29/ep_65/subtitles/th.srt', 1),
(29, 65, 3, 'Subtitle', '/media/shows/29/ep_65/subtitles/ja.srt', 1),

-- ── content 30 · Arcane  (ep_id 66–67) ───────────────────────────────
-- Languages: en Audio | fr Subtitle | th Subtitle
(30, 66, 1, 'Audio',    '/media/shows/30/ep_66/audio/en.mp4', 1),
(30, 66, 6, 'Subtitle', '/media/shows/30/ep_66/subtitles/fr.srt', 1),
(30, 66, 2, 'Subtitle', '/media/shows/30/ep_66/subtitles/th.srt', 1),
(30, 67, 1, 'Audio',    '/media/shows/30/ep_67/audio/en.mp4', 1),
(30, 67, 6, 'Subtitle', '/media/shows/30/ep_67/subtitles/fr.srt', 1),
(30, 67, 2, 'Subtitle', '/media/shows/30/ep_67/subtitles/th.srt', 1),

-- ── content 31 · Severance  (ep_id 68–71) ────────────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle
(31, 68, 1, 'Audio',    '/media/shows/31/ep_68/audio/en.mp4', 1),
(31, 68, 2, 'Subtitle', '/media/shows/31/ep_68/subtitles/th.srt', 1),
(31, 68, 4, 'Subtitle', '/media/shows/31/ep_68/subtitles/es.srt', 1),
(31, 69, 1, 'Audio',    '/media/shows/31/ep_69/audio/en.mp4', 1),
(31, 69, 2, 'Subtitle', '/media/shows/31/ep_69/subtitles/th.srt', 1),
(31, 69, 4, 'Subtitle', '/media/shows/31/ep_69/subtitles/es.srt', 1),
(31, 70, 1, 'Audio',    '/media/shows/31/ep_70/audio/en.mp4', 1),
(31, 70, 2, 'Subtitle', '/media/shows/31/ep_70/subtitles/th.srt', 1),
(31, 70, 4, 'Subtitle', '/media/shows/31/ep_70/subtitles/es.srt', 1),
(31, 71, 1, 'Audio',    '/media/shows/31/ep_71/audio/en.mp4', 1),
(31, 71, 2, 'Subtitle', '/media/shows/31/ep_71/subtitles/th.srt', 1),
(31, 71, 4, 'Subtitle', '/media/shows/31/ep_71/subtitles/es.srt', 1),

-- ── content 35 · The Bear  (ep_id 72–75) ─────────────────────────────
-- Languages: en Audio | th Subtitle | es Subtitle
(35, 72, 1, 'Audio',    '/media/shows/35/ep_72/audio/en.mp4', 1),
(35, 72, 2, 'Subtitle', '/media/shows/35/ep_72/subtitles/th.srt', 1),
(35, 72, 4, 'Subtitle', '/media/shows/35/ep_72/subtitles/es.srt', 1),
(35, 73, 1, 'Audio',    '/media/shows/35/ep_73/audio/en.mp4', 1),
(35, 73, 2, 'Subtitle', '/media/shows/35/ep_73/subtitles/th.srt', 1),
(35, 73, 4, 'Subtitle', '/media/shows/35/ep_73/subtitles/es.srt', 1),
(35, 74, 1, 'Audio',    '/media/shows/35/ep_74/audio/en.mp4', 1),
(35, 74, 2, 'Subtitle', '/media/shows/35/ep_74/subtitles/th.srt', 1),
(35, 74, 4, 'Subtitle', '/media/shows/35/ep_74/subtitles/es.srt', 1),
(35, 75, 1, 'Audio',    '/media/shows/35/ep_75/audio/en.mp4', 1),
(35, 75, 2, 'Subtitle', '/media/shows/35/ep_75/subtitles/th.srt', 1),
(35, 75, 4, 'Subtitle', '/media/shows/35/ep_75/subtitles/es.srt', 1);

-- NOTE: content_role PK is (content_id, person_id) — one role per person per title.
-- Fixes applied vs. the original seed:
--   • Removed (20, 18, 'Director', NULL): Wes Anderson did NOT direct Chernobyl.
--   • Changed character for (8, 9) from 'Stilgar' to 'Duncan Idaho':
--     Pedro Pascal played Duncan Idaho in Dune (2021), not Stilgar.
INSERT INTO content_role (content_id, person_id, role_type, character_name) VALUES
(1,  1,  'Director', NULL),
(1,  7,  'Actor',    'Amelia Brand'),
(2,  2,  'Producer',  NULL),
(3,  3,  'Actor',     'Michael Scott'),
(5,  5,  'Producer',  NULL),
(6,  6,  'Actor',     'Walter White'),
(6,  25, 'Actor',    'Jesse Pinkman'),
(6,  26, 'Actor',    'Skyler White'),
(7,  15, 'Director', NULL),
(8,  14, 'Director', NULL),
(8,  31, 'Actor',    'Paul Atreides'),
(8,  9,  'Actor',    'Duncan Idaho'),   -- corrected from 'Stilgar'
(9,  11, 'Producer',  NULL),
(10, 9,  'Actor',     'Din Djarin'),
(11, 8,  'Director', NULL),
(12, 4,  'Actor',    'Joker'),
(12, 1,  'Director', NULL),
(17, 27, 'Actor',    'Eleven'),
(17, 28, 'Actor',    'Joyce Byers'),
(18, 29, 'Actor',    'Michael Corleone'),
(18, 30, 'Actor',     'Vito Corleone'),
(19, 16, 'Director', NULL),
-- (20, 18, 'Director', NULL) removed — Wes Anderson did not direct Chernobyl
(21, 21, 'Producer',  NULL),
(22, 22, 'Producer',  NULL),
(23, 23, 'Producer',  NULL),
(24, 24, 'Producer',  NULL),
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

INSERT INTO transaction_list (user_id, transaction_date, total_amount, payment_method, payment_status) VALUES
(2,  '2021-03-10 20:15:00',  9.99,  'credit_card', 'Completed'),   -- 1
(3,  '2022-05-20 11:30:00', 19.99,  'credit_card', 'Completed'),   -- 2
(4,  '2021-08-01 18:45:00',  7.99,  'debit_card', 'Completed'),    -- 3
(5,  '2021-10-05 09:00:00', 49.99,  'credit_card', 'Completed'),   -- 4
(6,  '2021-09-14 14:22:00', 15.99,  'paypal', 'Completed'),        -- 5
(7,  '2021-10-30 21:00:00', 12.99,  'credit_card', 'Completed'),   -- 6
(8,  '2021-11-01 16:05:00', 29.99,  'credit_card', 'Completed'),   -- 7
(9,  '2021-11-05 10:10:00', 14.99,  'debit_card', 'Completed'),    -- 8
(10, '2022-01-07 08:30:00', 11.99,  'paypal', 'Completed'),        -- 9
(11, '2022-02-14 19:45:00', 35.00,  'credit_card', 'Completed'),   -- 10
(12, '2022-03-05 13:20:00', 19.99,  'credit_card', 'Completed'),   -- 11
(13, '2022-04-11 17:55:00',  9.50,  'credit_card', 'Completed'),     -- 12
(14, '2022-06-19 22:10:00',  5.99,  'debit_card', 'Completed'),    -- 13
(15, '2022-07-04 15:40:00', 11.99,  'credit_card', 'Completed'),   -- 14
(16, '2022-09-01 09:05:00', 13.50,  'credit_card', 'Completed'),    -- 15
(17, '2022-10-28 20:30:00', 25.00,  'credit_card', 'Completed'),   -- 16
(18, '2022-11-15 11:00:00', 22.00,  'credit_card', 'Completed'),   -- 17
(19, '2022-12-03 14:15:00', 18.00,  'paypal', 'Completed'),        -- 18
(20, '2023-01-20 16:00:00', 15.00,  'credit_card', 'Completed'),   -- 19
(2,  '2023-02-08 10:45:00', 10.00,  'credit_card', 'Completed'),   -- 20
(21, '2023-03-12 19:00:00', 29.99,  'debit_card', 'Completed'),    -- 21
(22, '2023-04-05 08:20:00', 24.99,  'credit_card', 'Completed'),   -- 22
(23, '2023-05-19 13:45:00', 22.00,  'credit_card', 'Completed'),     -- 23
(24, '2023-06-30 21:10:00', 26.00,  'credit_card', 'Completed'),   -- 24
(25, '2024-04-02 12:00:00', 16.99,  'credit_card', 'Completed'),   -- 25
(26, '2023-09-14 17:30:00', 12.99,  'credit_card', 'Completed'),    -- 26
(27, '2023-10-01 09:50:00',  8.99,  'debit_card', 'Completed'),    -- 27
(28, '2023-11-11 22:22:00',  7.99,  'credit_card', 'Completed'),   -- 28
(29, '2023-12-25 15:00:00', 18.00,  'credit_card', 'Completed'),   -- 29
(30, '2024-01-08 11:11:00', 15.00,  'credit_card', 'Completed'),   -- 30
(31, '2024-02-20 20:05:00', 14.99,  'credit_card', 'Completed'),   -- 31
(32, '2024-03-15 07:45:00', 11.99,  'credit_card', 'Completed'),     -- 32
(33, '2024-04-28 18:30:00',  9.99,  'debit_card', 'Completed'),    -- 33
(34, '2024-05-10 14:00:00',  8.50,  'credit_card', 'Completed'),   -- 34
(35, '2024-06-03 10:20:00', 12.00,  'paypal', 'Completed'),        -- 35
(36, '2024-07-22 16:40:00', 14.99,  'credit_card', 'Completed'),   -- 36
(37, '2024-08-15 09:15:00',  9.99,  'credit_card', 'Completed'),   -- 37
(38, '2024-09-30 19:55:00', 29.99,  'debit_card', 'Completed'),    -- 38
(39, '2024-10-18 13:05:00', 35.00,  'credit_card', 'Completed'),   -- 39
(40, '2024-11-29 21:30:00', 25.00,  'credit_card', 'Completed');   -- 40

INSERT INTO transaction_detail (transaction_id, content_id, content_name, original_price, discount_applied, sold_price) VALUES
(1,  1,  'Interstellar',                       9.99,  0.00,  9.99),
(2,  2,  'Spy x Family',                      19.99,  4.00,  15.99), -- Premium User (20% off)
(3,  4,  'Inception',                          7.99,  0.00,  7.99),
(4,  5,  'One Piece',                         49.99, 10.00,  39.99), -- Premium User (20% off)
(5,  3,  'The Office',                        15.99,  0.00,  15.99),
(6,  7,  'Your Name',                         12.99,  2.60,  10.39),
(7,  6,  'Breaking Bad',                      29.99,  0.00,  29.99),
(8,  8,  'Dune',                              14.99,  3.00,  11.99),
(9,  13, 'Tenet',                             11.99,  0.00,  11.99),
(10, 9,  'Attack on Titan',                   35.00,  7.00,  28.00),
(11, 10, 'The Mandalorian',                   19.99,  0.00,  19.99),
(12, 11, 'Parasite',                           9.50,  1.90,   7.60),
(13, 12, 'The Dark Knight',                    5.99,  0.00,   5.99),
(14, 13, 'Tenet',                             11.99,  2.40,   9.59),
(15, 14, 'Everything Everywhere All at Once', 13.50,  0.00,  13.50),
(16, 15, 'Jujutsu Kaisen',                    25.00,  5.00,  20.00),
(17, 16, 'Better Call Saul',                  22.00,  0.00,  22.00),
(18, 17, 'Stranger Things',                   18.00,  3.60,  14.40),
(19, 18, 'The Godfather',                     15.00,  0.00,  15.00),
(20, 19, 'Spirited Away',                     10.00,  2.00,   8.00),
(21, 21, 'Naruto',                            29.99,  0.00,  29.99),
(22, 22, 'Dragon Ball Z',                     24.99,  5.00,  19.99),
(23, 23, 'Demon Slayer',                      22.00,  0.00,  22.00),
(24, 24, 'Fullmetal Alchemist: Brotherhood',  26.00,  5.20,  20.80),
(25, 25, 'Dune: Part Two',                    16.99,  0.00,  16.99),
(26, 26, 'Oppenheimer',                       12.99,  2.60,  10.39),
(27, 27, 'The Grand Budapest Hotel',           8.99,  0.00,   8.99),
(28, 28, 'Pulp Fiction',                       7.99,  1.60,   6.39),
(29, 29, 'Squid Game',                        18.00,  0.00,  18.00),
(30, 30, 'Arcane',                            15.00,  3.00,  12.00),
(31, 31, 'Severance',                         14.99,  0.00,  14.99),
(32, 32, 'Blade Runner 2049',                 11.99,  2.40,   9.59),
(33, 33, 'Princess Mononoke',                  9.99,  0.00,   9.99),
(34, 34, 'Goodfellas',                         8.50,  1.70,   6.80),
(35, 35, 'The Bear',                          12.00,  0.00,  12.00),
(36, 8,  'Dune',                              14.99,  3.00,  11.99),
(37, 1,  'Interstellar',                       9.99,  0.00,   9.99),
(38, 6,  'Breaking Bad',                      29.99,  6.00,  23.99),
(39, 9,  'Attack on Titan',                   35.00,  0.00,  35.00),
(40, 15, 'Jujutsu Kaisen',                    25.00,  5.00,  20.00);

INSERT INTO personal_library (user_id, content_id, purchase_date) VALUES
(2, 1, '2021-03-10'), 
(2, 2, '2021-03-11'), 
(3, 4, '2021-03-12'), 
(2, 5, '2021-03-13'), 
(3, 3, '2021-03-14'),
(4, 7, '2021-03-15'), 
(5, 6, '2021-03-16'), 
(6, 8, '2021-03-17'), 
(7, 13, '2021-03-18'), 
(8, 9, '2021-03-19'),
(9, 10, '2021-03-20'), 
(10, 11, '2021-03-21'), 
(11, 12, '2021-03-22'), 
(12, 13, '2021-03-23'), 
(13, 14, '2021-03-24'),
(14, 15, '2021-03-25'), 
(15, 16, '2021-03-26'), 
(16, 17, '2021-03-27'), 
(17, 18, '2021-03-28'), 
(18, 19, '2021-03-29'),
(19, 21, '2021-03-30'), 
(20, 22, '2021-03-31'), 
(21, 23, '2021-04-01'), 
(22, 24, '2021-04-02'), 
(23, 25, '2021-04-03'),
(24, 26, '2021-04-04'), 
(25, 27, '2021-04-05'), 
(26, 28, '2021-04-06'), 
(27, 29, '2021-04-07'), 
(28, 30, '2021-04-08'),
(29, 31, '2021-04-09'), 
(30, 32, '2021-04-10'), 
(31, 33, '2021-04-11'), 
(32, 34, '2021-04-12'), 
(33, 35, '2021-04-13'),
(34, 8, '2021-04-14'), 
(35, 1, '2021-04-15'), 
(36, 6, '2021-04-16'), 
(37, 9, '2021-04-17'), 
(38, 15, '2021-04-18');

INSERT INTO subscription_detail (transaction_id, tier_id, tier_name, start_date, end_date, sold_price) VALUES
(2,  2, 'premium', '2022-05-20', '2022-06-20',  9.99),
(4,  2, 'premium', '2021-08-01', '2021-09-01',  9.99),
(6,  2, 'premium', '2021-10-30', '2021-11-30',  9.99),
(8,  2, 'premium', '2021-11-05', '2021-12-05',  9.99),
(11, 2, 'premium', '2022-03-05', '2022-04-05',  9.99),
(18, 2, 'premium', '2022-11-15', '2022-12-15',  9.99),
(21, 2, 'premium', '2023-03-12', '2023-04-12',  9.99),
(29, 2, 'premium', '2023-12-25', '2024-01-25',  9.99),
(37, 2, 'premium', '2024-08-15', '2024-09-15',  9.99);


-- post_status = 'Published' for all reviews (visible to public)
INSERT INTO reviews (user_id, content_id, rating, comment_text, post_time, post_status) VALUES
(2,  1,  5.0, 'A masterpiece of visual storytelling.',                    '2021-03-17 22:10:00', 'Published'),
(3,  2,  4.5, 'So cute and funny, Anya is adorable!',                     '2022-05-28 14:00:00', 'Published'),
(4,  4,  4.8, 'Dreams within dreams — blew my mind.',                     '2021-08-10 19:30:00', 'Published'),
(5,  5,  5.0, 'Legendary. The only show that keeps going and stays great.','2021-10-15 09:45:00', 'Published'),
(6,  3,  4.2, 'Michael Scott is pure comedy gold.',                       '2021-09-25 20:00:00', 'Published'),
(7,  7,  4.7, 'Beautiful and heartbreaking at the same time.',            '2021-11-12 17:20:00', 'Published'),
(8,  6,  5.0, 'The best TV drama ever made.',                             '2021-11-20 21:55:00', 'Published'),
(9,  8,  4.3, 'Epic world-building, stunning visuals.',                   '2021-11-19 10:30:00', 'Published'),
(10, 13, 3.8, 'Wait... what direction did that bullet go?',               '2022-01-18 23:05:00', 'Published'),
(11, 9,  4.9, 'Cried three times. No regrets.',                           '2022-02-28 18:40:00', 'Published'),
(12, 10, 4.6, 'Baby Yoda alone is worth the price.',                      '2022-03-19 13:10:00', 'Published'),
(13, 11, 4.8, 'Bong Joon-ho is a genius.',                               '2022-04-24 16:50:00', 'Published'),
(14, 12, 5.0, 'Heath Ledger''s Joker is untouchable.',                    '2022-07-01 20:15:00', 'Published'),
(15, 13, 3.5, 'Visually amazing but hard to follow.',                     '2022-07-22 11:00:00', 'Published'),
(16, 14, 4.7, 'So wild, yet so emotionally resonant.',                    '2022-09-15 08:30:00', 'Published'),
(17, 15, 4.5, 'The animation during Domain Expansions is insane.',        '2022-11-08 22:45:00', 'Published'),
(18, 16, 4.9, 'Better than Breaking Bad? Dare I say yes.',                '2022-11-30 19:00:00', 'Published'),
(19, 17, 4.4, 'Season 1 is flawless.',                                    '2022-12-20 14:25:00', 'Published'),
(20, 18, 5.0, 'Leave the gun. Take the cannoli.',                         '2023-02-01 21:00:00', 'Published'),
(2,  19, 4.9, 'Miyazaki''s greatest work.',                               '2023-02-20 16:30:00', 'Published'),
(21, 21, 5.0, 'Believe it! Naruto is my all-time favourite.',             '2023-03-25 10:00:00', 'Published'),
(22, 22, 4.8, 'Over 9000/10. Timeless classic.',                          '2023-04-18 07:30:00', 'Published'),
(23, 23, 4.9, 'The Mugen Train arc made me sob.',                         '2023-06-01 20:10:00', 'Published'),
(24, 24, 5.0, 'Brotherhood is peak anime storytelling.',                  '2023-07-14 15:55:00', 'Published'),
(25, 25, 4.7, 'Denis did it again — Dune Part Two is a war epic.',        '2024-04-20 18:00:00', 'Published'),
(26, 26, 4.9, 'Cillian Murphy deserved every award.',                     '2023-09-30 22:30:00', 'Published'),
(27, 27, 4.5, 'Wes Anderson is in a league of his own.',                  '2023-10-15 12:40:00', 'Published'),
(28, 28, 5.0, 'Cool, cool, cool. Tarantino''s magnum opus.',              '2023-11-25 20:00:00', 'Published'),
(29, 29, 4.8, 'Red light green light will haunt me forever.',             '2024-01-05 09:15:00', 'Published'),
(30, 30, 5.0, 'The animation quality is absolutely stunning.',            '2024-01-22 17:45:00', 'Published'),
(31, 31, 4.6, 'The most unsettling office drama since The Office.',       '2024-03-04 11:30:00', 'Published'),
(32, 32, 4.4, 'Atmospheric and visually breathtaking.',                   '2024-03-28 14:00:00', 'Published'),
(33, 33, 4.8, 'San and Ashitaka''s story is timeless.',                   '2024-05-09 19:20:00', 'Published'),
(34, 34, 4.7, 'Scorsese at his most electrifying.',                       '2024-05-24 21:10:00', 'Published'),
(35, 35, 4.9, 'The kitchen chaos is so real it gives me anxiety.',        '2024-06-18 08:50:00', 'Published'),
(36, 8,  4.3, 'Dune is a slow burn done perfectly.',                      '2024-08-05 16:00:00', 'Published'),
(37, 1,  4.8, 'Interstellar made me call my dad.',                        '2024-08-29 20:30:00', 'Published'),
(38, 6,  5.0, 'Mr. White... I am the danger.',                            '2024-10-14 13:45:00', 'Published'),
(39, 9,  4.9, 'Season 3 of AoT broke me completely.',                     '2024-11-02 22:00:00', 'Published'),
(40, 15, 4.6, 'Gojo Satoru is the most iconic character in anime.',       '2024-12-10 18:20:00', 'Published');

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

-- visibility: 'Public' for shared playlists, 'Hidden' for personal ones
INSERT INTO playlist (playlist_id, user_id, playlist_name, create_date, visibility) VALUES
(1, 2,  'Sci-Fi Favourites',  '2021-04-15 18:00:00', 'Public'),
(2, 2,  'Anime Watchlist',    '2021-07-20 21:30:00', 'Public'),
(1, 4,  'Mind-Bending Films', '2021-08-25 15:45:00', 'Hidden'),
(1, 6,  'Comedy Night',       '2021-10-03 20:10:00', 'Public'),
(3, 2,  'Nolan Universe',     '2022-01-01 00:01:00', 'Public'),
(1, 5,  'Pirate & Adventure', '2021-11-14 19:00:00', 'Public'),
(1, 8,  'Prestige Drama',     '2022-02-28 14:30:00', 'Public'),
(1, 17, 'Thriller & Horror',  '2022-10-31 22:00:00', 'Hidden'),
(1, 21, 'Anime Classics',     '2023-04-10 11:20:00', 'Public'),
(2, 21, 'Adventure Picks',    '2023-06-18 16:45:00', 'Public'),
(1, 29, 'K-Drama & K-Film',   '2024-01-15 09:00:00', 'Public'),
(1, 35, 'Chef''s Table Picks','2024-07-01 12:00:00', 'Hidden');

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