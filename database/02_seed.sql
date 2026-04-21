-- =========================================================================
-- SEED DATA FOR MOVIE STREAMING DATABASE
-- Order of insertion respects foreign key dependencies:
--   Independent entities -> Dependent entities -> Weak -> Associative
-- =========================================================================

-- =========================================================================
-- 1. COUNTRY (25 records)
-- =========================================================================
INSERT INTO country (country_code, country_name) VALUES
('TH', 'Thailand'),
('US', 'United States'),
('GB', 'United Kingdom'),
('JP', 'Japan'),
('KR', 'South Korea'),
('CN', 'China'),
('FR', 'France'),
('DE', 'Germany'),
('IT', 'Italy'),
('ES', 'Spain'),
('IN', 'India'),
('AU', 'Australia'),
('CA', 'Canada'),
('BR', 'Brazil'),
('MX', 'Mexico'),
('RU', 'Russia'),
('SG', 'Singapore'),
('HK', 'Hong Kong'),
('NZ', 'New Zealand'),
('ZA', 'South Africa'),
('SE', 'Sweden'),
('NO', 'Norway'),
('PH', 'Philippines'),
('VN', 'Vietnam'),
('ID', 'Indonesia');

-- =========================================================================
-- 2. LANGUAGE_LIST (24 records)
-- =========================================================================
INSERT INTO language_list (language_id, language_name, native_name) VALUES
(1,  'Thai',       'ไทย'),
(2,  'English',    'English'),
(3,  'Chinese',    '中文'),
(4,  'Japanese',   '日本語'),
(5,  'Korean',     '한국어'),
(6,  'French',     'Français'),
(7,  'German',     'Deutsch'),
(8,  'Italian',    'Italiano'),
(9,  'Spanish',    'Español'),
(10, 'Hindi',      'हिन्दी'),
(11, 'Portuguese', 'Português'),
(12, 'Russian',    'Русский'),
(13, 'Arabic',     'العربية'),
(14, 'Vietnamese', 'Tiếng Việt'),
(15, 'Indonesian', 'Bahasa Indonesia'),
(16, 'Malay',      'Bahasa Melayu'),
(17, 'Tagalog',    'Tagalog'),
(18, 'Dutch',      'Nederlands'),
(19, 'Swedish',    'Svenska'),
(20, 'Norwegian',  'Norsk'),
(21, 'Cantonese',  '粵語'),
(22, 'Tamil',      'தமிழ்'),
(23, 'Turkish',    'Türkçe'),
(24, 'Bengali',    'বাংলা');

-- Sync identity sequence
SELECT setval(pg_get_serial_sequence('language_list', 'language_id'), 24);

-- =========================================================================
-- 3. GENRE (23 records)
-- =========================================================================
INSERT INTO genre (genre_id, genre_name) VALUES
(1,  'Action'),
(2,  'Adventure'),
(3,  'Comedy'),
(4,  'Drama'),
(5,  'Horror'),
(6,  'Thriller'),
(7,  'Sci-Fi'),
(8,  'Fantasy'),
(9,  'Romance'),
(10, 'Mystery'),
(11, 'Crime'),
(12, 'Documentary'),
(13, 'Animation'),
(14, 'Family'),
(15, 'Musical'),
(16, 'War'),
(17, 'Western'),
(18, 'Biography'),
(19, 'History'),
(20, 'Sport'),
(21, 'Superhero'),
(22, 'Noir'),
(23, 'Anime');

SELECT setval(pg_get_serial_sequence('genre', 'genre_id'), 23);

-- =========================================================================
-- 4. MOVIE_RATING (22 records)
-- =========================================================================
INSERT INTO movie_rating (rating_id, rating_label, maturity_level, rating_description) VALUES
(1,  'G',       0,  'General audiences – all ages admitted'),
(2,  'PG',      7,  'Parental guidance suggested'),
(3,  'PG-13',   13, 'Parents strongly cautioned for children under 13'),
(4,  'R',       17, 'Restricted – under 17 requires accompanying adult'),
(5,  'NC-17',   18, 'No one 17 and under admitted'),
(6,  'NR',      0,  'Not rated'),
(7,  'U',       0,  'Universal – suitable for all ages (India)'),
(8,  'UA',      12, 'Parental guidance for children below 12 (India)'),
(9,  'A',       18, 'Restricted to adult audiences (India)'),
(10, 'S',       18, 'Restricted to specialized audiences (India)'),
(11, '12A',     12, 'Suitable for 12 and over (UK)'),
(12, '15',      15, 'Suitable only for 15 years and over (UK)'),
(13, '18',      18, 'Suitable only for adults (UK)'),
(14, 'TV-Y',    0,  'Designed for all children'),
(15, 'TV-Y7',   7,  'Directed to older children'),
(16, 'TV-G',    0,  'General audiences (TV)'),
(17, 'TV-PG',   10, 'Parental guidance suggested (TV)'),
(18, 'TV-14',   14, 'Parents strongly cautioned (TV)'),
(19, 'TV-MA',   17, 'Mature audiences only'),
(20, 'M',       15, 'Recommended for mature audiences (AU)'),
(21, 'MA15+',   15, 'Not suitable for under 15 (AU)'),
(22, 'R18+',    18, 'Restricted to 18 and over (AU)');

SELECT setval(pg_get_serial_sequence('movie_rating', 'rating_id'), 22);

