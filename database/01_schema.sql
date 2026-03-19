-- CREATE DATABASE IF NOT EXISTS streamingdb; -- Remove this line if creating the DB externally (e.g. via Docker / psql)
-- -- \c streamingdb  -- Uncomment if running via psql to switch into the new DB
-- Docker-Compose already defined the DB. Don't have to use CREATE DATABASE unless you are running it on the IDE itself.

-- ============================================================
-- STRONG & FULLY INDEPENDENT ENTITIES
-- ============================================================

CREATE TABLE IF NOT EXISTS genre (
    genre_id   SERIAL PRIMARY KEY,
    genre_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS person (
    person_id   SERIAL PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name   VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    birth_date  DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS language_list (
    language_id     SERIAL PRIMARY KEY,
    language_name   VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS timezone (
    timezone_id     SERIAL PRIMARY KEY,
    iana_name       VARCHAR(50)  NOT NULL UNIQUE,  -- e.g. 'Asia/Bangkok'
    current_offset  VARCHAR(10)  NOT NULL          -- e.g. '+07:00'
);

CREATE TABLE IF NOT EXISTS content_rating (
    rating_id           SERIAL PRIMARY KEY,
    rating_label        VARCHAR(10) NOT NULL UNIQUE,
    maturity_level      INTEGER     NOT NULL,            -- 1–5 scale
    rating_description  TEXT
);


-- ============================================================
-- STRONG BUT USING REFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS country (
    country_id          SERIAL PRIMARY KEY,
    country_name        VARCHAR(100) NOT NULL UNIQUE,
    primary_timezone_id INT,
    FOREIGN KEY (primary_timezone_id) REFERENCES timezone(timezone_id)
);

CREATE TABLE IF NOT EXISTS app_user (
    user_id         SERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    user_password   VARCHAR(255) NOT NULL,
    register_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    country_id      INTEGER,
    user_type       VARCHAR(50)  NOT NULL,

    FOREIGN KEY (country_id) REFERENCES country(country_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS content (
    content_id          SERIAL PRIMARY KEY,
    title               VARCHAR(255) NOT NULL,
    content_description TEXT,
    release_date        DATE,
    price               NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    content_type        VARCHAR(50)  NOT NULL,
    rating_id           INTEGER      NOT NULL,
    country_id          INTEGER,

    CONSTRAINT valid_content_price CHECK (price >= 0.0),
    FOREIGN KEY (rating_id)  REFERENCES content_rating(rating_id),
    FOREIGN KEY (country_id) REFERENCES country(country_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transaction_list (
    transaction_id      SERIAL PRIMARY KEY,
    user_id             INTEGER,                                    -- Nullable: ON DELETE SET NULL
    transaction_date    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount        NUMERIC(10, 3) NOT NULL DEFAULT 0.0,

    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE SET NULL,
    CONSTRAINT valid_transaction_price CHECK (total_amount >= 0.0)
);

CREATE TABLE IF NOT EXISTS transaction_detail (
    detail_id      SERIAL PRIMARY KEY,
    transaction_id INTEGER        NOT NULL,
    content_id     INTEGER,
    content_name   VARCHAR(255)   NOT NULL,  -- Retained even if content is deleted
    sold_price     NUMERIC(10, 3) NOT NULL DEFAULT 0.0,

    FOREIGN KEY (transaction_id) REFERENCES transaction_list(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id)     REFERENCES content(content_id)             ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id       SERIAL PRIMARY KEY,
    user_id         INTEGER,
    content_id      INTEGER        NOT NULL,
    rating          NUMERIC(2, 1)  NOT NULL,
    comment_text    TEXT,
    post_time       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, content_id),

    FOREIGN KEY (user_id)    REFERENCES app_user(user_id)   ON DELETE SET NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    CONSTRAINT valid_rating CHECK (rating >= 1.0 AND rating <= 5.0)
);


-- ============================================================
-- WEAK & ASSOCIATIVE ENTITIES
-- ============================================================

-- ── Playlist ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlist (
    playlist_id   INTEGER      NOT NULL,
    user_id       INTEGER      NOT NULL,
    playlist_name VARCHAR(100) NOT NULL,
    create_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, playlist_id),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlist_item (
    playlist_id INTEGER   NOT NULL,
    user_id     INTEGER   NOT NULL,
    content_id  INTEGER   NOT NULL,
    add_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, playlist_id, content_id),
    FOREIGN KEY (user_id, playlist_id) REFERENCES playlist(user_id, playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id)           REFERENCES content(content_id)           ON DELETE CASCADE
);

-- ── User Inventory ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_content (
    user_id    INTEGER NOT NULL,
    content_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, content_id),
    FOREIGN KEY (user_id)    REFERENCES app_user(user_id)    ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- ── Video Quality ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_quality (
    content_id INTEGER     NOT NULL,
    quality   VARCHAR(50) NOT NULL,

    PRIMARY KEY (content_id, quality),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- ── Content Subclasses ────────────────────────────────────
CREATE TABLE IF NOT EXISTS tv_show (
    content_id   INTEGER     PRIMARY KEY,
    curr_status  VARCHAR(100) NOT NULL,

    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movie (
    content_id INTEGER PRIMARY KEY,
    run_time   INTEGER NOT NULL,  -- Minutes

    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

-- ── Seasons & Episodes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS season (
    content_id  INTEGER,
    season_num  INTEGER,
    air_date    DATE NOT NULL,
    sypnosis    TEXT,

    PRIMARY KEY (content_id, season_num),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS episode (
    content_id  INTEGER,
    season_num  INTEGER,
    episode_num INTEGER,
    title       VARCHAR(150) NOT NULL,
    sypnosis    TEXT,
    run_time    INTEGER,  -- Minutes

    PRIMARY KEY (content_id, season_num, episode_num),
    FOREIGN KEY (content_id, season_num) REFERENCES season(content_id, season_num) ON DELETE CASCADE
);

-- ── Content Details ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_genre (
    content_id INTEGER,
    genre_id   INTEGER,

    PRIMARY KEY (content_id, genre_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id)   REFERENCES genre(genre_id)     ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_role (
    content_id     INTEGER,
    person_id      INTEGER,
    role_type      VARCHAR(100) NOT NULL,
    character_name VARCHAR(200),

    PRIMARY KEY (content_id, person_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id)  REFERENCES person(person_id)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_language (
    content_id  INTEGER,
    language_id INTEGER,
    lang_type   VARCHAR(100),

    PRIMARY KEY (content_id, language_id, lang_type),
    FOREIGN KEY (content_id)  REFERENCES content(content_id)      ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES language_list(language_id) ON DELETE CASCADE
);