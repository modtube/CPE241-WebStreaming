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
('L001', 'Thai',       'ไทย'),
('L002', 'English',    'English'),
('L003', 'Chinese',    '中文'),
('L004', 'Japanese',   '日本語'),
('L005', 'Korean',     '한국어'),
('L006', 'French',     'Français'),
('L007', 'German',     'Deutsch'),
('L008', 'Italian',    'Italiano'),
('L009', 'Spanish',    'Español'),
('L010', 'Hindi',      'हिन्दी'),
('L011', 'Portuguese', 'Português'),
('L012', 'Russian',    'Русский'),
('L013', 'Arabic',     'العربية'),
('L014', 'Vietnamese', 'Tiếng Việt'),
('L015', 'Indonesian', 'Bahasa Indonesia'),
('L016', 'Malay',      'Bahasa Melayu'),
('L017', 'Tagalog',    'Tagalog'),
('L018', 'Dutch',      'Nederlands'),
('L019', 'Swedish',    'Svenska'),
('L020', 'Norwegian',  'Norsk'),
('L021', 'Cantonese',  '粵語'),
('L022', 'Tamil',      'தமிழ்'),
('L023', 'Turkish',    'Türkçe'),
('L024', 'Bengali',    'বাংলা');

-- Sync identity sequence
SELECT setval('language_id_seq', 24);

-- =========================================================================
-- 3. GENRE (23 records)
-- =========================================================================
INSERT INTO genre (genre_id, genre_name) VALUES
('G01', 'Action'),
('G02', 'Adventure'),
('G03', 'Comedy'),
('G04', 'Drama'),
('G05', 'Horror'),
('G06', 'Thriller'),
('G07', 'Sci-Fi'),
('G08', 'Fantasy'),
('G09', 'Romance'),
('G10', 'Mystery'),
('G11', 'Crime'),
('G12', 'Documentary'),
('G13', 'Animation'),
('G14', 'Family'),+
('G15', 'Musical'),
('G16', 'War'),
('G17', 'Western'),
('G18', 'Biography'),
('G19', 'History'),
('G20', 'Sport'),
('G21', 'Superhero'),
('G22', 'Noir');

SELECT setval('genre_id_seq', 23);

-- =========================================================================
-- 4. MOVIE_RATING (22 records)
-- =========================================================================
INSERT INTO movie_rating (rating_id, rating_label, maturity_level, rating_description) VALUES
('R00001', 'G',       0,  'General audiences – all ages admitted'),
('R00002', 'PG',      7,  'Parental guidance suggested'),
('R00003', 'PG-13',   13, 'Parents strongly cautioned for children under 13'),
('R00004', 'R',       17, 'Restricted – under 17 requires accompanying adult'),
('R00005', 'NC-17',   18, 'No one 17 and under admitted'),
('R00006', 'NR',      0,  'Not rated'),
('R00007', 'U',       0,  'Universal – suitable for all ages (India)'),
('R00008', 'UA',      12, 'Parental guidance for children below 12 (India)'),
('R00009', 'A',       18, 'Restricted to adult audiences (India)'),
('R00010', 'S',       18, 'Restricted to specialized audiences (India)'),
('R00011', '12A',     12, 'Suitable for 12 and over (UK)'),
('R00012', '15',      15, 'Suitable only for 15 years and over (UK)'),
('R00013', '18',      18, 'Suitable only for adults (UK)'),
('R00014', 'TV-Y',    0,  'Designed for all children'),
('R00015', 'TV-Y7',   7,  'Directed to older children'),
('R00016', 'TV-G',    0,  'General audiences (TV)'),
('R00017', 'TV-PG',   10, 'Parental guidance suggested (TV)'),
('R00018', 'TV-14',   14, 'Parents strongly cautioned (TV)'),
('R00019', 'TV-MA',   17, 'Mature audiences only'),
('R00020', 'M',       15, 'Recommended for mature audiences (AU)'),
('R00021', 'MA15+',   15, 'Not suitable for under 15 (AU)'),
('R00022', 'R18+',    18, 'Restricted to 18 and over (AU)');

SELECT setval('rating_id_seq', 22);