-- =========================================================================
-- 5. PERSON (25 records)
-- =========================================================================
INSERT INTO person (person_id, img_path, first_name, middle_name, last_name, nationality, birth_date, birth_place, biography) VALUES
(1,  '/img/persons/p1.jpg',  'Christopher', 'Edward',   'Nolan',        'British',     '1970-07-30', 'London, UK',                'British-American filmmaker known for complex narratives and practical effects.'),
(2,  '/img/persons/p2.jpg',  'Denis',       NULL,       'Villeneuve',   'Canadian',    '1967-10-03', 'Trois-Rivières, Canada',    'Acclaimed Canadian director known for atmospheric sci-fi and thrillers.'),
(3,  '/img/persons/p3.jpg',  'Bong',        NULL,       'Joon-ho',      'South Korean','1969-09-14', 'Daegu, South Korea',        'Oscar-winning South Korean filmmaker.'),
(4,  '/img/persons/p4.jpg',  'Hayao',       NULL,       'Miyazaki',     'Japanese',    '1941-01-05', 'Tokyo, Japan',              'Legendary Japanese animator and co-founder of Studio Ghibli.'),
(5,  '/img/persons/p5.jpg',  'Greta',       NULL,       'Gerwig',       'American',    '1983-08-04', 'Sacramento, USA',           'American actress and director.'),
(6,  '/img/persons/p6.jpg',  'Leonardo',    'Wilhelm',  'DiCaprio',     'American',    '1974-11-11', 'Los Angeles, USA',          'Academy Award-winning American actor.'),
(7,  '/img/persons/p7.jpg',  'Scarlett',    'Ingrid',   'Johansson',    'American',    '1984-11-22', 'New York City, USA',        'American actress and producer.'),
(8,  '/img/persons/p8.jpg',  'Tom',         NULL,       'Hanks',        'American',    '1956-07-09', 'Concord, USA',              'Two-time Oscar winning American actor.'),
(9,  '/img/persons/p9.jpg',  'Cate',        'Elise',    'Blanchett',    'Australian',  '1969-05-14', 'Melbourne, Australia',      'Two-time Academy Award winning Australian actress.'),
(10, '/img/persons/p10.jpg', 'Tony',        NULL,       'Jaa',          'Thai',        '1976-02-05', 'Surin, Thailand',           'Thai martial artist, actor, and stunt coordinator.'),
(11, '/img/persons/p11.jpg', 'Aokbab',      NULL,       'Chutimon',     'Thai',        '1996-01-14', 'Bangkok, Thailand',         'Thai actress known for Bad Genius.'),
(12, '/img/persons/p12.jpg', 'Song',        NULL,       'Kang-ho',      'South Korean','1967-01-17', 'Gimhae, South Korea',       'Veteran South Korean actor.'),
(13, '/img/persons/p13.jpg', 'Ken',         NULL,       'Watanabe',     'Japanese',    '1959-10-21', 'Uonuma, Japan',             'Japanese actor of international acclaim.'),
(14, '/img/persons/p14.jpg', 'Zhang',       NULL,       'Ziyi',         'Chinese',     '1979-02-09', 'Beijing, China',            'Chinese actress known worldwide for martial arts films.'),
(15, '/img/persons/p15.jpg', 'Marion',      NULL,       'Cotillard',    'French',      '1975-09-30', 'Paris, France',             'Academy Award-winning French actress.'),
(16, '/img/persons/p16.jpg', 'Javier',      NULL,       'Bardem',       'Spanish',     '1969-03-01', 'Las Palmas, Spain',         'Oscar-winning Spanish actor.'),
(17, '/img/persons/p17.jpg', 'Priyanka',    NULL,       'Chopra',       'Indian',      '1982-07-18', 'Jamshedpur, India',         'Indian actress and global producer.'),
(18, '/img/persons/p18.jpg', 'Timothée',    'Hal',      'Chalamet',     'American',    '1995-12-27', 'New York City, USA',        'American actor known for Dune and Call Me by Your Name.'),
(19, '/img/persons/p19.jpg', 'Zendaya',     'Maree',    'Stoermer',     'American',    '1996-09-01', 'Oakland, USA',              'American actress and singer.'),
(20, '/img/persons/p20.jpg', 'Florence',    NULL,       'Pugh',         'British',     '1996-01-03', 'Oxford, UK',                'British actress known for Midsommar and Little Women.'),
(21, '/img/persons/p21.jpg', 'Pedro',       NULL,       'Almodóvar',    'Spanish',     '1949-09-25', 'Calzada de Calatrava, Spain','Acclaimed Spanish filmmaker.'),
(22, '/img/persons/p22.jpg', 'Park',        NULL,       'Chan-wook',    'South Korean','1963-08-23', 'Seoul, South Korea',        'South Korean director of the Vengeance Trilogy.'),
(23, '/img/persons/p23.jpg', 'Quentin',     'Jerome',   'Tarantino',    'American',    '1963-03-27', 'Knoxville, USA',            'American filmmaker and screenwriter.'),
(24, '/img/persons/p24.jpg', 'Prachya',     NULL,       'Pinkaew',      'Thai',        '1962-09-02', 'Thailand',                  'Thai film director known for Ong-Bak.'),
(25, '/img/persons/p25.jpg', 'Margot',      'Elise',    'Robbie',       'Australian',  '1990-07-02', 'Dalby, Australia',          'Australian actress and producer.');

SELECT setval(pg_get_serial_sequence('person', 'person_id'), 25);

