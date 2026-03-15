-- use streamingDB; --Don't have to use this if ran via Docker
-- TESTING ################################################################################################

-- ########## CORE INDEPENDENT DATA ##########
SELECT * FROM Timezone;
SELECT * FROM ContentRating;
SELECT * FROM Country;
SELECT * FROM AppUser;
SELECT * FROM Content;
SELECT * FROM Genre;
SELECT * FROM Person;
SELECT * FROM LanguageList;

-- ########## TRANSACTION & FEEDBACK ##########
SELECT * FROM TransactionList;
SELECT * FROM Transaction_Detail;
SELECT * FROM Reviews;

-- ########## USER PERSONALIZATION ##########
SELECT * FROM Playlist;
SELECT * FROM Playlist_Item;
SELECT * FROM User_Content;

-- ########## CONTENT HIERARCHY & QUALITY ##########
SELECT * FROM VideoQuality;
SELECT * FROM TV_Show;
SELECT * FROM Movie;
SELECT * FROM Season;
SELECT * FROM Episode;

-- ########## BRIDGE TABLES (RELATIONSHIPS) ##########
SELECT * FROM Content_Genre;
SELECT * FROM Content_Role;
SELECT * FROM Content_Language;
-- ########################################################################################################