-- =========================================================================
-- 5. PERSON (25 records)
-- =========================================================================
INSERT INTO person (person_id, img_path, first_name, middle_name, last_name, nationality, birth_date, birth_place, biography) VALUES
('P00001', '/img/persons/p1.jpg',  'Christopher', 'Edward',   'Nolan',        'British',     '1970-07-30', 'London, UK',                'British-American filmmaker known for complex narratives and practical effects.'),
('P00002', '/img/persons/p2.jpg',  'Denis',       NULL,       'Villeneuve',   'Canadian',    '1967-10-03', 'Trois-Rivières, Canada',    'Acclaimed Canadian director known for atmospheric sci-fi and thrillers.'),
('P00003', '/img/persons/p3.jpg',  'Bong',        NULL,       'Joon-ho',      'South Korean','1969-09-14', 'Daegu, South Korea',        'Oscar-winning South Korean filmmaker.'),
('P00004', '/img/persons/p4.jpg',  'Hayao',       NULL,       'Miyazaki',     'Japanese',    '1941-01-05', 'Tokyo, Japan',              'Legendary Japanese animator and co-founder of Studio Ghibli.'),
('P00005', '/img/persons/p5.jpg',  'Greta',       NULL,       'Gerwig',       'American',    '1983-08-04', 'Sacramento, USA',           'American actress and director.'),
('P00006', '/img/persons/p6.jpg',  'Leonardo',    'Wilhelm',  'DiCaprio',     'American',    '1974-11-11', 'Los Angeles, USA',          'Academy Award-winning American actor.'),
('P00007', '/img/persons/p7.jpg',  'Scarlett',    'Ingrid',   'Johansson',    'American',    '1984-11-22', 'New York City, USA',        'American actress and producer.'),
('P00008', '/img/persons/p8.jpg',  'Tom',         NULL,       'Hanks',        'American',    '1956-07-09', 'Concord, USA',              'Two-time Oscar winning American actor.'),
('P00009', '/img/persons/p9.jpg',  'Cate',        'Elise',    'Blanchett',    'Australian',  '1969-05-14', 'Melbourne, Australia',      'Two-time Academy Award winning Australian actress.'),
('P00010', '/img/persons/p10.jpg', 'Tony',        NULL,       'Jaa',          'Thai',        '1976-02-05', 'Surin, Thailand',           'Thai martial artist, actor, and stunt coordinator.'),
('P00011', '/img/persons/p11.jpg', 'Aokbab',      NULL,       'Chutimon',     'Thai',        '1996-01-14', 'Bangkok, Thailand',         'Thai actress known for Bad Genius.'),
('P00012', '/img/persons/p12.jpg', 'Song',        NULL,       'Kang-ho',      'South Korean','1967-01-17', 'Gimhae, South Korea',       'Veteran South Korean actor.'),
('P00013', '/img/persons/p13.jpg', 'Ken',         NULL,       'Watanabe',     'Japanese',    '1959-10-21', 'Uonuma, Japan',             'Japanese actor of international acclaim.'),
('P00014', '/img/persons/p14.jpg', 'Zhang',       NULL,       'Ziyi',         'Chinese',     '1979-02-09', 'Beijing, China',            'Chinese actress known worldwide for martial arts films.'),
('P00015', '/img/persons/p15.jpg', 'Marion',      NULL,       'Cotillard',    'French',      '1975-09-30', 'Paris, France',             'Academy Award-winning French actress.'),
('P00016', '/img/persons/p16.jpg', 'Javier',      NULL,       'Bardem',       'Spanish',     '1969-03-01', 'Las Palmas, Spain',         'Oscar-winning Spanish actor.'),
('P00017', '/img/persons/p17.jpg', 'Priyanka',    NULL,       'Chopra',       'Indian',      '1982-07-18', 'Jamshedpur, India',         'Indian actress and global producer.'),
('P00018', '/img/persons/p18.jpg', 'Timothée',    'Hal',      'Chalamet',     'American',    '1995-12-27', 'New York City, USA',        'American actor known for Dune and Call Me by Your Name.'),
('P00019', '/img/persons/p19.jpg', 'Zendaya',     'Maree',    'Stoermer',     'American',    '1996-09-01', 'Oakland, USA',              'American actress and singer.'),
('P00020', '/img/persons/p20.jpg', 'Florence',    NULL,       'Pugh',         'British',     '1996-01-03', 'Oxford, UK',                'British actress known for Midsommar and Little Women.'),
('P00021', '/img/persons/p21.jpg', 'Pedro',       NULL,       'Almodóvar',    'Spanish',     '1949-09-25', 'Calzada de Calatrava, Spain','Acclaimed Spanish filmmaker.'),
('P00022', '/img/persons/p22.jpg', 'Park',        NULL,       'Chan-wook',    'South Korean','1963-08-23', 'Seoul, South Korea',        'South Korean director of the Vengeance Trilogy.'),
('P00023', '/img/persons/p23.jpg', 'Quentin',     'Jerome',   'Tarantino',    'American',    '1963-03-27', 'Knoxville, USA',            'American filmmaker and screenwriter.'),
('P00024', '/img/persons/p24.jpg', 'Prachya',     NULL,       'Pinkaew',      'Thai',        '1962-09-02', 'Thailand',                  'Thai film director known for Ong-Bak.'),
('P00025', '/img/persons/p25.jpg', 'Margot',      'Elise',    'Robbie',       'Australian',  '1990-07-02', 'Dalby, Australia',          'Australian actress and producer.');

SELECT setval('person_id_seq', 25);