-- =========================================================================
-- 6. MOVIE (25 records)
-- =========================================================================
INSERT INTO movie (movie_id, title, img_path, movie_description, release_date, price, rating_id, country_code) VALUES
(1,  'Inception',               '/img/movies/m1.jpg',  'A thief who steals corporate secrets through dream-sharing technology.',    '2010-07-16', 299.00, 3,  'US'),
(2,  'Dune: Part Two',           '/img/movies/m2.jpg',  'Paul Atreides unites with the Fremen to seek revenge.',                     '2024-03-01', 349.00, 3,  'US'),
(3,  'Parasite',                 '/img/movies/m3.jpg',  'A poor family schemes to become employed by a wealthy family.',             '2019-05-30', 249.00, 4,  'KR'),
(4,  'Spirited Away',            '/img/movies/m4.jpg',  'A young girl enters a world ruled by gods and witches.',                    '2001-07-20', 199.00, 2,  'JP'),
(5,  'Little Women',             '/img/movies/m5.jpg',  'The lives of the four March sisters in Civil War-era America.',             '2019-12-25', 229.00, 2,  'US'),
(6,  'The Dark Knight',          '/img/movies/m6.jpg',  'Batman faces the Joker in a battle for Gotham.',                            '2008-07-18', 289.00, 3,  'US'),
(7,  'Ong-Bak',                  '/img/movies/m7.jpg',  'A Muay Thai expert goes to Bangkok to retrieve a stolen Buddha head.',      '2003-01-21', 179.00, 4,  'TH'),
(8,  'Bad Genius',               '/img/movies/m8.jpg',  'A genius high-schooler runs an exam-cheating scheme.',                      '2017-05-03', 189.00, 18, 'TH'),
(9,  'Memories of Murder',       '/img/movies/m9.jpg',  'Detectives investigate a series of murders in rural Korea.',                '2003-04-25', 219.00, 4,  'KR'),
(10, 'Your Name',                '/img/movies/m10.jpg', 'Two teenagers share a profound connection across time and space.',          '2016-08-26', 209.00, 2,  'JP'),
(11, 'Amélie',                   '/img/movies/m11.jpg', 'A shy waitress decides to secretly transform the lives of those around.',   '2001-04-25', 239.00, 4,  'FR'),
(12, 'The Lives of Others',      '/img/movies/m12.jpg', 'A Stasi officer in East Berlin observes a writer and his lover.',           '2006-03-23', 259.00, 4,  'DE'),
(13, 'Life Is Beautiful',        '/img/movies/m13.jpg', 'A Jewish-Italian father shields his son from a concentration camp.',        '1997-12-20', 269.00, 3,  'IT'),
(14, 'Pan''s Labyrinth',         '/img/movies/m14.jpg', 'A young girl in Francoist Spain discovers a mysterious labyrinth.',         '2006-10-11', 249.00, 4,  'ES'),
(15, '3 Idiots',                 '/img/movies/m15.jpg', 'Two friends search for their long-lost companion.',                         '2009-12-25', 219.00, 8,  'IN'),
(16, 'Mad Max: Fury Road',       '/img/movies/m16.jpg', 'In a post-apocalyptic wasteland, Max teams up with Furiosa.',               '2015-05-15', 269.00, 4,  'AU'),
(17, 'The Handmaiden',           '/img/movies/m17.jpg', 'A con man recruits a pickpocket to help seduce a Japanese heiress.',        '2016-06-01', 279.00, 4,  'KR'),
(18, 'Oldboy',                   '/img/movies/m18.jpg', 'A man held captive for 15 years seeks vengeance upon release.',             '2003-11-21', 249.00, 4,  'KR'),
(19, 'City of God',              '/img/movies/m19.jpg', 'Two boys take different paths in the Rio favelas.',                         '2002-08-30', 239.00, 4,  'BR'),
(20, 'Roma',                     '/img/movies/m20.jpg', 'A live-in housekeeper works for a middle-class family in 1970s Mexico.',    '2018-11-21', 229.00, 4,  'MX'),
(21, 'Princess Mononoke',        '/img/movies/m21.jpg', 'A prince becomes involved in the struggle between forest gods and humans.', '1997-07-12', 219.00, 3,  'JP'),
(22, 'Crouching Tiger Hidden Dragon','/img/movies/m22.jpg','A young Chinese warrior steals a sword from a renowned master.',         '2000-07-07', 259.00, 3,  'CN'),
(23, 'Interstellar',             '/img/movies/m23.jpg', 'A team travels through a wormhole in search of a new home for humanity.',  '2014-11-07', 319.00, 3,  'US'),
(24, 'Shoplifters',              '/img/movies/m24.jpg', 'A family of small-time crooks take in a young girl they find in the street.','2018-06-08',229.00, 4,  'JP'),
(25, 'The Grand Budapest Hotel', '/img/movies/m25.jpg', 'A legendary concierge becomes trusted friend to a young lobby boy.',        '2014-03-28', 249.00, 4,  'US');

SELECT setval(pg_get_serial_sequence('movie', 'movie_id'), 25);

