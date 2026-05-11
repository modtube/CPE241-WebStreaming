CREATE SEQUENCE IF NOT EXISTS language_id_seq START 25;
CREATE SEQUENCE IF NOT EXISTS genre_id_seq START 24;
CREATE SEQUENCE IF NOT EXISTS rating_id_seq START 23;
CREATE SEQUENCE IF NOT EXISTS person_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS movie_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS transaction_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS source_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS review_id_seq START 26;
CREATE SEQUENCE IF NOT EXISTS detail_id_seq START 30;

-- STRONG AND INDEPENDENT ENTITIES

CREATE TABLE IF NOT EXISTS country (
    country_code VARCHAR(10) PRIMARY KEY, -- e.g. 'TH', 'EN', 'CN'
    country_name VARCHAR(100) NOT NULL UNIQUE -- e.g. 'Thailand', 'China'
);

CREATE TABLE IF NOT EXISTS language_list (
    -- Example: 'L001'
    language_id     VARCHAR(10) PRIMARY KEY DEFAULT 'L' || LPAD(nextval('language_id_seq')::text, 3, '0'),
    language_name   VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'Thai', 'English', 'Chinese'
    native_name     VARCHAR(100) NOT NULL -- e.g. 'ไทย', 'English'
);

CREATE TABLE IF NOT EXISTS genre (
    -- Example: 'G01'
    genre_id    VARCHAR(10) PRIMARY KEY DEFAULT 'G' || LPAD(nextval('genre_id_seq')::text, 2, '0'),
    genre_name  VARCHAR(50) NOT NULL UNIQUE -- e.g. 'Sci-Fi', 'Thriler'
);

CREATE TABLE IF NOT EXISTS movie_rating (
    -- Example: 'R00001'
    rating_id VARCHAR(10) PRIMARY KEY DEFAULT 'R' || LPAD(nextval('rating_id_seq')::text, 5, '0'),
    rating_label        VARCHAR(10) NOT NULL UNIQUE,    -- e.g. 'PG', 'R'
    maturity_level      INT     NOT NULL,               -- e.g. 16, 18, 20
    rating_description  TEXT                            -- basic description
);

CREATE TABLE IF NOT EXISTS person (
    -- Example: 'P00001'
    person_id   VARCHAR(10) PRIMARY KEY DEFAULT 'P' || LPAD(nextval('person_id_seq')::text, 5, '0'),
    img_path    TEXT, -- poster image path
    first_name  VARCHAR(100) NOT NULL, 
    middle_name VARCHAR(100),
    last_name   VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    birth_date  DATE NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    biography   TEXT,
    create_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- the time that this person is added
    update_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- the time that this person is modified
);

-- *************************************************************************
-- STRONG BUT DEPENDENT ENTITIES

CREATE TABLE IF NOT EXISTS movie (
    -- Example: 'M00001'
    movie_id            VARCHAR(10) PRIMARY KEY DEFAULT 'M' || LPAD(nextval('movie_id_seq')::text, 5, '0'),
    title               VARCHAR(255) NOT NULL,
    img_path            VARCHAR(150), -- poster image path
    movie_description   TEXT,
    release_date        DATE,
    price               NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    create_date         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    update_date         TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP, -- the date when the content is added and updated

    rating_id           VARCHAR(10) NOT NULL,
    country_code        VARCHAR(10) NOT NULL,

    CONSTRAINT valid_content_price CHECK (price >= 0.0),
    FOREIGN KEY (rating_id)  REFERENCES movie_rating(rating_id),
    FOREIGN KEY (country_code) REFERENCES country(country_code)
);