-- =========================================================================
-- 6. MOVIE (25 records)
-- =========================================================================
INSERT INTO movie (movie_id, title, img_path, movie_description, release_date, price, rating_id, country_code) VALUES
('M00001', 'Inception',               '/img/movies/m1.jpg',  'A thief who steals corporate secrets through dream-sharing technology.',     '2010-07-16', 299.00, 'R00003', 'US'),
('M00002', 'Dune: Part Two',           '/img/movies/m2.jpg',  'Paul Atreides unites with the Fremen to seek revenge.',                     '2024-03-01', 349.00, 'R00003', 'US'),
('M00003', 'Parasite',                 '/img/movies/m3.jpg',  'A poor family schemes to become employed by a wealthy family.',             '2019-05-30', 249.00, 'R00004', 'KR'),
('M00004', 'Spirited Away',            '/img/movies/m4.jpg',  'A young girl enters a world ruled by gods and witches.',                    '2001-07-20', 199.00, 'R00002', 'JP'),
('M00005', 'Little Women',             '/img/movies/m5.jpg',  'The lives of the four March sisters in Civil War-era America.',             '2019-12-25', 229.00, 'R00002', 'US'),
('M00006', 'The Dark Knight',          '/img/movies/m6.jpg',  'Batman faces the Joker in a battle for Gotham.',                            '2008-07-18', 289.00, 'R00003', 'US'),
('M00007', 'Ong-Bak',                  '/img/movies/m7.jpg',  'A Muay Thai expert goes to Bangkok to retrieve a stolen Buddha head.',      '2003-01-21', 179.00, 'R00004', 'TH'),
('M00008', 'Bad Genius',               '/img/movies/m8.jpg',  'A genius high-schooler runs an exam-cheating scheme.',                      '2017-05-03', 189.00, 'R00018', 'TH'),
('M00009', 'Memories of Murder',       '/img/movies/m9.jpg',  'Detectives investigate a series of murders in rural Korea.',                '2003-04-25', 219.00, 'R00004', 'KR'),
('M00010', 'Your Name',                '/img/movies/m10.jpg', 'Two teenagers share a profound connection across time and space.',          '2016-08-26', 209.00, 'R00002', 'JP'),
('M00011', 'Amélie',                   '/img/movies/m11.jpg', 'A shy waitress decides to secretly transform the lives of those around.',   '2001-04-25', 239.00, 'R00004', 'FR'),
('M00012', 'The Lives of Others',      '/img/movies/m12.jpg', 'A Stasi officer in East Berlin observes a writer and his lover.',           '2006-03-23', 259.00, 'R00004', 'DE'),
('M00013', 'Life Is Beautiful',        '/img/movies/m13.jpg', 'A Jewish-Italian father shields his son from a concentration camp.',        '1997-12-20', 269.00, 'R00003', 'IT'),
('M00014', 'Pan''s Labyrinth',         '/img/movies/m14.jpg', 'A young girl in Francoist Spain discovers a mysterious labyrinth.',         '2006-10-11', 249.00, 'R00004', 'ES'),
('M00015', '3 Idiots',                 '/img/movies/m15.jpg', 'Two friends search for their long-lost companion.',                         '2009-12-25', 219.00, 'R00008', 'IN'),
('M00016', 'Mad Max: Fury Road',       '/img/movies/m16.jpg', 'In a post-apocalyptic wasteland, Max teams up with Furiosa.',               '2015-05-15', 269.00, 'R00004', 'AU'),
('M00017', 'The Handmaiden',           '/img/movies/m17.jpg', 'A con man recruits a pickpocket to help seduce a Japanese heiress.',        '2016-06-01', 279.00, 'R00004', 'KR'),
('M00018', 'Oldboy',                   '/img/movies/m18.jpg', 'A man held captive for 15 years seeks vengeance upon release.',             '2003-11-21', 249.00, 'R00004', 'KR'),
('M00019', 'City of God',              '/img/movies/m19.jpg', 'Two boys take different paths in the Rio favelas.',                         '2002-08-30', 239.00, 'R00004', 'BR'),
('M00020', 'Roma',                     '/img/movies/m20.jpg', 'A live-in housekeeper works for a middle-class family in 1970s Mexico.',    '2018-11-21', 229.00, 'R00004', 'MX'),
('M00021', 'Princess Mononoke',        '/img/movies/m21.jpg', 'A prince becomes involved in the struggle between forest gods and humans.', '1997-07-12', 219.00, 'R00003', 'JP'),
('M00022', 'Crouching Tiger Hidden Dragon','/img/movies/m22.jpg','A young Chinese warrior steals a sword from a renowned master.',         '2000-07-07', 259.00, 'R00003', 'CN'),
('M00023', 'Interstellar',             '/img/movies/m23.jpg', 'A team travels through a wormhole in search of a new home for humanity.',   '2014-11-07', 319.00, 'R00003', 'US'),
('M00024', 'Shoplifters',              '/img/movies/m24.jpg', 'A family of small-time crooks take in a young girl they find in the street.','2018-06-08',229.00, 'R00004', 'JP'),
('M00025', 'The Grand Budapest Hotel', '/img/movies/m25.jpg', 'A legendary concierge becomes trusted friend to a young lobby boy.',        '2014-03-28', 249.00, 'R00004', 'US');

SELECT setval('movie_id_seq', 25);

-- =========================================================================
-- 7. APP_USER (25 records)
-- =========================================================================
INSERT INTO app_user (user_id, username, email, img_path, user_password, user_status, user_role, country_code, register_date) VALUES
-- มกราคม (January)
('U00001', 'somchai_t',      'somchai@example.com',     '/img/users/u1.jpg',  '$2a$10$hashedpassword01', 'active',    'admin',    'TH', '2024-01-10 10:00:00+07'),
('U00002', 'nattapong_s',    'nattapong@example.com',   '/img/users/u2.jpg',  '$2a$10$hashedpassword02', 'active',    'customer', 'TH', '2024-01-15 14:00:00+07'),
('U00003', 'malee_c',        'malee@example.com',       '/img/users/u3.jpg',  '$2a$10$hashedpassword03', 'active',    'customer', 'TH', '2024-01-25 09:00:00+07'),
-- กุมภาพันธ์ (February)
('U00004', 'john_smith',     'john.smith@example.com',  '/img/users/u4.jpg',  '$2a$10$hashedpassword04', 'active',    'customer', 'US', '2024-02-05 11:00:00+07'),
('U00005', 'emily_jones',    'emily.j@example.com',     '/img/users/u5.jpg',  '$2a$10$hashedpassword05', 'suspended', 'customer', 'US', '2024-02-12 16:00:00+07'),
('U00006', 'robert_brown',   'robert.b@example.com',    '/img/users/u6.jpg',  '$2a$10$hashedpassword06', 'active',    'admin',    'GB', '2024-02-20 08:00:00+07'),
-- มีนาคม (March)
('U00007', 'sarah_davis',    'sarah.d@example.com',     '/img/users/u7.jpg',  '$2a$10$hashedpassword07', 'active',    'customer', 'GB', '2024-03-02 13:00:00+07'),
('U00008', 'yuki_tanaka',    'yuki.t@example.com',      '/img/users/u8.jpg',  '$2a$10$hashedpassword08', 'active',    'customer', 'JP', '2024-03-14 10:00:00+07'),
('U00009', 'hiroshi_sato',   'hiroshi.s@example.com',   '/img/users/u9.jpg',  '$2a$10$hashedpassword09', 'active',    'customer', 'JP', '2024-03-22 19:00:00+07'),
('U00010', 'minjun_kim',     'minjun.k@example.com',    '/img/users/u10.jpg', '$2a$10$hashedpassword10', 'active',    'customer', 'KR', '2024-03-28 15:00:00+07'),
-- เมษายน (April)
('U00011', 'seoyeon_lee',    'seoyeon.l@example.com',   '/img/users/u11.jpg', '$2a$10$hashedpassword11', 'banned',    'customer', 'KR', '2024-04-05 11:00:00+07'),
('U00012', 'li_wei',         'li.wei@example.com',      '/img/users/u12.jpg', '$2a$10$hashedpassword12', 'active',    'customer', 'CN', '2024-04-12 17:00:00+07'),
('U00013', 'pierre_dubois',  'pierre.d@example.com',    '/img/users/u13.jpg', '$2a$10$hashedpassword13', 'active',    'customer', 'FR', '2024-04-18 09:00:00+07'),
('U00014', 'hans_muller',    'hans.m@example.com',      '/img/users/u14.jpg', '$2a$10$hashedpassword14', 'active',    'customer', 'DE', '2024-04-25 14:00:00+07'),
('U00015', 'giulia_rossi',   'giulia.r@example.com',    '/img/users/u15.jpg', '$2a$10$hashedpassword15', 'active',    'customer', 'IT', '2024-04-29 20:00:00+07'),
-- พฤษภาคม (May)
('U00016', 'carlos_garcia',  'carlos.g@example.com',    '/img/users/u16.jpg', '$2a$10$hashedpassword16', 'active',    'customer', 'ES', '2024-05-02 10:00:00+07'),
('U00017', 'arjun_patel',    'arjun.p@example.com',     '/img/users/u17.jpg', '$2a$10$hashedpassword17', 'active',    'customer', 'IN', '2024-05-05 12:00:00+07'),
('U00018', 'liam_wilson',    'liam.w@example.com',      '/img/users/u18.jpg', '$2a$10$hashedpassword18', 'active',    'customer', 'AU', '2024-05-08 14:00:00+07'),
('U00019', 'olivia_martin',  'olivia.m@example.com',    '/img/users/u19.jpg', '$2a$10$hashedpassword19', 'active',    'customer', 'CA', '2024-05-12 09:00:00+07'),
('U00020', 'lucas_silva',    'lucas.s@example.com',     '/img/users/u20.jpg', '$2a$10$hashedpassword20', 'active',    'customer', 'BR', '2024-05-15 16:00:00+07'),
('U00021', 'sofia_hernandez','sofia.h@example.com',     '/img/users/u21.jpg', '$2a$10$hashedpassword21', 'active',    'customer', 'MX', '2024-05-18 11:00:00+07'),
('U00022', 'kanya_p',        'kanya@example.com',       '/img/users/u22.jpg', '$2a$10$hashedpassword22', 'active',    'customer', 'TH', '2024-05-20 13:00:00+07'),
('U00023', 'wei_ming',       'wei.ming@example.com',    '/img/users/u23.jpg', '$2a$10$hashedpassword23', 'active',    'customer', 'SG', '2024-05-22 15:00:00+07'),
('U00024', 'chloe_wong',     'chloe.w@example.com',     '/img/users/u24.jpg', '$2a$10$hashedpassword24', 'active',    'customer', 'HK', '2024-05-25 10:00:00+07'),
('U00025', 'ethan_taylor',   'ethan.t@example.com',     '/img/users/u25.jpg', '$2a$10$hashedpassword25', 'suspended', 'customer', 'NZ', '2024-05-28 17:00:00+07');