-- =========================================================================
-- 7. APP_USER (25 records)
-- =========================================================================
INSERT INTO app_user (user_id, username, email, img_path, user_password, user_status, user_role, country_code) VALUES
(1,  'somchai_t',      'somchai@example.com',     '/img/users/u1.jpg',  '$2a$10$hashedpassword01', 'active',    'admin',    'TH'),
(2,  'nattapong_s',    'nattapong@example.com',   '/img/users/u2.jpg',  '$2a$10$hashedpassword02', 'active',    'customer', 'TH'),
(3,  'malee_c',        'malee@example.com',       '/img/users/u3.jpg',  '$2a$10$hashedpassword03', 'active',    'customer', 'TH'),
(4,  'john_smith',     'john.smith@example.com',  '/img/users/u4.jpg',  '$2a$10$hashedpassword04', 'active',    'customer', 'US'),
(5,  'emily_jones',    'emily.j@example.com',     '/img/users/u5.jpg',  '$2a$10$hashedpassword05', 'suspended', 'customer', 'US'),
(6,  'robert_brown',   'robert.b@example.com',    '/img/users/u6.jpg',  '$2a$10$hashedpassword06', 'active',    'admin',    'GB'),
(7,  'sarah_davis',    'sarah.d@example.com',     '/img/users/u7.jpg',  '$2a$10$hashedpassword07', 'active',    'customer', 'GB'),
(8,  'yuki_tanaka',    'yuki.t@example.com',      '/img/users/u8.jpg',  '$2a$10$hashedpassword08', 'active',    'customer', 'JP'),
(9,  'hiroshi_sato',   'hiroshi.s@example.com',   '/img/users/u9.jpg',  '$2a$10$hashedpassword09', 'active',    'customer', 'JP'),
(10, 'minjun_kim',     'minjun.k@example.com',    '/img/users/u10.jpg', '$2a$10$hashedpassword10', 'active',    'customer', 'KR'),
(11, 'seoyeon_lee',    'seoyeon.l@example.com',   '/img/users/u11.jpg', '$2a$10$hashedpassword11', 'banned',    'customer', 'KR'),
(12, 'li_wei',         'li.wei@example.com',      '/img/users/u12.jpg', '$2a$10$hashedpassword12', 'active',    'customer', 'CN'),
(13, 'pierre_dubois',  'pierre.d@example.com',    '/img/users/u13.jpg', '$2a$10$hashedpassword13', 'active',    'customer', 'FR'),
(14, 'hans_muller',    'hans.m@example.com',      '/img/users/u14.jpg', '$2a$10$hashedpassword14', 'active',    'customer', 'DE'),
(15, 'giulia_rossi',   'giulia.r@example.com',    '/img/users/u15.jpg', '$2a$10$hashedpassword15', 'active',    'customer', 'IT'),
(16, 'carlos_garcia',  'carlos.g@example.com',    '/img/users/u16.jpg', '$2a$10$hashedpassword16', 'active',    'customer', 'ES'),
(17, 'arjun_patel',    'arjun.p@example.com',     '/img/users/u17.jpg', '$2a$10$hashedpassword17', 'active',    'customer', 'IN'),
(18, 'liam_wilson',    'liam.w@example.com',      '/img/users/u18.jpg', '$2a$10$hashedpassword18', 'active',    'customer', 'AU'),
(19, 'olivia_martin',  'olivia.m@example.com',    '/img/users/u19.jpg', '$2a$10$hashedpassword19', 'active',    'customer', 'CA'),
(20, 'lucas_silva',    'lucas.s@example.com',     '/img/users/u20.jpg', '$2a$10$hashedpassword20', 'active',    'customer', 'BR'),
(21, 'sofia_hernandez','sofia.h@example.com',     '/img/users/u21.jpg', '$2a$10$hashedpassword21', 'active',    'customer', 'MX'),
(22, 'kanya_p',        'kanya@example.com',       '/img/users/u22.jpg', '$2a$10$hashedpassword22', 'active',    'customer', 'TH'),
(23, 'wei_ming',       'wei.ming@example.com',    '/img/users/u23.jpg', '$2a$10$hashedpassword23', 'active',    'customer', 'SG'),
(24, 'chloe_wong',     'chloe.w@example.com',     '/img/users/u24.jpg', '$2a$10$hashedpassword24', 'active',    'customer', 'HK'),
(25, 'ethan_taylor',   'ethan.t@example.com',     '/img/users/u25.jpg', '$2a$10$hashedpassword25', 'suspended', 'customer', 'NZ');

SELECT setval(pg_get_serial_sequence('app_user', 'user_id'), 25);

-- =========================================================================
-- 8. TRANSACTION_LIST (25 records)
-- =========================================================================
INSERT INTO transaction_list (transaction_id, user_id, transaction_date, total_amount, payment_method, payment_status) VALUES
(1,  1,  '2024-01-15 10:23:00+07', 299.00, 'credit_card',   'Completed'),
(2,  2,  '2024-02-03 14:10:00+07', 548.00, 'paypal',        'Completed'),
(3,  3,  '2024-02-18 09:45:00+07', 249.00, 'debit_card',    'Completed'),
(4,  4,  '2024-03-05 18:30:00-05', 319.00, 'credit_card',   'Completed'),
(5,  5,  '2024-03-12 20:05:00-05', 458.00, 'paypal',        'Refunded'),
(6,  6,  '2024-03-20 11:15:00+00', 289.00, 'bank_transfer', 'Completed'),
(7,  7,  '2024-04-02 13:50:00+00', 209.00, 'credit_card',   'Completed'),
(8,  8,  '2024-04-14 16:40:00+09', 199.00, 'credit_card',   'Completed'),
(9,  9,  '2024-04-22 21:00:00+09', 428.00, 'debit_card',    'Completed'),
(10, 10, '2024-05-01 10:00:00+09', 249.00, 'paypal',        'Pending'),
(11, 11, '2024-05-10 12:20:00+09', 349.00, 'credit_card',   'Cancelled'),
(12, 12, '2024-05-15 15:30:00+08', 259.00, 'bank_transfer', 'Completed'),
(13, 13, '2024-05-22 19:45:00+02', 239.00, 'credit_card',   'Completed'),
(14, 14, '2024-06-03 08:10:00+02', 259.00, 'paypal',        'Completed'),
(15, 15, '2024-06-10 17:25:00+02', 269.00, 'credit_card',   'Completed'),
(16, 16, '2024-06-18 11:35:00+02', 249.00, 'debit_card',    'Completed'),
(17, 17, '2024-06-25 14:55:00+05:30', 219.00, 'credit_card','Completed'),
(18, 18, '2024-07-02 20:15:00+10', 269.00, 'paypal',        'Completed'),
(19, 19, '2024-07-10 09:00:00-04', 229.00, 'credit_card',   'Completed'),
(20, 20, '2024-07-17 13:40:00-03', 239.00, 'bank_transfer', 'Pending'),
(21, 21, '2024-07-24 18:20:00-06', 229.00, 'credit_card',   'Completed'),
(22, 22, '2024-08-01 10:55:00+07', 368.00, 'paypal',        'Completed'),
(23, 23, '2024-08-08 14:10:00+08', 259.00, 'credit_card',   'Completed'),
(24, 24, '2024-08-15 19:30:00+08', 249.00, 'debit_card',    'Completed'),
(25, 25, '2024-08-22 22:45:00+12', 319.00, 'credit_card',   'Refunded');

