
-- CREATE DATABASE IF NOT EXISTS streamingdb; -- Remove this line if creating the DB externally (e.g. via Docker / psql)
-- -- \c streamingdb  -- Uncomment if running via psql to switch into the new DB
-- Docker-Compose already defined the DB. Don't have to use CREATE DATABASE unless you are running it on the IDE itself.

-- ============================================================
-- STRONG & FULLY INDEPENDENT ENTITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS Genre (
    GenreID   SERIAL PRIMARY KEY,
    GenreName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Person (
    PersonID    SERIAL PRIMARY KEY,
    fName       VARCHAR(100) NOT NULL,
    mName       VARCHAR(100),
    lName       VARCHAR(100) NOT NULL,
    Nationality VARCHAR(100) NOT NULL,
    BirthDate   DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS LanguageList (
    LanguageID SERIAL PRIMARY KEY,
    langName   VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Timezone (
    TimezoneID     SERIAL PRIMARY KEY,
    IANA_Name      VARCHAR(50)  NOT NULL UNIQUE,  -- e.g. 'Asia/Bangkok'
    Current_Offset VARCHAR(10)  NOT NULL           -- e.g. '+07:00'
);

CREATE TABLE IF NOT EXISTS ContentRating (
    RatingID      SERIAL PRIMARY KEY,
    RatingLabel   VARCHAR(10) NOT NULL UNIQUE,
    MaturityLevel INTEGER     NOT NULL,            -- 1–5 scale
    Description   TEXT
);


-- ============================================================
-- STRONG BUT USING REFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS Country (
    CountryID        SERIAL PRIMARY KEY,
    CountryName      VARCHAR(100) NOT NULL UNIQUE,
    PrimaryTimezoneID INT,
    FOREIGN KEY (PrimaryTimezoneID) REFERENCES Timezone(TimezoneID)
);

CREATE TABLE IF NOT EXISTS AppUser (
    UserID       SERIAL PRIMARY KEY,
    Username     VARCHAR(50)  NOT NULL UNIQUE,
    Email        VARCHAR(255) NOT NULL UNIQUE,
    Password     VARCHAR(255) NOT NULL,
    RegisterDate TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CountryID    INTEGER,
    UserType     VARCHAR(50)  NOT NULL,

    FOREIGN KEY (CountryID) REFERENCES Country(CountryID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Content (
    ContentID   SERIAL PRIMARY KEY,
    Title       VARCHAR(255) NOT NULL,
    Description TEXT,
    ReleaseDate DATE,
    Price       NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    ContentType VARCHAR(50)  NOT NULL,
    RatingID    INTEGER      NOT NULL,
    CountryID   INTEGER,

    CONSTRAINT ValidContentPrice CHECK (Price >= 0.0),
    FOREIGN KEY (RatingID)  REFERENCES ContentRating(RatingID),
    FOREIGN KEY (CountryID) REFERENCES Country(CountryID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS TransactionList (
    TransactionID   SERIAL PRIMARY KEY,
    UserID          INTEGER,                                    -- Nullable: ON DELETE SET NULL
    TransactionDate TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalAmount     NUMERIC(10, 3) NOT NULL DEFAULT 0.0,

    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE SET NULL,
    CONSTRAINT ValidTransactionPrice CHECK (TotalAmount >= 0.0)
);

CREATE TABLE IF NOT EXISTS Transaction_Detail (
    DetailID      SERIAL PRIMARY KEY,
    TransactionID INTEGER        NOT NULL,
    ContentID     INTEGER,
    ContentName   VARCHAR(255)   NOT NULL,  -- Retained even if content is deleted
    SoldPrice     NUMERIC(10, 3) NOT NULL DEFAULT 0.0,

    FOREIGN KEY (TransactionID) REFERENCES TransactionList(TransactionID) ON DELETE CASCADE,
    FOREIGN KEY (ContentID)     REFERENCES Content(ContentID)             ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID    SERIAL PRIMARY KEY,
    UserID      INTEGER,
    ContentID   INTEGER        NOT NULL,
    Rating      NUMERIC(2, 1)  NOT NULL,
    CommentText TEXT,
    PostTime    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (UserID, ContentID),

    FOREIGN KEY (UserID)    REFERENCES AppUser(UserID)   ON DELETE SET NULL,
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    CONSTRAINT validRating CHECK (Rating >= 1.0 AND Rating <= 5.0)
);


-- ============================================================
-- WEAK & ASSOCIATIVE ENTITIES
-- ============================================================

-- ── Playlist ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Playlist (
    PlaylistID   INTEGER      NOT NULL,
    UserID       INTEGER      NOT NULL,
    PlaylistName VARCHAR(100) NOT NULL,
    CreateDate   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (UserID, PlaylistID),
    FOREIGN KEY (UserID) REFERENCES AppUser(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Playlist_Item (
    PlaylistID INTEGER   NOT NULL,
    UserID     INTEGER   NOT NULL,
    ContentID  INTEGER   NOT NULL,
    AddDate    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (UserID, PlaylistID, ContentID),
    FOREIGN KEY (UserID, PlaylistID) REFERENCES Playlist(UserID, PlaylistID) ON DELETE CASCADE,
    FOREIGN KEY (ContentID)          REFERENCES Content(ContentID)           ON DELETE CASCADE
);

-- ── User Inventory ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS User_Content (
    UserID    INTEGER NOT NULL,
    ContentID INTEGER NOT NULL,

    PRIMARY KEY (UserID, ContentID),
    FOREIGN KEY (UserID)    REFERENCES AppUser(UserID)    ON DELETE CASCADE,
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

-- ── Video Quality ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS VideoQuality (
    ContentID INTEGER     NOT NULL,
    Quality   VARCHAR(50) NOT NULL,

    PRIMARY KEY (ContentID, Quality),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

-- ── Content Subclasses ────────────────────────────────────
CREATE TABLE IF NOT EXISTS TV_Show (
    ContentID   INTEGER     PRIMARY KEY,
    currStatus  VARCHAR(100) NOT NULL,

    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Movie (
    ContentID INTEGER PRIMARY KEY,
    RunTime   INTEGER NOT NULL,  -- Minutes

    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

-- ── Seasons & Episodes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS Season (
    ContentID INTEGER,
    SeasonNum INTEGER,
    AirDate   DATE NOT NULL,
    Sypnosis  TEXT,

    PRIMARY KEY (ContentID, SeasonNum),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Episode (
    ContentID  INTEGER,
    SeasonNum  INTEGER,
    EpisodeNum INTEGER,
    Title      VARCHAR(150) NOT NULL,
    Sypnosis   TEXT,
    RunTime    INTEGER,  -- Minutes

    PRIMARY KEY (ContentID, SeasonNum, EpisodeNum),
    FOREIGN KEY (ContentID, SeasonNum) REFERENCES Season(ContentID, SeasonNum) ON DELETE CASCADE
);

-- ── Content Details ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS Content_Genre (
    ContentID INTEGER,
    GenreID   INTEGER,

    PRIMARY KEY (ContentID, GenreID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID)   REFERENCES Genre(GenreID)     ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Content_Role (
    ContentID     INTEGER,
    PersonID      INTEGER,
    RoleType      VARCHAR(100) NOT NULL,
    CharacterName VARCHAR(200),

    PRIMARY KEY (ContentID, PersonID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON DELETE CASCADE,
    FOREIGN KEY (PersonID)  REFERENCES Person(PersonID)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Content_Language (
    ContentID  INTEGER,
    LanguageID INTEGER,
    LangType   VARCHAR(100),

    PRIMARY KEY (ContentID, LanguageID, LangType),
    FOREIGN KEY (ContentID)  REFERENCES Content(ContentID)      ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES LanguageList(LanguageID) ON DELETE CASCADE
);
