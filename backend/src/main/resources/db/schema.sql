-- ========================================================
-- LETGOO POSTGRESQL SCHEMA
-- Database: letgoo
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    role VARCHAR(50),
    avatar_text VARCHAR(10),
    avatar_bg VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Places Table
CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(50),
    category_label VARCHAR(100),
    price_range VARCHAR(20),
    price_text VARCHAR(100),
    status VARCHAR(50) DEFAULT 'want',
    saved_days_ago INT DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 4.5,
    review_note TEXT,
    image_url TEXT,
    drive_file_id VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    votes INT DEFAULT 1,
    source_link TEXT,
    tags TEXT,
    suggested_week BOOLEAN DEFAULT FALSE,
    scheduled_date VARCHAR(50),
    scheduled_day_name VARCHAR(50),
    visited_date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Week Plans Table
CREATE TABLE IF NOT EXISTS week_plans (
    id BIGSERIAL PRIMARY KEY,
    day_name VARCHAR(50) NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0
);

-- 4. Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGSERIAL PRIMARY KEY,
    place_id VARCHAR(100) NOT NULL,
    place_title VARCHAR(255),
    visited_date DATE,
    rating DOUBLE PRECISION DEFAULT 5.0,
    note TEXT,
    photo_urls TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