SELECT setval(pg_get_serial_sequence('transaction_list', 'transaction_id'), 25);

-- =========================================================================
-- 9. PLAYLIST (25 records) -- weak entity (user_id, playlist_name)
-- =========================================================================
INSERT INTO playlist (user_id, playlist_name, create_date, visibility) VALUES
(1,  'Favorites',          '2024-01-10 09:00:00+07', 'Public'),
(1,  'Weekend Watchlist',  '2024-01-12 18:30:00+07', 'Unlisted'),
(2,  'Sci-Fi Marathon',    '2024-02-05 20:15:00+07', 'Public'),
(2,  'Thai Classics',      '2024-02-06 21:00:00+07', 'Hidden'),
(3,  'Romantic Nights',    '2024-02-20 22:00:00+07', 'Public'),
(4,  'Oscar Winners',      '2024-03-06 11:20:00-05', 'Public'),
(4,  'Nolan Collection',   '2024-03-07 12:30:00-05', 'Unlisted'),
(5,  'Feel-Good Films',    '2024-03-15 16:45:00-05', 'Public'),
(6,  'British Cinema',     '2024-03-22 13:10:00+00', 'Public'),
(7,  'Indie Gems',         '2024-04-04 15:50:00+00', 'Hidden'),
(8,  'Studio Ghibli',      '2024-04-15 10:05:00+09', 'Public'),
(9,  'Anime Night',        '2024-04-23 22:30:00+09', 'Public'),
(10, 'K-Cinema Top 10',    '2024-05-02 11:40:00+09', 'Public'),
(11, 'Park Chan-wook',     '2024-05-12 14:20:00+09', 'Unlisted'),
(12, 'Chinese Epics',      '2024-05-16 17:00:00+08', 'Public'),
(13, 'French New Wave',    '2024-05-23 20:10:00+02', 'Public'),
(14, 'Cold War Films',     '2024-06-04 09:30:00+02', 'Hidden'),
(15, 'Italian Classics',   '2024-06-11 19:55:00+02', 'Public'),
(16, 'Almodóvar',          '2024-06-19 12:05:00+02', 'Public'),
(17, 'Bollywood Hits',     '2024-06-26 15:45:00+05:30', 'Public'),
(18, 'Aussie Blockbusters','2024-07-03 21:00:00+10', 'Public'),
(19, 'Canadian Directors', '2024-07-11 10:25:00-04', 'Unlisted'),
(20, 'World Cinema',       '2024-07-18 14:50:00-03', 'Public'),
(22, 'Thai Action',        '2024-08-02 11:30:00+07', 'Public'),
(23, 'Weekend Chill',      '2024-08-09 16:00:00+08', 'Public');

-- =========================================================================
-- 10. MEDIA_PATH (25 records) -- weak entity (streaming sources per movie)
-- =========================================================================
INSERT INTO media_path (source_id, movie_id, quality, file_path, priority) VALUES
(1,  1,  'FHD', '/media/inception_1080p.mp4',        1),
(2,  1,  'UHD', '/media/inception_4k.mp4',           2),
(3,  2,  'FHD', '/media/dune2_1080p.mp4',            1),
(4,  2,  'UHD', '/media/dune2_4k.mp4',               2),
(5,  3,  'FHD', '/media/parasite_1080p.mp4',         1),
(6,  4,  'HD',  '/media/spirited_away_720p.mp4',     1),
(7,  4,  'FHD', '/media/spirited_away_1080p.mp4',    2),
(8,  5,  'FHD', '/media/little_women_1080p.mp4',     1),
(9,  6,  'FHD', '/media/dark_knight_1080p.mp4',      1),
(10, 6,  'UHD', '/media/dark_knight_4k.mp4',         2),
(11, 7,  'HD',  '/media/ongbak_720p.mp4',            1),
(12, 8,  'FHD', '/media/bad_genius_1080p.mp4',       1),
(13, 9,  'FHD', '/media/memories_murder_1080p.mp4',  1),
(14, 10, 'FHD', '/media/your_name_1080p.mp4',        1),
(15, 11, 'FHD', '/media/amelie_1080p.mp4',           1),
(16, 12, 'HD',  '/media/lives_of_others_720p.mp4',   1),
(17, 13, 'FHD', '/media/life_beautiful_1080p.mp4',   1),
(18, 14, 'FHD', '/media/pans_labyrinth_1080p.mp4',   1),
(19, 15, 'FHD', '/media/3_idiots_1080p.mp4',         1),
(20, 16, 'UHD', '/media/fury_road_4k.mp4',           1),
(21, 17, 'FHD', '/media/handmaiden_1080p.mp4',       1),
(22, 18, 'FHD', '/media/oldboy_1080p.mp4',           1),
(23, 23, 'FHD', '/media/interstellar_1080p.mp4',     1),
(24, 23, 'UHD', '/media/interstellar_4k.mp4',        2),
(25, 25, 'FHD', '/media/grand_budapest_1080p.mp4',   1);

SELECT setval(pg_get_serial_sequence('media_path', 'source_id'), 25);

