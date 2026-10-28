from sqlalchemy import text
from sqlalchemy.orm import Session


def get_store(
    db: Session,
    store_id: int,
):
    sql = text(
        """
        SELECT store_id,store_name, coupon, note, distance,phonenumber,map_url FROM store_information
        WHERE store_id = :id
        """
    )
    params = {"id": store_id}

    result = db.execute(sql, params).first()
    if result is not None:
        result = result._asdict()

    return result


def get_multiple_stores(
    db: Session,
    user_id: int,
):
    sql = text(
        """
        SELECT store_id,store_name, coupon, note, distance,phonenumber,map_url FROM store_information;
        """
    )
    result = db.execute(sql).all()
    return [store._asdict() for store in result]


def update_favorite_stores(
    store_body: list,
    db: Session,
    user_id: int,
):
    placeholder_values = ",".join(str(int(x)) for x in store_body)

    sql = text(
        f"""
        UPDATE users_favorite_stores
        SET favorite = JSON_ARRAY({placeholder_values})
        WHERE user_id = :user_id
        """
    )
    params = {"user_id": user_id}
    result = db.execute(sql, params)
    db.commit()

    return result