SELECT setval('user_id_seq', 25);

-- =========================================================================
-- 8. TRANSACTION_LIST (25 records)
-- =========================================================================
INSERT INTO transaction_list (transaction_id, user_id, transaction_date, total_amount, payment_method, payment_status) VALUES
('T00001', 'U00001',  '2024-01-15 10:23:00+07', 299.00, 'credit_card',   'Completed'),
('T00002', 'U00002',  '2024-02-03 14:10:00+07', 548.00, 'paypal',        'Completed'),
('T00003', 'U00003',  '2024-02-18 09:45:00+07', 249.00, 'debit_card',    'Completed'),
('T00004', 'U00004',  '2024-03-05 18:30:00-05', 319.00, 'credit_card',   'Completed'),
('T00005', 'U00005',  '2024-03-12 20:05:00-05', 458.00, 'paypal',        'Refunded'),
('T00006', 'U00006',  '2024-03-20 11:15:00+00', 289.00, 'bank_transfer', 'Completed'),
('T00007', 'U00007',  '2024-04-02 13:50:00+00', 209.00, 'credit_card',   'Completed'),
('T00008', 'U00008',  '2024-04-14 16:40:00+09', 199.00, 'credit_card',   'Completed'),
('T00009', 'U00009',  '2024-04-22 21:00:00+09', 428.00, 'debit_card',    'Completed'),
('T00010', 'U00010', '2024-05-01 10:00:00+09', 249.00, 'paypal',        'Pending'),
('T00011', 'U00011', '2024-05-10 12:20:00+09', 349.00, 'credit_card',   'Cancelled'),
('T00012', 'U00012', '2024-05-15 15:30:00+08', 259.00, 'bank_transfer', 'Completed'),
('T00013', 'U00013', '2024-05-22 19:45:00+02', 239.00, 'credit_card',   'Completed'),
('T00014', 'U00014', '2024-06-03 08:10:00+02', 259.00, 'paypal',        'Completed'),
('T00015', 'U00015', '2024-06-10 17:25:00+02', 269.00, 'credit_card',   'Completed'),
('T00016', 'U00016', '2024-06-18 11:35:00+02', 249.00, 'debit_card',    'Completed'),
('T00017', 'U00017', '2024-06-25 14:55:00+05:30', 219.00, 'credit_card','Completed'),
('T00018', 'U00018', '2024-07-02 20:15:00+10', 269.00, 'paypal',        'Completed'),
('T00019', 'U00019', '2024-07-10 09:00:00-04', 229.00, 'credit_card',   'Completed'),
('T00020', 'U00020', '2024-07-17 13:40:00-03', 239.00, 'bank_transfer', 'Pending'),
('T00021', 'U00021', '2024-07-24 18:20:00-06', 229.00, 'credit_card',   'Completed'),
('T00022', 'U00022', '2024-08-01 10:55:00+07', 368.00, 'paypal',        'Completed'),
('T00023', 'U00023', '2024-08-08 14:10:00+08', 259.00, 'credit_card',   'Completed'),
('T00024', 'U00024', '2024-08-15 19:30:00+08', 249.00, 'debit_card',    'Completed'),
('T00025', 'U00025', '2024-08-22 22:45:00+12', 319.00, 'credit_card',   'Refunded');

SELECT setval('transaction_id_seq', 25);