-- =========================================================================
-- 11. MOVIE_GENRE (30 records)
-- =========================================================================
INSERT INTO movie_genre (movie_id, genre_id) VALUES
(1,  1),  -- Inception: Action
(1,  7),  -- Inception: Sci-Fi
(2,  2),  -- Dune 2: Adventure
(2,  7),  -- Dune 2: Sci-Fi
(3,  4),  -- Parasite: Drama
(3,  6),  -- Parasite: Thriller
(4,  8),  -- Spirited Away: Fantasy
(4,  13), -- Spirited Away: Animation
(5,  4),  -- Little Women: Drama
(5,  9),  -- Little Women: Romance
(6,  1),  -- Dark Knight: Action
(6,  21), -- Dark Knight: Superhero
(7,  1),  -- Ong-Bak: Action
(8,  4),  -- Bad Genius: Drama
(8,  6),  -- Bad Genius: Thriller
(9,  11), -- Memories of Murder: Crime
(9,  10), -- Memories of Murder: Mystery
(10, 9),  -- Your Name: Romance
(10, 13), -- Your Name: Animation
(11, 3),  -- Amélie: Comedy
(11, 9),  -- Amélie: Romance
(12, 4),  -- Lives of Others: Drama
(13, 4),  -- Life Is Beautiful: Drama
(13, 16), -- Life Is Beautiful: War
(14, 8),  -- Pan's Labyrinth: Fantasy
(15, 3),  -- 3 Idiots: Comedy
(16, 1),  -- Fury Road: Action
(17, 6),  -- The Handmaiden: Thriller
(18, 6),  -- Oldboy: Thriller
(23, 7);  -- Interstellar: Sci-Fi

-- =========================================================================
-- 12. MOVIE_RESOURCE (25 records) -- Audio/Subtitle tracks
-- UNIQUE (movie_id, language_id, lang_type, priority)
-- =========================================================================
INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES
(1,  2,  'Audio',    '/resources/inception_en_audio.mp3',       1),
(1,  1,  'Subtitle', '/resources/inception_th_sub.srt',         1),
(1,  2,  'Subtitle', '/resources/inception_en_sub.srt',         1),
(2,  2,  'Audio',    '/resources/dune2_en_audio.mp3',           1),
(2,  1,  'Subtitle', '/resources/dune2_th_sub.srt',             1),
(3,  5,  'Audio',    '/resources/parasite_ko_audio.mp3',        1),
(3,  2,  'Subtitle', '/resources/parasite_en_sub.srt',          1),
(3,  1,  'Subtitle', '/resources/parasite_th_sub.srt',          1),
(4,  4,  'Audio',    '/resources/spirited_jp_audio.mp3',        1),
(4,  2,  'Audio',    '/resources/spirited_en_audio.mp3',        2),
(4,  1,  'Subtitle', '/resources/spirited_th_sub.srt',          1),
(6,  2,  'Audio',    '/resources/dark_knight_en_audio.mp3',     1),
(6,  1,  'Subtitle', '/resources/dark_knight_th_sub.srt',       1),
(7,  1,  'Audio',    '/resources/ongbak_th_audio.mp3',          1),
(7,  2,  'Subtitle', '/resources/ongbak_en_sub.srt',            1),
(8,  1,  'Audio',    '/resources/bad_genius_th_audio.mp3',      1),
(8,  2,  'Subtitle', '/resources/bad_genius_en_sub.srt',        1),
(10, 4,  'Audio',    '/resources/your_name_jp_audio.mp3',       1),
(10, 1,  'Subtitle', '/resources/your_name_th_sub.srt',         1),
(11, 6,  'Audio',    '/resources/amelie_fr_audio.mp3',          1),
(11, 2,  'Subtitle', '/resources/amelie_en_sub.srt',            1),
(13, 8,  'Audio',    '/resources/life_beautiful_it_audio.mp3',  1),
(15, 10, 'Audio',    '/resources/3idiots_hi_audio.mp3',         1),
(23, 2,  'Audio',    '/resources/interstellar_en_audio.mp3',    1),
(23, 1,  'Subtitle', '/resources/interstellar_th_sub.srt',      1);

-- =========================================================================
-- 13. MOVIE_ROLE (30 records)
-- =========================================================================
INSERT INTO movie_role (movie_id, person_id, role_type, character_name) VALUES
(1,  1,  'Director', NULL),
(1,  6,  'Actor',    'Dom Cobb'),
(2,  2,  'Director', NULL),
(2,  18, 'Actor',    'Paul Atreides'),
(2,  19, 'Actor',    'Chani'),
(3,  3,  'Director', NULL),
(3,  12, 'Actor',    'Kim Ki-taek'),
(4,  4,  'Director', NULL),
(5,  5,  'Director', NULL),
(5,  20, 'Actor',    'Amy March'),
(6,  1,  'Director', NULL),
(7,  24, 'Director', NULL),
(7,  10, 'Actor',    'Ting'),
(8,  11, 'Actor',    'Lynn'),
(9,  3,  'Director', NULL),
(9,  12, 'Actor',    'Park Doo-man'),
(13, 13, 'Actor',    'Ken (supporting)'),
(15, 17, 'Actor',    'Pia'),
(16, 9,  'Actor',    'Valkyrie'),
(17, 22, 'Director', NULL),
(18, 22, 'Director', NULL),
(21, 4,  'Director', NULL),
(22, 14, 'Actor',    'Jen Yu'),
(23, 1,  'Director', NULL),
(23, 7,  'Actor',    'Brand (supporting)'),
(23, 13, 'Actor',    'Murph''s mentor'),
(24, 12, 'Actor',    'Osamu'),
(25, 23, 'Director', NULL),
(25, 8,  'Actor',    'Hotel Guest'),
(25, 15, 'Actor',    'Madame D.');

