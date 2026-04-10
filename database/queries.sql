-- TESTING SUITE ##########################################################################################
-- Note: PostgreSQL is case-insensitive by default, but using snake_case matches your 01_schema.sql perfectly.

-- ########## CORE INDEPENDENT DATA ##########
SELECT * FROM timezone;
SELECT * FROM content_rating;
SELECT * FROM country;
SELECT * FROM membership_tier;         -- NEW: verify free / premium / admin tiers seeded correctly
SELECT * FROM app_user;
SELECT * FROM content;
SELECT * FROM genre;
SELECT * FROM person;
SELECT * FROM language_list;

-- ########## TRANSACTION & FEEDBACK ##########
SELECT * FROM transaction_list;
SELECT * FROM transaction_detail;
SELECT * FROM subscription_detail;     -- NEW: verify subscription purchase records
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


-- ########## NEW: MEMBERSHIP DIAGNOSTICS ##########

-- 4. Show each user with their resolved tier name (replaces the old user_type string)
--    Confirms that tier_id FK resolves correctly to membership_tier
SELECT u.user_id,
       u.username,
       u.email,
       mt.tier_name,
       mt.price        AS monthly_price,
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


-- 6. Verify subscription_detail: confirm start_date < end_date (CHECK constraint test)
--    All rows should have valid = TRUE; any FALSE indicates a bad row slipped through
SELECT sd.detail_id,
       u.username,
       mt.tier_name,
       sd.start_date,
       sd.end_date,
       (sd.end_date > sd.start_date) AS valid_date_range,
       sd.sold_price
FROM subscription_detail sd
JOIN transaction_list tl ON sd.transaction_id = tl.transaction_id
LEFT JOIN app_user u ON tl.user_id = u.user_id
LEFT JOIN membership_tier mt ON sd.tier_id = mt.tier_id
ORDER BY sd.start_date;


-- 7. Full transaction history per user — combines content purchases AND subscriptions
--    Uses UNION to merge transaction_detail and subscription_detail into one view
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
       sd.tier_name         AS item_name,
       sd.sold_price,
       tl.payment_method,
       tl.payment_status
FROM transaction_list tl
JOIN app_user u          ON tl.user_id = u.user_id
JOIN subscription_detail sd ON tl.transaction_id = sd.transaction_id

ORDER BY transaction_date;


-- ########## CONSTRAINT VALIDATION ##########

-- 8. Verify CHECK constraints are working — each query below should return 0 rows.
--    Any result means a bad value made it into the table.

SELECT 'app_user.user_status' AS check_name, COUNT(*) AS violations
FROM app_user WHERE user_status NOT IN ('active', 'suspended', 'banned')
UNION ALL
SELECT 'content.content_type',         COUNT(*) FROM content        WHERE content_type NOT IN ('Movie', 'TV Show')
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
SELECT 'membership_tier.price',        COUNT(*) FROM membership_tier WHERE price < 0
UNION ALL
SELECT 'subscription_detail.dates',    COUNT(*) FROM subscription_detail WHERE end_date <= start_date
UNION ALL
SELECT 'transaction_detail.price',     COUNT(*) FROM transaction_detail WHERE sold_price < 0
UNION ALL
SELECT 'subscription_detail.price',    COUNT(*) FROM subscription_detail WHERE sold_price < 0;
-- ########################################################################################################