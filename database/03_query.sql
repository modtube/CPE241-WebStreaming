-- ############################################################################
-- DATABASE VERIFICATION TEMPLATE
-- ############################################################################

-- 1. BASIC RECORD COUNTS (Verify Seed Population)
-- Check if all tables have the expected amount of data.
SELECT 'country' as table_name, COUNT(*) FROM country
UNION ALL SELECT 'language_list', COUNT(*) FROM language_list
UNION ALL SELECT 'genre', COUNT(*) FROM genre
UNION ALL SELECT 'movie_rating', COUNT(*) FROM movie_rating
UNION ALL SELECT 'person', COUNT(*) FROM person
UNION ALL SELECT 'app_user', COUNT(*) FROM app_user
UNION ALL SELECT 'movie', COUNT(*) FROM movie
UNION ALL SELECT 'transaction_list', COUNT(*) FROM transaction_list
UNION ALL SELECT 'transaction_detail', COUNT(*) FROM transaction_detail
UNION ALL SELECT 'playlist', COUNT(*) FROM playlist
UNION ALL SELECT 'playlist_item', COUNT(*) FROM playlist_item
UNION ALL SELECT 'movie_resource', COUNT(*) FROM movie_resource
UNION ALL SELECT 'movie_role', COUNT(*) FROM movie_role;

-- 2. VERIFY CORE RELATIONSHIPS (Joins)

-- A. Movie & Rating (Many-to-One)
-- Ensures every movie is correctly linked to its maturity level.
SELECT m.title, r.rating_label, r.maturity_level 
FROM movie m 
JOIN movie_rating r ON m.rating_id = r.rating_id;

-- B. Movie & Genres (Many-to-Many)
-- Checks if the movie_genre associative entity is working.
SELECT m.title, g.genre_name 
FROM movie m
JOIN movie_genre mg ON m.movie_id = mg.movie_id
JOIN genre g ON mg.genre_id = g.genre_id;

-- C. Movie Roles (Many-to-Many with Associative Entity)
-- Verifies that actors/directors are correctly mapped to movies.
SELECT m.title, p.first_name, p.last_name, mr.role_type, mr.character_name
FROM movie m
JOIN movie_role mr ON m.movie_id = mr.movie_id
JOIN person p ON mr.person_id = p.person_id;

-- 3. TRANSACTION & AUDIT CHECKS

-- A. Transaction Integrity
-- Verify the relationship between the bill header and line items.
SELECT tl.transaction_id, tl.total_amount, td.movie_name, td.sold_price
FROM transaction_list tl
JOIN transaction_detail td ON tl.transaction_id = td.transaction_id;

-- B. Data Persistence Check
-- Checks if the redundant movie_name in transaction_detail is populated.
-- (This is vital for your "Persistence" logic).
SELECT transaction_id, movie_id, movie_name, sold_price 
FROM transaction_detail 
WHERE movie_name IS NOT NULL;

-- 4. USER SPECIFIC CHECKS

-- A. Playlist Contents
-- Verify which movies are in which user's playlist.
SELECT u.username, p.playlist_name, m.title as movie_in_playlist
FROM app_user u
JOIN playlist p ON u.user_id = p.user_id
JOIN playlist_item pi ON p.user_id = pi.user_id AND p.playlist_name = pi.playlist_name
JOIN movie m ON pi.movie_id = m.movie_id;

-- B. User Country/Language Check
-- Verify user demographic distribution.
SELECT u.username, c.country_name, u.user_role
FROM app_user u
JOIN country c ON u.country_code = c.country_code;