-- =========================================================================
-- 14. PERSONAL_LIBRARY (25 records) -- purchased movies per user
-- =========================================================================
INSERT INTO personal_library (user_id, movie_id, purchase_date) VALUES
(1,  1,  '2024-01-15 10:30:00+07'),
(2,  1,  '2024-02-03 14:15:00+07'),
(2,  23, '2024-02-03 14:15:00+07'),
(3,  3,  '2024-02-18 09:50:00+07'),
(4,  23, '2024-03-05 18:35:00-05'),
(5,  5,  '2024-03-12 20:10:00-05'),
(5,  25, '2024-03-12 20:10:00-05'),
(6,  6,  '2024-03-20 11:20:00+00'),
(7,  10, '2024-04-02 13:55:00+00'),
(8,  4,  '2024-04-14 16:45:00+09'),
(9,  4,  '2024-04-22 21:05:00+09'),
(9,  21, '2024-04-22 21:05:00+09'),
(10, 3,  '2024-05-01 10:05:00+09'),
(12, 22, '2024-05-15 15:35:00+08'),
(13, 11, '2024-05-22 19:50:00+02'),
(14, 12, '2024-06-03 08:15:00+02'),
(15, 13, '2024-06-10 17:30:00+02'),
(16, 14, '2024-06-18 11:40:00+02'),
(17, 15, '2024-06-25 15:00:00+05:30'),
(18, 16, '2024-07-02 20:20:00+10'),
(19, 5,  '2024-07-10 09:05:00-04'),
(20, 19, '2024-07-17 13:45:00-03'),
(21, 20, '2024-07-24 18:25:00-06'),
(22, 7,  '2024-08-01 10:58:00+07'),
(22, 8,  '2024-08-01 11:00:00+07'),
(23, 17, '2024-08-08 14:15:00+08');

-- =========================================================================
-- 15. PLAYLIST_ITEM (25 records)
-- =========================================================================
INSERT INTO playlist_item (user_id, playlist_name, movie_id, add_date) VALUES
(1,  'Favorites',          1,  '2024-01-10 09:05:00+07'),
(1,  'Favorites',          6,  '2024-01-10 09:06:00+07'),
(1,  'Favorites',          23, '2024-01-10 09:07:00+07'),
(1,  'Weekend Watchlist',  3,  '2024-01-12 18:35:00+07'),
(2,  'Sci-Fi Marathon',    1,  '2024-02-05 20:20:00+07'),
(2,  'Sci-Fi Marathon',    2,  '2024-02-05 20:21:00+07'),
(2,  'Sci-Fi Marathon',    23, '2024-02-05 20:22:00+07'),
(2,  'Thai Classics',      7,  '2024-02-06 21:05:00+07'),
(3,  'Romantic Nights',    10, '2024-02-20 22:05:00+07'),
(3,  'Romantic Nights',    11, '2024-02-20 22:06:00+07'),
(4,  'Oscar Winners',      3,  '2024-03-06 11:25:00-05'),
(4,  'Oscar Winners',      20, '2024-03-06 11:26:00-05'),
(4,  'Nolan Collection',   1,  '2024-03-07 12:35:00-05'),
(4,  'Nolan Collection',   6,  '2024-03-07 12:36:00-05'),
(4,  'Nolan Collection',   23, '2024-03-07 12:37:00-05'),
(5,  'Feel-Good Films',    5,  '2024-03-15 16:50:00-05'),
(5,  'Feel-Good Films',    11, '2024-03-15 16:51:00-05'),
(8,  'Studio Ghibli',      4,  '2024-04-15 10:10:00+09'),
(8,  'Studio Ghibli',      21, '2024-04-15 10:11:00+09'),
(9,  'Anime Night',        10, '2024-04-23 22:35:00+09'),
(10, 'K-Cinema Top 10',    3,  '2024-05-02 11:45:00+09'),
(10, 'K-Cinema Top 10',    9,  '2024-05-02 11:46:00+09'),
(10, 'K-Cinema Top 10',    18, '2024-05-02 11:47:00+09'),
(11, 'Park Chan-wook',     17, '2024-05-12 14:25:00+09'),
(11, 'Park Chan-wook',     18, '2024-05-12 14:26:00+09'),
(22, 'Thai Action',        7,  '2024-08-02 11:35:00+07');