-- =========================================================================
-- 9. PLAYLIST (25 records) -- weak entity (user_id, playlist_name)
-- =========================================================================
INSERT INTO playlist (user_id, playlist_name, create_date, visibility) VALUES
('U00001', 'Favorites',          '2024-01-10 09:00:00+07', 'Public'),
('U00001', 'Weekend Watchlist',  '2024-01-12 18:30:00+07', 'Unlisted'),
('U00002', 'Sci-Fi Marathon',    '2024-02-05 20:15:00+07', 'Public'),
('U00002', 'Thai Classics',      '2024-02-06 21:00:00+07', 'Hidden'),
('U00003', 'Romantic Nights',    '2024-02-20 22:00:00+07', 'Public'),
('U00004', 'Oscar Winners',      '2024-03-06 11:20:00-05', 'Public'),
('U00004', 'Nolan Collection',   '2024-03-07 12:30:00-05', 'Unlisted'),
('U00005', 'Feel-Good Films',    '2024-03-15 16:45:00-05', 'Public'),
('U00006', 'British Cinema',     '2024-03-22 13:10:00+00', 'Public'),
('U00007', 'Indie Gems',         '2024-04-04 15:50:00+00', 'Hidden'),
('U00008', 'Studio Ghibli',      '2024-04-15 10:05:00+09', 'Public'),
('U00009', 'Anime Night',        '2024-04-23 22:30:00+09', 'Public'),
('U00010', 'K-Cinema Top 10',    '2024-05-02 11:40:00+09', 'Public'),
('U00011', 'Park Chan-wook',     '2024-05-12 14:20:00+09', 'Unlisted'),
('U00012', 'Chinese Epics',      '2024-05-16 17:00:00+08', 'Public'),
('U00013', 'French New Wave',    '2024-05-23 20:10:00+02', 'Public'),
('U00014', 'Cold War Films',     '2024-06-04 09:30:00+02', 'Hidden'),
('U00015', 'Italian Classics',   '2024-06-11 19:55:00+02', 'Public'),
('U00016', 'Almodóvar',          '2024-06-19 12:05:00+02', 'Public'),
('U00017', 'Bollywood Hits',     '2024-06-26 15:45:00+05:30', 'Public'),
('U00018', 'Aussie Blockbusters','2024-07-03 21:00:00+10', 'Public'),
('U00019', 'Canadian Directors', '2024-07-11 10:25:00-04', 'Unlisted'),
('U00020', 'World Cinema',       '2024-07-18 14:50:00-03', 'Public'),
('U00022', 'Thai Action',        '2024-08-02 11:30:00+07', 'Public'),
('U00023', 'Weekend Chill',      '2024-08-09 16:00:00+08', 'Public');

-- =========================================================================
-- 10. MEDIA_PATH (25 records) -- weak entity (streaming sources per movie)
-- =========================================================================
INSERT INTO media_path (source_id, movie_id, quality, file_path, priority) VALUES
('S00001', 'M00001', 'FHD', '/media/inception_1080p.mp4',        1),
('S00002', 'M00001', 'UHD', '/media/inception_4k.mp4',           2),
('S00003', 'M00002', 'FHD', '/media/dune2_1080p.mp4',            1),
('S00004', 'M00002', 'UHD', '/media/dune2_4k.mp4',               2),
('S00005', 'M00003', 'FHD', '/media/parasite_1080p.mp4',         1),
('S00006', 'M00004', 'HD',  '/media/spirited_away_720p.mp4',     1),
('S00007', 'M00004', 'FHD', '/media/spirited_away_1080p.mp4',    2),
('S00008', 'M00005', 'FHD', '/media/little_women_1080p.mp4',     1),
('S00009', 'M00006', 'FHD', '/media/dark_knight_1080p.mp4',      1),
('S00010', 'M00006', 'UHD', '/media/dark_knight_4k.mp4',         2),
('S00011', 'M00007', 'HD',  '/media/ongbak_720p.mp4',            1),
('S00012', 'M00008', 'FHD', '/media/bad_genius_1080p.mp4',       1),
('S00013', 'M00009', 'FHD', '/media/memories_murder_1080p.mp4',  1),
('S00014', 'M00010', 'FHD', '/media/your_name_1080p.mp4',        1),
('S00015', 'M00011', 'FHD', '/media/amelie_1080p.mp4',           1),
('S00016', 'M00012', 'HD',  '/media/lives_of_others_720p.mp4',   1),
('S00017', 'M00013', 'FHD', '/media/life_beautiful_1080p.mp4',   1),
('S00018', 'M00014', 'FHD', '/media/pans_labyrinth_1080p.mp4',   1),
('S00019', 'M00015', 'FHD', '/media/3_idiots_1080p.mp4',         1),
('S00020', 'M00016', 'UHD', '/media/fury_road_4k.mp4',           1),
('S00021', 'M00017', 'FHD', '/media/handmaiden_1080p.mp4',       1),
('S00022', 'M00018', 'FHD', '/media/oldboy_1080p.mp4',           1),
('S00023', 'M00023', 'FHD', '/media/interstellar_1080p.mp4',     1),
('S00024', 'M00023', 'UHD', '/media/interstellar_4k.mp4',        2),
('S00025', 'M00025', 'FHD', '/media/grand_budapest_1080p.mp4',   1);

SELECT setval('source_id_seq', 25);

-- =========================================================================
-- 11. MOVIE_GENRE (30 records)
-- =========================================================================
INSERT INTO movie_genre (movie_id, genre_id) VALUES
('M00001', 'G01'), -- Inception: Action
('M00001', 'G07'), -- Inception: Sci-Fi
('M00002', 'G02'), -- Dune 2: Adventure
('M00002', 'G07'), -- Dune 2: Sci-Fi
('M00003', 'G04'), -- Parasite: Drama
('M00003', 'G06'), -- Parasite: Thriller
('M00004', 'G08'), -- Spirited Away: Fantasy
('M00004', 'G13'), -- Spirited Away: Animation
('M00005', 'G09'), -- Little Women: Romance
('M00006', 'G01'), -- Dark Knight: Action
('M00005', 'G04'), -- Little Women: Drama
('M00006', 'G21'), -- Dark Knight: Superhero
('M00007', 'G01'), -- Ong-Bak: Action
('M00008', 'G04'), -- Bad Genius: Drama
('M00008', 'G06'), -- Bad Genius: Thriller
('M00009', 'G11'), -- Memories of Murder: Crime
('M00009', 'G10'), -- Memories of Murder: Mystery
('M00010', 'G09'), -- Your Name: Romance
('M00010', 'G13'), -- Your Name: Animation
('M00011', 'G03'), -- Amélie: Comedy
('M00011', 'G09'), -- Amélie: Romance
('M00012', 'G04'), -- Lives of Others: Drama
('M00013', 'G04'), -- Life Is Beautiful: Drama
('M00013', 'G16'), -- Life Is Beautiful: War
('M00014', 'G08'), -- Pan's Labyrinth: Fantasy
('M00015', 'G03'), -- 3 Idiots: Comedy
('M00016', 'G01'), -- Fury Road: Action
('M00017', 'G06'), -- The Handmaiden: Thriller
('M00018', 'G06'), -- Oldboy: Thriller
('M00023', 'G07'); -- Interstellar: Sci-Fi