CREATE TABLE IF NOT EXISTS app_user (
    -- Example: 'U00001'
    user_id         VARCHAR(10) PRIMARY KEY DEFAULT 'U' || LPAD(nextval('user_id_seq')::text, 5, '0'),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    img_path        VARCHAR(150),
    user_password   VARCHAR(255) NOT NULL,
    register_date   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_status     VARCHAR(50)  NOT NULL CHECK (user_status IN ('active', 'suspended', 'banned')),
    user_role       VARCHAR(20)  DEFAULT 'customer' CHECK (user_role IN ('admin', 'customer')),

    country_code      VARCHAR(10),

    FOREIGN KEY (country_code) REFERENCES country(country_code) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transaction_list (
    -- Example: 'T00001'
    transaction_id      VARCHAR(10) PRIMARY KEY DEFAULT 'T' || LPAD(nextval('transaction_id_seq')::text, 5, '0'),
    user_id             VARCHAR(10),                                    -- Nullable: ON DELETE SET NULL

    transaction_date    TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount        NUMERIC(10, 3) NOT NULL DEFAULT 0.0,
    payment_method VARCHAR(100) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer')),
    payment_status VARCHAR(100) NOT NULL CHECK (payment_status IN ('Completed', 'Pending', 'Refunded', 'Cancelled')),

    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE SET NULL,
    CONSTRAINT valid_transaction_price CHECK (total_amount >= 0.0)
);

-- *************************************************************************
-- WEAK ENTITIES

CREATE TABLE IF NOT EXISTS playlist (
    user_id         VARCHAR(10) NOT NULL,
    playlist_name   VARCHAR(100) NOT NULL,
    create_date     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visibility      VARCHAR(100) NOT NULL CHECK (visibility IN ('Public', 'Unlisted', 'Hidden')),

    PRIMARY KEY (user_id, playlist_name),
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media_path (
    -- Example: 'S00001'
    source_id       VARCHAR(10) PRIMARY KEY DEFAULT 'S' || LPAD(nextval('source_id_seq')::text, 5, '0'),

    movie_id        VARCHAR(10) NOT NULL,

    -- SD=480p, HD=720p, FHD=1080p 16:9, QHD=1440p, 2K=1080p 1:1.77, UHD=4K, FUHD=8K
    quality    VARCHAR(50)  NOT NULL CHECK (quality IN ('SD', 'HD', 'FHD', 'QHD', '2K', 'UHD', 'FUHD')),
    file_path  VARCHAR(255) NOT NULL,
    priority   INT NOT NULL DEFAULT 1,

    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
);

-- *************************************************************************
-- ASSOCIATIVE ENTITIES

CREATE TABLE IF NOT EXISTS movie_genre (
    movie_id        VARCHAR(10) NOT NULL,
    genre_id        VARCHAR(10) NOT NULL,

    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id)   REFERENCES movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id)   REFERENCES genre(genre_id)     ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movie_resource (
    movie_id        VARCHAR(10) NOT NULL,
    language_id     VARCHAR(10) NOT NULL,
    lang_type   VARCHAR(50) NOT NULL CHECK (lang_type IN ('Audio', 'Subtitle')),

    file_path   VARCHAR(255) NOT NULL,
    priority   INT NOT NULL DEFAULT 1,

    FOREIGN KEY (movie_id)    REFERENCES movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES language_list(language_id) ON DELETE CASCADE,

    -- Logic Constraint: Prevents duplicate paths for the same version
    CONSTRAINT unique_resource_entry UNIQUE (movie_id, language_id, lang_type, priority)
);

CREATE TABLE IF NOT EXISTS movie_role (
    movie_id       VARCHAR(10),
    person_id      VARCHAR(10),
    role_type      VARCHAR(100) NOT NULL CHECK (role_type IN ('Actor', 'Director', 'Producer', 'Crew')),
    character_name VARCHAR(200),

    PRIMARY KEY (movie_id, person_id, role_type),
    FOREIGN KEY (movie_id)   REFERENCES movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id)  REFERENCES person(person_id)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_library (
    user_id         VARCHAR(10) NOT NULL,
    movie_id        VARCHAR(10) NOT NULL,

    purchase_date   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlist_item (
    user_id         VARCHAR(10) NOT NULL,
    playlist_name   VARCHAR(100) NOT NULL,
    movie_id        VARCHAR(10) NOT NULL,

    add_date        TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, playlist_name, movie_id),
    FOREIGN KEY (user_id, playlist_name)    REFERENCES playlist(user_id, playlist_name) ON DELETE CASCADE,
    FOREIGN KEY (movie_id)                  REFERENCES movie(movie_id)                  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    -- Example: 'V00001'
    review_id       VARCHAR(10) PRIMARY KEY DEFAULT 'V' || LPAD(nextval('review_id_seq')::text, 5, '0'),
    user_id         VARCHAR(10),
    movie_id        VARCHAR(10)    NOT NULL,
    rating          NUMERIC(2, 1)  NOT NULL,
    comment_text    TEXT,
    post_time       TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_status     VARCHAR(100)     NOT NULL CHECK (post_status IN ('Published', 'Hidden', 'Removed')),

    UNIQUE (user_id, movie_id),

    FOREIGN KEY (user_id)    REFERENCES app_user(user_id)   ON DELETE SET NULL,
    FOREIGN KEY (movie_id)   REFERENCES movie(movie_id) ON DELETE CASCADE,
    CONSTRAINT valid_rating CHECK (rating >= 1.0 AND rating <= 5.0)
);

CREATE TABLE IF NOT EXISTS transaction_detail (
    -- Example: 'D00001'
    detail_id      VARCHAR(10) PRIMARY KEY DEFAULT 'D' || LPAD(nextval('detail_id_seq')::text, 5, '0'),
    transaction_id VARCHAR(10)      NOT NULL,
    movie_id       VARCHAR(10),

    movie_name       VARCHAR(255)   NOT NULL,  -- Retained even if content is deleted
    original_price   NUMERIC(10, 3) NOT NULL DEFAULT 0.0 CHECK (original_price >= 0.0),
    discount_applied NUMERIC(10, 3),
    sold_price     NUMERIC(10, 3) NOT NULL DEFAULT 0.0 CHECK (sold_price >= 0.0),

    FOREIGN KEY (transaction_id) REFERENCES transaction_list(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id)       REFERENCES movie(movie_id)             ON DELETE SET NULL
);


