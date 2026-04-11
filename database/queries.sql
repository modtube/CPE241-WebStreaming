-- TESTING SUITE ##########################################################################################
-- Note: PostgreSQL is case-insensitive by default, but using snake_case matches your 01_schema.sql perfectly.

-- ########## CORE INDEPENDENT DATA ##########
SELECT * FROM timezone;
SELECT * FROM content_rating;
SELECT * FROM country;
SELECT * FROM membership_tier;
SELECT * FROM app_user;
SELECT * FROM content;
SELECT * FROM genre;
SELECT * FROM person;
SELECT * FROM language_list;

-- ########## TRANSACTION & FEEDBACK ##########
SELECT * FROM transaction_list;
SELECT * FROM transaction_detail;
SELECT * FROM subscription_history;     -- FIXED: Changed from subscription_history
SELECT * FROM reviews;

-- ########## USER PERSONALIZATION ##########
SELECT * FROM playlist;
SELECT * FROM playlist_item;
SELECT * FROM user_content;

-- ########## CONTENT HIERARCHY & QUALITY ##########
SELECT * FROM media_path;              -- quality column now uses SD/HD/FHD/QHD/2K/UHD/FUHD
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
SELECT p.first_name || ' ' || p.last_name AS person_name,
       p.create_date,
       u.username AS added_by_admin
FROM person p
JOIN app_user u ON p.create_by = u.user_id;


-- 3. Verify Media Path Logic (Movies vs Episodes)
--    STANDALONE MOVIE rows should have episode_id = NULL
SELECT c.title,
       c.content_type,
       COALESCE(e.title, 'STANDALONE MOVIE') AS video_unit,
       m.quality,
       m.file_path
FROM media_path m
JOIN content c ON m.content_id = c.content_id
LEFT JOIN episode e ON m.episode_id = e.episode_id;

SELECT c.title,
       c.content_type,
       COALESCE(e.title, 'STANDALONE MOVIE') AS video_unit,
       cr.language_id,
       cr.lang_type,
       cr.file_path
FROM content_resource cr
JOIN content c ON cr.content_id = c.content_id
LEFT JOIN episode e ON cr.episode_id = e.episode_id;


-- ########## MEMBERSHIP DIAGNOSTICS ##########

-- 4. Show each user with their resolved tier name (replaces the old user_type string)
--    Confirms that tier_id FK resolves correctly to membership_tier
SELECT u.user_id,
       u.username,
       u.email,
       mt.tier_name,
       mt.monthly_price, -- FIXED: Changed from price to monthly_price
       u.user_status
FROM app_user u
JOIN membership_tier mt ON u.tier_id = mt.tier_id
ORDER BY mt.tier_id, u.user_id;


-- 5. Count users per tier — sanity check that Admin/Free/Premium distributed correctly
SELECT mt.tier_name,
       COUNT(u.user_id) AS user_count
FROM membership_tier mt
LEFT JOIN app_user u ON mt.tier_id = u.tier_id
GROUP BY mt.tier_name
ORDER BY user_count DESC;


-- 6. Verify subscription history: confirm start_date < end_date
SELECT sh.detail_id,
       u.username,
       sh.tier_name,
       sh.start_date,
       sh.end_date,
       (sh.end_date > sh.start_date) AS valid_date_range,
       sh.sold_price
FROM subscription_history sh
JOIN transaction_list tl ON sh.transaction_id = tl.transaction_id
LEFT JOIN app_user u ON tl.user_id = u.user_id
ORDER BY sh.start_date;


-- 7. Full transaction history per user (Content + Subscriptions)
SELECT tl.transaction_id,
       u.username,
       tl.transaction_date,
       'Content'            AS purchase_type,
       td.content_name      AS item_name,
       td.sold_price,
       tl.payment_method,
       tl.payment_status
FROM transaction_list tl
JOIN app_user u        ON tl.user_id = u.user_id
JOIN transaction_detail td ON tl.transaction_id = td.transaction_id

UNION ALL

