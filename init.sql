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

INSERT INTO store_information (store_name, coupon, note, distance, phonenumber, map_url) VALUES
('居酒屋 山田', 'ハイボール半額', '火曜限定', '100m', '03-1234-5678', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('焼き鳥 鈴木', '生ビール100円', '本日限定', '200m', '03-9876-5432', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('バル 田中', 'ワイン1杯無料', '平日限定', '350m', '03-1111-2222', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('串カツ 大阪屋', '串カツ3本無料', '18時〜21時限定', '450m', '03-2233-4455', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('ラーメン 龍', 'トッピング1品無料', '雨の日限定', '500m', '03-3344-5566', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('ダイニングバー ZERO', 'カクテル半額', '週末限定', '600m', '03-4455-6677', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('寿司 はなまる', 'ランチ握り1貫サービス', '平日11〜14時', '750m', '03-5566-7788', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('もつ鍋 九州', 'もつ鍋おかわり無料', '木・金曜限定', '900m', '03-6677-8899', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('カフェ モーニング', 'ドリンク1杯無料', '〜10時モーニング', '1100m', '03-7788-9900', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890'),
('ビアガーデン 空', '生ビール飲み放題500円引き', '19時〜閉店', '1300m', '03-8899-0011', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.748412543526!2d139.6917!3d35.6895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIyLjIiTiAxMznCsDQxJzMwLjEiRQ!5e0!3m2!1sja!2sjp!4v1234567890');