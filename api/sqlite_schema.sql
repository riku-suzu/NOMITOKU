-- ローカル開発用（SQLite）のスキーマ。api/db.py が起動時に適用する
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(64),
    password VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS store_information (
    store_id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name VARCHAR(255) NOT NULL,
    coupon VARCHAR(255),
    note VARCHAR(255),
    distance VARCHAR(64),
    phonenumber VARCHAR(32),
    map_url VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS users_favorite_stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    favorite JSON,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