SELECT tl.transaction_id,
       u.username,
       tl.transaction_date,
       'Subscription'       AS purchase_type,
       sh.tier_name         AS item_name,
       sh.sold_price,
       tl.payment_method,
       tl.payment_status
FROM transaction_list tl
JOIN app_user u          ON tl.user_id = u.user_id
JOIN subscription_history sh ON tl.transaction_id = sh.transaction_id

ORDER BY transaction_date;


-- ########## CONSTRAINT VALIDATION ##########

-- 8. Verify CHECK constraints are working — each query below should return 0 rows.
--    Any result means a bad value made it into the table.

SELECT 'app_user.user_status' AS check_name, COUNT(*) AS violations
FROM app_user WHERE user_status NOT IN ('active', 'suspended', 'banned')
UNION ALL
SELECT 'app_user.user_role',           COUNT(*) FROM app_user       WHERE user_role    NOT IN ('admin', 'customer')
UNION ALL
SELECT 'content.content_type',         COUNT(*) FROM content        WHERE content_type NOT IN ('Movie', 'TV Show')
UNION ALL
SELECT 'content.price_range',          COUNT(*) FROM content        WHERE price < 0 -- FIXED: Changed sold_price to price to match schema
UNION ALL
SELECT 'tv_show.curr_status',          COUNT(*) FROM tv_show        WHERE curr_status  NOT IN ('Not aired', 'Airing', 'Off')
UNION ALL
SELECT 'movie.curr_status',            COUNT(*) FROM movie          WHERE curr_status  NOT IN ('Unreleased', 'Released')
UNION ALL
SELECT 'media_path.quality',           COUNT(*) FROM media_path     WHERE quality      NOT IN ('SD', 'HD', 'FHD', 'QHD', '2K', 'UHD', 'FUHD')
UNION ALL
SELECT 'transaction_list.pay_method',  COUNT(*) FROM transaction_list WHERE payment_method NOT IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer')
UNION ALL
SELECT 'transaction_list.pay_status',  COUNT(*) FROM transaction_list WHERE payment_status NOT IN ('Completed', 'Pending', 'Refunded', 'Cancelled')
UNION ALL
SELECT 'transaction_list.total_range', COUNT(*) FROM transaction_list WHERE total_amount < 0
UNION ALL
SELECT 'reviews.post_status',          COUNT(*) FROM reviews        WHERE post_status  NOT IN ('Published', 'Hidden', 'Removed')
UNION ALL
SELECT 'reviews.rating_range',         COUNT(*) FROM reviews        WHERE rating < 1.0 OR rating > 5.0
UNION ALL
SELECT 'playlist.visibility',          COUNT(*) FROM playlist       WHERE visibility   NOT IN ('Public', 'Unlisted', 'Hidden')
UNION ALL
SELECT 'content_resource.lang_type',   COUNT(*) FROM content_resource WHERE lang_type NOT IN ('Audio', 'Subtitle')
UNION ALL
SELECT 'content_role.role_type',       COUNT(*) FROM content_role   WHERE role_type    NOT IN ('Actor', 'Director', 'Producer', 'Crew')
UNION ALL
SELECT 'user_content.watch_status',    COUNT(*) FROM user_content   WHERE watch_status NOT IN ('Unwatched', 'Unfinished', 'Finished') AND watch_status IS NOT NULL
UNION ALL
SELECT 'membership_tier.monthly_price',        COUNT(*) FROM membership_tier WHERE monthly_price < 0
UNION ALL
SELECT 'subscription_history.dates',    COUNT(*) FROM subscription_history WHERE end_date <= start_date
UNION ALL
SELECT 'transaction_detail.orig_price',COUNT(*) FROM transaction_detail WHERE original_price < 0
UNION ALL
SELECT 'transaction_detail.discount',  COUNT(*) FROM transaction_detail WHERE discount_applied < 0
UNION ALL
SELECT 'transaction_detail.sold_price',COUNT(*) FROM transaction_detail WHERE sold_price < 0
UNION ALL
SELECT 'subscription_history.sold_price',    COUNT(*) FROM subscription_history WHERE sold_price < 0;
-- ########################################################################################################