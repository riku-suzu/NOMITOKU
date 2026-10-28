from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.orm import Session

from api.db import fetch_one

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_user(db: Session, user: dict) -> dict | None:
    sql = text(
        """
        INSERT INTO users (email, nickname, password)
        VALUES (:email, :nickname, :password)
        """
    )
    params = {
        "email": user.get("email"),
        "nickname": user.get("nickname"),
        "password": get_password_hash(user.get("password")),
    }

    db.execute(sql, params)
    db.commit()
    new_user = get_user_by_email(db, user.get("email"))

    # お気に入りを保存できるよう、users_favorite_stores に空のリストを用意しておく
    if new_user and new_user.get("id"):
        sql_fav = text(
            """
            INSERT INTO users_favorite_stores (user_id, favorite)
            VALUES (:user_id, :favorite)
            """
        )
        db.execute(sql_fav, {"user_id": new_user["id"], "favorite": "[]"})
        db.commit()

    return new_user


def get_user_by_email(db: Session, email: str) -> dict | None:
    sql = text("SELECT * FROM users WHERE email = :email")
    return fetch_one(db, sql, {"email": email})


def authenticate_user(db: Session, email: str, password: str) -> dict | None:
    """メールアドレスとパスワードが正しければユーザーを返す"""
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.get("password")):
        return None
    return user


def get_favorite_stores_by_user(db: Session, user_id: int) -> dict:
    sql = text("SELECT * FROM users_favorite_stores WHERE user_id = :id")
    # まだ行が無い場合は、user_id 付きの空データを返す
    return fetch_one(db, sql, {"id": user_id}) or {"user_id": user_id, "favorite": []}
