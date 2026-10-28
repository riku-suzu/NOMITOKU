from sqlalchemy import text
from sqlalchemy.orm import Session

from api.db import fetch_all, fetch_one

# 自前のDB（store_information）から返す項目
STORE_COLUMNS = "store_id, store_name, coupon, note, distance, phonenumber, map_url"


def get_store(db: Session, store_id: int) -> dict | None:
    sql = text(f"SELECT {STORE_COLUMNS} FROM store_information WHERE store_id = :id")
    return fetch_one(db, sql, {"id": store_id})


def get_multiple_stores(db: Session) -> list[dict]:
    sql = text(f"SELECT {STORE_COLUMNS} FROM store_information")
    return fetch_all(db, sql)


def update_favorite_stores(db: Session, user_id: int, store_ids: list) -> None:
    # JSON_ARRAY(:id0, :id1, ...) の形にして、IDはすべてバインド変数で渡す
    ids = {f"id{i}": int(store_id) for i, store_id in enumerate(store_ids)}
    placeholders = ", ".join(f":{name}" for name in ids)
    sql = text(
        f"""
        UPDATE users_favorite_stores
        SET favorite = JSON_ARRAY({placeholders})
        WHERE user_id = :user_id
        """
    )
    db.execute(sql, {**ids, "user_id": user_id})
    db.commit()
