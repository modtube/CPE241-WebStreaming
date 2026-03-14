-- DROP DATABASE IF EXISTS streamingDB; -- Run this line if you'd like to drop the DB and rerun the entire thing again safely

CREATE DATABASE IF NOT EXISTS streamingDB;
use streamingDB;

-- STRONG & FULLY INDEPENDENT ENTITIES #######################
CREATE TABLE IF NOT EXISTS AppUser (
	UserID INTEGER AUTO_INCREMENT PRIMARY KEY, -- auto-incrementing integer
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    RegisterDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UserType VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Content (
	ContentID INTEGER AUTO_INCREMENT PRIMARY KEY, -- auto-incrementing integer
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    ReleaseDate DATE,
    Price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    ContentType VARCHAR(50) NOT NULL,
    CONSTRAINT ValidContentPrice CHECK (Price >= 0.0)
);

CREATE TABLE IF NOT EXISTS Genre (
	GenreID INTEGER AUTO_INCREMENT PRIMARY KEY, -- auto-incrementing integer
    GenreName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Person (
	PersonID INTEGER AUTO_INCREMENT PRIMARY KEY, -- auto-incrementing integer
    fName VARCHAR(100) NOT NULL,
    mName VARCHAR(100),
    lName VARCHAR(100) NOT NULL,
    Nationality VARCHAR(100) NOT NULL,
    BirthDate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS LanguageList (
	LanguageID INTEGER AUTO_INCREMENT PRIMARY KEY, -- auto-incrementing integer
    langName VARCHAR(100) NOT NULL UNIQUE
);
-- #############################################


-- STRONG BUT USING REFERENCES #######################################################################
CREATE TABLE IF NOT EXISTS TransactionList (
	TransactionID INTEGER AUTO_INCREMENT PRIMARY KEY,
    UserID INTEGER, -- Can't put "NOT NULL" due to a contradiction to "ON DELETE SET NULL"
    TransactionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 3) NOT NULL DEFAULT 0.0,
    
    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE SET NULL, -- If a user is removed, transactions are still kept for evidence/analysis
    CONSTRAINT ValidTransactionPrice CHECK (TotalAmount >= 0.0)
); 

CREATE TABLE IF NOT EXISTS Transaction_Detail (
	DetailID INTEGER AUTO_INCREMENT PRIMARY KEY,
	TransactionID INTEGER NOT NULL,
	ContentID INTEGER,
	ContentName VARCHAR(255) NOT NULL, -- Save the name so even if the content's gone, the name will still be kept here
	SoldPrice DECIMAL(10, 3) NOT NULL DEFAULT 0.0,
	
	FOREIGN KEY (TransactionID) REFERENCES TransactionList(TransactionID) ON DELETE CASCADE,
	FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Reviews (
	ReviewID INT AUTO_INCREMENT PRIMARY KEY,
	UserID INTEGER,
    ContentID INTEGER NOT NULL,
    Rating DECIMAL(2, 1) NOT NULL,
    CommentText TEXT,
    PostTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
	UNIQUE (UserID, ContentID), -- Peem reviews Movie1 cannot appear twice
    
    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE SET NULL, -- "Deleted User" doable
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE, -- If a content is gone, so should its reviews
    CONSTRAINT validRating CHECK (Rating >= 1.0 AND Rating <= 5.0)
);
-- ########################################################################################################


-- WEAK & ASSOCIATIVE ENTITIES ############################################################################

-- ################# Playlist ########################
CREATE TABLE IF NOT EXISTS Playlist (
	PlaylistID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    PlaylistName VARCHAR(100) NOT NULL,
    CreateDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (UserID, PlaylistID),
    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE CASCADE -- If a user is removed, so are their playlists
);

CREATE TABLE IF NOT EXISTS Playlist_Item (
	PlaylistID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    ContentID INTEGER NOT NULL,
    AddDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (UserID, PlaylistID, ContentID),
    FOREIGN KEY (UserID, PlaylistID) REFERENCES Playlist(UserID, PlaylistID) ON DELETE CASCADE, -- If a playlist is deleted, so are its items
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE -- If a content is deleted, so is itself in all playlists
);
-- ###################################################

-- ############# User's inventory ####################
CREATE TABLE IF NOT EXISTS User_Content (
	UserID INTEGER NOT NULL,
    ContentID INTEGER NOT NULL,
    
    PRIMARY KEY (UserID, ContentID),
    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE CASCADE, -- If a user is removed, so are the connections in this table
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE -- If a content is deleted, so is itself in the user's inventory
);
-- ###################################################

-- ################ Video Quality ####################
CREATE TABLE IF NOT EXISTS VideoQuality (
	ContentID INTEGER NOT NULL,
    Quality VARCHAR(50) NOT NULL,
    
    PRIMARY KEY (ContentID, Quality),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);
-- ###################################################

-- ############# Content Subclasses ##################
CREATE TABLE IF NOT EXISTS TV_Show (
	ContentID INTEGER PRIMARY KEY,
    currStatus VARCHAR(100) NOT NULL, -- EX: On-going, On-air, off, etc.
    
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Movie (
	ContentID INTEGER PRIMARY KEY,
    RunTime INTEGER NOT NULL, -- Minutes
    
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);
-- ###################################################

-- ############# Seasons & Episodes ##################
CREATE TABLE IF NOT EXISTS Season (
	ContentID INTEGER,
    SeasonNum INTEGER,
    AirDate DATE NOT NULL,
    Sypnosis TEXT,
    
    PRIMARY KEY (ContentID, SeasonNum),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Episode (
	ContentID INTEGER,
    SeasonNum INTEGER,
    EpisodeNum INTEGER,
    Title VARCHAR(150) NOT NULL,
    Sypnosis TEXT,
    RunTime INTEGER, -- Minutes
    
    PRIMARY KEY (ContentID, SeasonNum, EpisodeNum),
    FOREIGN Key (ContentID, SeasonNum) REFERENCES Season(ContentID, SeasonNum) ON DELETE CASCADE
);
-- ###################################################

-- ############## Content Details ####################
CREATE TABLE IF NOT EXISTS Content_Genre (
	ContentID INTEGER,
    GenreID INTEGER,
    
    PRIMARY KEY (ContentID, GenreID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Content_Role (
	ContentID INTEGER,
    PersonID INTEGER,
    RoleType VARCHAR(100) NOT NULL,
    CharacterName VARCHAR(200),
    
    PRIMARY KEY (ContentID, PersonID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Content_Language (
	ContentID INTEGER,
	LanguageID INTEGER,
    LangType VARCHAR(100),
    
    PRIMARY KEY (ContentID, LanguageID, LangType),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES LanguageList(LanguageID) ON DELETE CASCADE
);
-- ########################################################################################################