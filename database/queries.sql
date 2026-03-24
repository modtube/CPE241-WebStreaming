-- TESTING SUITE ##########################################################################################
-- Note: PostgreSQL is case-insensitive by default, but using snake_case matches your 01_schema.sql perfectly.

-- ########## CORE INDEPENDENT DATA ##########
SELECT * FROM timezone;
SELECT * FROM content_rating;
SELECT * FROM country;
SELECT * FROM app_user;
SELECT * FROM content;
SELECT * FROM genre;
SELECT * FROM person;
SELECT * FROM language_list;

-- ########## TRANSACTION & FEEDBACK ##########
SELECT * FROM transaction_list;
SELECT * FROM transaction_detail;
SELECT * FROM reviews;

-- ########## USER PERSONALIZATION ##########
SELECT * FROM playlist;
SELECT * FROM playlist_item;
SELECT * FROM user_content;

-- ########## CONTENT HIERARCHY & QUALITY ##########
SELECT * FROM media_path; -- Replaced VideoQuality to support polymorphic Movie/Episode logic
SELECT * FROM tv_show;
SELECT * FROM movie;
SELECT * FROM season;
SELECT * FROM episode;

-- ########## BRIDGE TABLES (RELATIONSHIPS) ##########
SELECT * FROM content_genre;
SELECT * FROM content_role;
SELECT * FROM content_resource;

-- ########## DIAGNOSTICS & AUDITS ##########
-- 1. Check Row Counts across all tables
SELECT table_name, 
       (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I', table_name), false, true, '')))[1]::text::int AS total_rows
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY total_rows DESC;

-- 2. Verify Audit Trail (Who added which person?)
SELECT p.first_name || ' ' || p.last_name AS person_name, p.create_date, u.username AS added_by_admin
FROM person p
JOIN app_user u ON p.create_by = u.user_id;

-- 3. Verify Media Path Logic (Movies vs Episodes)
SELECT c.title, c.content_type, COALESCE(e.title, 'STANDALONE MOVIE') as video_unit, m.quality, m.file_path
FROM media_path m
JOIN content c ON m.content_id = c.content_id
LEFT JOIN episode e ON m.episode_id = e.episode_id;

SELECT c.title, c.content_type, COALESCE(e.title, 'STANDALONE MOVIE') AS video_unit, cr.language_id, cr.lang_type, cr.file_path
FROM content_resource cr
JOIN content c ON cr.content_id = c.content_id
LEFT JOIN episode e ON cr.episode_id = e.episode_id;

-- ########################################################################################################