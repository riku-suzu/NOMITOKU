SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(64),
    password VARCHAR(64) NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    due_date DATE DEFAULT NULL,
    img_path VARCHAR(255) DEFAULT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE dones (
    id INTEGER PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE store_information (
    store_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(255) NOT NULL,
    coupon VARCHAR(255),
    note VARCHAR(255),
    distance VARCHAR(64),
    phonenumber VARCHAR(32),
    map_url VARCHAR(512)
);

CREATE TABLE users_favorite_stores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    favorite JSON,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

