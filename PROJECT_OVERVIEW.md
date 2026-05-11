# ノミトク - サービス概要

## どんなサービスか

**ノミトク**は、近くの飲食店・居酒屋などの「今日だけのお得情報（クーポン・割引）」をまとめて見られるWebアプリです。

ユーザーは近くのお店を一覧で確認し、気になるお店をお気に入り登録することで、自分専用のお得情報リストを作れます。

---

## 画面構成（ユーザーの操作フロー）

```
トップページ (index.html)
  ├── 新規登録 (signup.html)
  └── ログイン (login.html)
        ↓
    ホーム (home.html)
      「近くの今のお得を探す」ボタン
        ↓
    近くの店舗一覧 (nearby.html)
      - お気に入り店舗（上部に表示）
      - それ以外の近隣店舗（距離順）
        ↓
    お店の詳細 (shop_detail.html)
      - 店名・距離・クーポン・備考・電話番号・地図
      - お気に入り追加／解除ボタン
```

---

## 主な機能

| 機能 | 説明 |
|------|------|
| ユーザー登録・ログイン | メールアドレス＋パスワードで認証（JWT） |
| 店舗一覧表示 | 近くのお店を距離順に一覧表示 |
| お気に入り登録 | 気に入ったお店をお気に入りに追加・解除 |
| お店の詳細表示 | クーポン情報・電話番号・Googleマップ埋め込み |
| お気に入り優先表示 | お気に入り店舗を一覧の上部に表示 |

---

## 技術スタック

| 層 | 技術 |
|----|------|
| フロントエンド | HTML / CSS / JavaScript（Vanilla JS） |
| バックエンド | Python / FastAPI |
| データベース | MySQL 8.0 |
| 認証 | JWT（python-jose） |
| インフラ | Docker / Docker Compose |
| 開発用サーバー | browser-sync（フロント）、uvicorn（API） |

---

## データベース構成

```
users               ユーザー情報（email, nickname, password）
tasks               タスク（将来機能用）
dones               完了タスク（将来機能用）
store_information   店舗情報（店名, クーポン, 備考, 距離, 電話番号, 地図URL）
users_favorite_stores  ユーザーごとのお気に入り店舗ID一覧（JSON）
```

---

## APIエンドポイント一覧

| メソッド | パス | 内容 |
|----------|------|------|
| POST | /user | ユーザー登録 |
| POST | /auth/login | ログイン（JWTトークン取得） |
| GET | /me | ログイン中のユーザー情報取得 |
| GET | /me/favoritestores | お気に入り店舗一覧取得 |
| GET | /stores | 全店舗一覧取得（要認証） |
| GET | /store/{store_id} | 店舗詳細取得（要認証） |
| PUT | /update_favorite | お気に入り更新（要認証） |

---

## 起動方法

```bash
docker compose up -d
```

- フロントエンド: http://localhost:3000
- API: http://localhost:8000
- DB: localhost:33306（MySQL）