-- =========================================================================
-- 12. MOVIE_RESOURCE (25 records) -- Audio/Subtitle tracks
-- UNIQUE (movie_id, language_id, lang_type, priority)
-- =========================================================================
INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES
('M00001', 'L002', 'Audio',    '/resources/inception_en_audio.mp3',       1),
('M00001', 'L001', 'Subtitle', '/resources/inception_th_sub.srt',         1),
('M00001', 'L002', 'Subtitle', '/resources/inception_en_sub.srt',         1),
('M00002', 'L002', 'Audio',    '/resources/dune2_en_audio.mp3',           1),
('M00002', 'L001', 'Subtitle', '/resources/dune2_th_sub.srt',             1),
('M00003', 'L005', 'Audio',    '/resources/parasite_ko_audio.mp3',        1),
('M00003', 'L002', 'Subtitle', '/resources/parasite_en_sub.srt',          1),
('M00003', 'L001', 'Subtitle', '/resources/parasite_th_sub.srt',          1),
('M00004', 'L004', 'Audio',    '/resources/spirited_jp_audio.mp3',        1),
('M00004', 'L002', 'Audio',    '/resources/spirited_en_audio.mp3',        2),
('M00004', 'L001', 'Subtitle', '/resources/spirited_th_sub.srt',          1),
('M00006', 'L002', 'Audio',    '/resources/dark_knight_en_audio.mp3',     1),
('M00006', 'L001', 'Subtitle', '/resources/dark_knight_th_sub.srt',       1),
('M00007', 'L001', 'Audio',    '/resources/ongbak_th_audio.mp3',          1),
('M00007', 'L002', 'Subtitle', '/resources/ongbak_en_sub.srt',            1),
('M00008', 'L001', 'Audio',    '/resources/bad_genius_th_audio.mp3',      1),
('M00008', 'L002', 'Subtitle', '/resources/bad_genius_en_sub.srt',        1),
('M00010', 'L004', 'Audio',    '/resources/your_name_jp_audio.mp3',       1),
('M00010', 'L001', 'Subtitle', '/resources/your_name_th_sub.srt',         1),
('M00011', 'L006', 'Audio',    '/resources/amelie_fr_audio.mp3',          1),
('M00011', 'L002', 'Subtitle', '/resources/amelie_en_sub.srt',            1),
('M00013', 'L008', 'Audio',    '/resources/life_beautiful_it_audio.mp3',  1),
('M00015', 'L010', 'Audio',    '/resources/3idiots_hi_audio.mp3',         1),
('M00023', 'L002', 'Audio',    '/resources/interstellar_en_audio.mp3',    1),
('M00023', 'L001', 'Subtitle', '/resources/interstellar_th_sub.srt',      1);

-- =========================================================================
-- 13. MOVIE_ROLE (30 records)
-- =========================================================================
INSERT INTO movie_role (movie_id, person_id, role_type, character_name) VALUES
('M00001', 'P00001', 'Director', NULL),
('M00001', 'P00006', 'Actor',    'Dom Cobb'),
('M00002', 'P00002', 'Director', NULL),
('M00002', 'P00018', 'Actor',    'Paul Atreides'),
('M00002', 'P00019', 'Actor',    'Chani'),
('M00003', 'P00003', 'Director', NULL),
('M00003', 'P00012', 'Actor',    'Kim Ki-taek'),
('M00004', 'P00004', 'Director', NULL),
('M00005', 'P00005', 'Director', NULL),
('M00005', 'P00020', 'Actor',    'Amy March'),
('M00006', 'P00001', 'Director', NULL),
('M00007', 'P00024', 'Director', NULL),
('M00007', 'P00010', 'Actor',    'Ting'),
('M00008', 'P00011', 'Actor',    'Lynn'),
('M00009', 'P00003', 'Director', NULL),
('M00009', 'P00012', 'Actor',    'Park Doo-man'),
('M00013', 'P00013', 'Actor',    'Ken (supporting)'),
('M00015', 'P00017', 'Actor',    'Pia'),
('M00016', 'P00009', 'Actor',    'Valkyrie'),
('M00017', 'P00022', 'Director', NULL),
('M00018', 'P00022', 'Director', NULL),
('M00021', 'P00004', 'Director', NULL),
('M00022', 'P00014', 'Actor',    'Jen Yu'),
('M00023', 'P00001', 'Director', NULL),
('M00023', 'P00007', 'Actor',    'Brand (supporting)'),
('M00023', 'P00013', 'Actor',    'Murph''s mentor'),
('M00024', 'P00012', 'Actor',    'Osamu'),
('M00025', 'P00023', 'Director', NULL),
('M00025', 'P00008', 'Actor',    'Hotel Guest'),
('M00025', 'P00015', 'Actor',    'Madame D.');