-- =========================================================================
-- 16. REVIEWS (25 records) -- UNIQUE (user_id, movie_id)
-- =========================================================================
INSERT INTO reviews (review_id, user_id, movie_id, rating, comment_text, post_time, post_status) VALUES
(1,  1,  1,  5.0, 'Mind-blowing! Nolan at his best.',                       '2024-01-20 10:00:00+07', 'Published'),
(2,  2,  1,  4.5, 'Complex but rewarding — requires multiple rewatches.',    '2024-02-10 15:30:00+07', 'Published'),
(3,  2,  23, 5.0, 'Emotional and visually stunning.',                        '2024-02-11 18:45:00+07', 'Published'),
(4,  3,  3,  5.0, 'A masterpiece of class commentary.',                      '2024-02-25 21:10:00+07', 'Published'),
(5,  4,  23, 4.5, 'One of the greatest sci-fi films ever made.',             '2024-03-10 19:20:00-05', 'Published'),
(6,  5,  5,  4.0, 'Beautiful adaptation with strong performances.',           '2024-03-18 16:00:00-05', 'Published'),
(7,  5,  25, 4.5, 'Visually delightful, quirky fun.',                        '2024-03-19 17:30:00-05', 'Published'),
(8,  6,  6,  5.0, 'Heath Ledger as Joker is untouchable.',                   '2024-03-25 12:40:00+00', 'Published'),
(9,  7,  10, 5.0, 'Gorgeous animation and heart-wrenching story.',            '2024-04-05 14:20:00+00', 'Published'),
(10, 8,  4,  5.0, 'Magical and timeless — a Miyazaki classic.',              '2024-04-18 11:10:00+09', 'Published'),
(11, 9,  4,  4.5, 'My comfort film for years.',                              '2024-04-25 22:00:00+09', 'Published'),
(12, 9,  21, 4.5, 'Complex themes with stunning hand-drawn animation.',       '2024-04-26 22:30:00+09', 'Published'),
(13, 10, 3,  5.0, 'Easily Korea''s finest recent export.',                   '2024-05-04 12:00:00+09', 'Published'),
(14, 11, 17, 4.5, 'Twists upon twists — brilliantly executed.',              '2024-05-14 15:15:00+09', 'Hidden'),
(15, 12, 22, 4.0, 'A classic wuxia that still holds up.',                    '2024-05-17 17:45:00+08', 'Published'),
(16, 13, 11, 5.0, 'Charming, whimsical and quintessentially French.',         '2024-05-24 20:30:00+02', 'Published'),
(17, 14, 12, 4.5, 'A chilling portrait of surveillance and conscience.',      '2024-06-04 09:00:00+02', 'Published'),
(18, 15, 13, 5.0, 'Heartbreaking and uplifting at the same time.',           '2024-06-12 19:30:00+02', 'Published'),
(19, 16, 14, 4.5, 'Dark fairy-tale with unforgettable imagery.',             '2024-06-20 12:40:00+02', 'Published'),
(20, 17, 15, 4.0, 'Funny, touching, and still relevant.',                    '2024-06-27 15:20:00+05:30', 'Published'),
(21, 18, 16, 4.5, 'Non-stop action, a visual spectacle.',                    '2024-07-04 20:40:00+10', 'Published'),
(22, 19, 5,  4.0, 'Warm, nostalgic and well-acted.',                         '2024-07-12 10:00:00-04', 'Published'),
(23, 20, 19, 5.0, 'Raw, brutal and unforgettable.',                          '2024-07-19 14:30:00-03', 'Published'),
(24, 22, 7,  5.0, 'Pure Muay Thai cinema — Tony Jaa is incredible.',         '2024-08-02 12:00:00+07', 'Published'),
(25, 22, 8,  4.5, 'Smart, tense thriller set in a school.',                  '2024-08-03 09:30:00+07', 'Published');

SELECT setval(pg_get_serial_sequence('reviews', 'review_id'), 25);

-- =========================================================================
-- 17. TRANSACTION_DETAIL (25 records)
-- =========================================================================
INSERT INTO transaction_detail (detail_id, transaction_id, movie_id, movie_name, original_price, discount_applied, sold_price) VALUES
(1,  1,  1,  'Inception',                         299.00, 0.00,  299.00),
(2,  2,  1,  'Inception',                         299.00, 0.00,  299.00),
(3,  2,  23, 'Interstellar',                      319.00, 70.00, 249.00),
(4,  3,  3,  'Parasite',                          249.00, 0.00,  249.00),
(5,  4,  23, 'Interstellar',                      319.00, 0.00,  319.00),
(6,  5,  5,  'Little Women',                      229.00, 0.00,  229.00),
(7,  5,  25, 'The Grand Budapest Hotel',          249.00, 20.00, 229.00),
(8,  6,  6,  'The Dark Knight',                   289.00, 0.00,  289.00),
(9,  7,  10, 'Your Name',                         209.00, 0.00,  209.00),
(10, 8,  4,  'Spirited Away',                     199.00, 0.00,  199.00),
(11, 9,  4,  'Spirited Away',                     199.00, 0.00,  199.00),
(12, 9,  21, 'Princess Mononoke',                 219.00, 0.00,  219.00),   -- total 418... assume bundle -10
(13, 10, 3,  'Parasite',                          249.00, 0.00,  249.00),
(14, 11, 2,  'Dune: Part Two',                    349.00, 0.00,  349.00),
(15, 12, 22, 'Crouching Tiger, Hidden Dragon',    259.00, 0.00,  259.00),
(16, 13, 11, 'Amélie',                            239.00, 0.00,  239.00),
(17, 14, 12, 'The Lives of Others',               259.00, 0.00,  259.00),
(18, 15, 13, 'Life Is Beautiful',                 269.00, 0.00,  269.00),
(19, 16, 14, 'Pan''s Labyrinth',                  249.00, 0.00,  249.00),
(20, 17, 15, '3 Idiots',                          219.00, 0.00,  219.00),
(21, 18, 16, 'Mad Max: Fury Road',                269.00, 0.00,  269.00),
(22, 19, 5,  'Little Women',                      229.00, 0.00,  229.00),
(23, 20, 19, 'City of God',                       239.00, 0.00,  239.00),
(24, 21, 20, 'Roma',                              229.00, 0.00,  229.00),
(25, 22, 7,  'Ong-Bak',                           179.00, 0.00,  179.00),
(26, 22, 8,  'Bad Genius',                        189.00, 0.00,  189.00),
(27, 23, 17, 'The Handmaiden',                    279.00, 20.00, 259.00),
(28, 24, 18, 'Oldboy',                            249.00, 0.00,  249.00),
(29, 25, 23, 'Interstellar',                      319.00, 0.00,  319.00);

SELECT setval(pg_get_serial_sequence('transaction_detail', 'detail_id'), 29);

-- =========================================================================
-- END OF SEED FILE
-- =========================================================================