-- =========================================================================
-- 14. PERSONAL_LIBRARY (25 records) -- purchased movies per user
-- =========================================================================
INSERT INTO personal_library (user_id, movie_id, purchase_date) VALUES
('U00001', 'M00001', '2024-01-15 10:30:00+07'),
('U00002', 'M00001', '2024-02-03 14:15:00+07'),
('U00002', 'M00023', '2024-02-03 14:15:00+07'),
('U00003', 'M00003', '2024-02-18 09:50:00+07'),
('U00004', 'M00023', '2024-03-05 18:35:00-05'),
('U00005', 'M00005', '2024-03-12 20:10:00-05'),
('U00005', 'M00025', '2024-03-12 20:10:00-05'),
('U00006', 'M00006', '2024-03-20 11:20:00+00'),
('U00007', 'M00010', '2024-04-02 13:55:00+00'),
('U00008', 'M00004', '2024-04-14 16:45:00+09'),
('U00009', 'M00004', '2024-04-22 21:05:00+09'),
('U00009', 'M00021', '2024-04-22 21:05:00+09'),
('U00010', 'M00003', '2024-05-01 10:05:00+09'),
('U00012', 'M00022', '2024-05-15 15:35:00+08'),
('U00013', 'M00011', '2024-05-22 19:50:00+02'),
('U00014', 'M00012', '2024-06-03 08:15:00+02'),
('U00015', 'M00013', '2024-06-10 17:30:00+02'),
('U00016', 'M00014', '2024-06-18 11:40:00+02'),
('U00017', 'M00015', '2024-06-25 15:00:00+05:30'),
('U00018', 'M00016', '2024-07-02 20:20:00+10'),
('U00019', 'M00005', '2024-07-10 09:05:00-04'),
('U00020', 'M00019', '2024-07-17 13:45:00-03'),
('U00021', 'M00020', '2024-07-24 18:25:00-06'),
('U00022', 'M00007', '2024-08-01 10:58:00+07'),
('U00022', 'M00008', '2024-08-01 11:00:00+07'),
('U00023', 'M00017', '2024-08-08 14:15:00+08');

-- =========================================================================
-- 15. PLAYLIST_ITEM (25 records)
-- =========================================================================
INSERT INTO playlist_item (user_id, playlist_name, movie_id, add_date) VALUES
('U00001', 'Favorites',          'M00001', '2024-01-10 09:05:00+07'),
('U00001', 'Favorites',          'M00006', '2024-01-10 09:06:00+07'),
('U00001', 'Favorites',          'M00023', '2024-01-10 09:07:00+07'),
('U00001', 'Weekend Watchlist',  'M00003', '2024-01-12 18:35:00+07'),
('U00002', 'Sci-Fi Marathon',    'M00001', '2024-02-05 20:20:00+07'),
('U00002', 'Sci-Fi Marathon',    'M00002', '2024-02-05 20:21:00+07'),
('U00002', 'Sci-Fi Marathon',    'M00023', '2024-02-05 20:22:00+07'),
('U00002', 'Thai Classics',      'M00007', '2024-02-06 21:05:00+07'),
('U00003', 'Romantic Nights',    'M00010', '2024-02-20 22:05:00+07'),
('U00003', 'Romantic Nights',    'M00011', '2024-02-20 22:06:00+07'),
('U00004', 'Oscar Winners',      'M00003', '2024-03-06 11:25:00-05'),
('U00004', 'Oscar Winners',      'M00020', '2024-03-06 11:26:00-05'),
('U00004', 'Nolan Collection',   'M00001', '2024-03-07 12:35:00-05'),
('U00004', 'Nolan Collection',   'M00006', '2024-03-07 12:36:00-05'),
('U00004', 'Nolan Collection',   'M00023', '2024-03-07 12:37:00-05'),
('U00005', 'Feel-Good Films',    'M00005', '2024-03-15 16:50:00-05'),
('U00005', 'Feel-Good Films',    'M00011', '2024-03-15 16:51:00-05'),
('U00008', 'Studio Ghibli',      'M00004', '2024-04-15 10:10:00+09'),
('U00008', 'Studio Ghibli',      'M00021', '2024-04-15 10:11:00+09'),
('U00009', 'Anime Night',        'M00010', '2024-04-23 22:35:00+09'),
('U00010', 'K-Cinema Top 10',    'M00003', '2024-05-02 11:45:00+09'),
('U00010', 'K-Cinema Top 10',    'M00009', '2024-05-02 11:46:00+09'),
('U00010', 'K-Cinema Top 10',    'M00018', '2024-05-02 11:47:00+09'),
('U00011', 'Park Chan-wook',     'M00017', '2024-05-12 14:25:00+09'),
('U00011', 'Park Chan-wook',     'M00018', '2024-05-12 14:26:00+09'),
('U00022', 'Thai Action',        'M00007', '2024-08-02 11:35:00+07');

-- =========================================================================
-- 16. REVIEWS (25 records) -- UNIQUE (user_id, movie_id)
-- =========================================================================
INSERT INTO reviews (review_id, user_id, movie_id, rating, comment_text, post_time, post_status) VALUES
('V00001', 'U00001', 'M00001', 5.0, 'Mind-blowing! Nolan at his best.',                       '2024-01-20 10:00:00+07', 'Published'),
('V00002', 'U00002', 'M00001', 4.5, 'Complex but rewarding — requires multiple rewatches.',    '2024-02-10 15:30:00+07', 'Published'),
('V00003', 'U00002', 'M00023', 5.0, 'Emotional and visually stunning.',                        '2024-02-11 18:45:00+07', 'Published'),
('V00004', 'U00003', 'M00003', 5.0, 'A masterpiece of class commentary.',                      '2024-02-25 21:10:00+07', 'Published'),
('V00005', 'U00004', 'M00023', 4.5, 'One of the greatest sci-fi films ever made.',             '2024-03-10 19:20:00-05', 'Published'),
('V00006', 'U00005', 'M00005', 4.0, 'Beautiful adaptation with strong performances.',           '2024-03-18 16:00:00-05', 'Published'),
('V00007', 'U00005', 'M00025', 4.5, 'Visually delightful, quirky fun.',                        '2024-03-19 17:30:00-05', 'Published'),
('V00008', 'U00006', 'M00006', 5.0, 'Heath Ledger as Joker is untouchable.',                   '2024-03-25 12:40:00+00', 'Published'),
('V00009', 'U00007', 'M00010', 5.0, 'Gorgeous animation and heart-wrenching story.',            '2024-04-05 14:20:00+00', 'Published'),
('V00010', 'U00008', 'M00004', 5.0, 'Magical and timeless — a Miyazaki classic.',              '2024-04-18 11:10:00+09', 'Published'),
('V00011', 'U00009', 'M00004', 4.5, 'My comfort film for years.',                              '2024-04-25 22:00:00+09', 'Published'),
('V00012', 'U00009', 'M00021', 4.5, 'Complex themes with stunning hand-drawn animation.',       '2024-04-26 22:30:00+09', 'Published'),
('V00013', 'U00010', 'M00003', 5.0, 'Easily Korea''s finest recent export.',                   '2024-05-04 12:00:00+09', 'Published'),
('V00014', 'U00011', 'M00017', 4.5, 'Twists upon twists — brilliantly executed.',              '2024-05-14 15:15:00+09', 'Hidden'),
('V00015', 'U00012', 'M00022', 4.0, 'A classic wuxia that still holds up.',                    '2024-05-17 17:45:00+08', 'Published'),
('V00016', 'U00013', 'M00011', 5.0, 'Charming, whimsical and quintessentially French.',         '2024-05-24 20:30:00+02', 'Published'),
('V00017', 'U00014', 'M00012', 4.5, 'A chilling portrait of surveillance and conscience.',      '2024-06-04 09:00:00+02', 'Published'),
('V00018', 'U00015', 'M00013', 5.0, 'Heartbreaking and uplifting at the same time.',           '2024-06-12 19:30:00+02', 'Published'),
('V00019', 'U00016', 'M00014', 4.5, 'Dark fairy-tale with unforgettable imagery.',             '2024-06-20 12:40:00+02', 'Published'),
('V00020', 'U00017', 'M00015', 4.0, 'Funny, touching, and still relevant.',                    '2024-06-27 15:20:00+05:30', 'Published'),
('V00021', 'U00018', 'M00016', 4.5, 'Non-stop action, a visual spectacle.',                    '2024-07-04 20:40:00+10', 'Published'),
('V00022', 'U00019', 'M00005', 4.0, 'Warm, nostalgic and well-acted.',                         '2024-07-12 10:00:00-04', 'Published'),
('V00023', 'U00020', 'M00019', 5.0, 'Raw, brutal and unforgettable.',                          '2024-07-19 14:30:00-03', 'Published'),
('V00024', 'U00022', 'M00007', 5.0, 'Pure Muay Thai cinema — Tony Jaa is incredible.',         '2024-08-02 12:00:00+07', 'Published'),
('V00025', 'U00022', 'M00008', 4.5, 'Smart, tense thriller set in a school.',                  '2024-08-03 09:30:00+07', 'Published');

SELECT setval('review_id_seq', 25);

-- =========================================================================
-- 17. TRANSACTION_DETAIL (25 records)
-- =========================================================================
INSERT INTO transaction_detail (detail_id, transaction_id, movie_id, movie_name, original_price, discount_applied, sold_price) VALUES
('D00001', 'T00001', 'M00001', 'Inception',                         299.00, 0.00,  299.00),
('D00002', 'T00002', 'M00001', 'Inception',                         299.00, 0.00,  299.00),
('D00003', 'T00002', 'M00023', 'Interstellar',                      319.00, 70.00, 249.00),
('D00004', 'T00003', 'M00003', 'Parasite',                          249.00, 0.00,  249.00),
('D00005', 'T00004', 'M00023', 'Interstellar',                      319.00, 0.00,  319.00),
('D00006', 'T00005', 'M00005', 'Little Women',                      229.00, 0.00,  229.00),
('D00007', 'T00005', 'M00025', 'The Grand Budapest Hotel',          249.00, 20.00, 229.00),
('D00008', 'T00006', 'M00006', 'The Dark Knight',                   289.00, 0.00,  289.00),
('D00009', 'T00007', 'M00010', 'Your Name',                         209.00, 0.00,  209.00),
('D00010', 'T00008', 'M00004', 'Spirited Away',                     199.00, 0.00,  199.00),
('D00011', 'T00009', 'M00004', 'Spirited Away',                     199.00, 0.00,  199.00),
('D00012', 'T00009', 'M00021', 'Princess Mononoke',                 219.00, 0.00,  219.00),   -- total 418... assume bundle -10
('D00013', 'T00010', 'M00003', 'Parasite',                          249.00, 0.00,  249.00),
('D00014', 'T00011', 'M00002', 'Dune: Part Two',                    349.00, 0.00,  349.00),
('D00015', 'T00012', 'M00022', 'Crouching Tiger, Hidden Dragon',    259.00, 0.00,  259.00),
('D00016', 'T00013', 'M00011', 'Amélie',                            239.00, 0.00,  239.00),
('D00017', 'T00014', 'M00012', 'The Lives of Others',               259.00, 0.00,  259.00),
('D00018', 'T00015', 'M00013', 'Life Is Beautiful',                 269.00, 0.00,  269.00),
('D00019', 'T00016', 'M00014', 'Pan''s Labyrinth',                  249.00, 0.00,  249.00),
('D00020', 'T00017', 'M00015', '3 Idiots',                          219.00, 0.00,  219.00),
('D00021', 'T00018', 'M00016', 'Mad Max: Fury Road',                269.00, 0.00,  269.00),
('D00022', 'T00019', 'M00005', 'Little Women',                      229.00, 0.00,  229.00),
('D00023', 'T00020', 'M00019', 'City of God',                       239.00, 0.00,  239.00),
('D00024', 'T00021', 'M00020', 'Roma',                              229.00, 0.00,  229.00),
('D00025', 'T00022', 'M00007', 'Ong-Bak',                           179.00, 0.00,  179.00),
('D00026', 'T00022', 'M00008', 'Bad Genius',                        189.00, 0.00,  189.00),
('D00027', 'T00023', 'M00017', 'The Handmaiden',                    279.00, 20.00, 259.00),
('D00028', 'T00024', 'M00018', 'Oldboy',                            249.00, 0.00,  249.00),
('D00029', 'T00025', 'M00023', 'Interstellar',                      319.00, 0.00,  319.00);

SELECT setval('detail_id_seq', 29);

-- =========================================================================
-- END OF SEED FILE
-- =========================================================================
