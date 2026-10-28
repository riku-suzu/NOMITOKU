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

    print(f"[riku]SQL: {sql}\nParams: {params}")
    result = db.execute(sql, params).first()
    if result is not None:
        result = result._asdict()
        
    print(f"[riku]DB操作の結果: {result}")

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
    # params = {"user_id": user_id}

    # print(f"SQL: {sql}\nParams: {params}")
    print("STORESのAPIだよ")
    # result = db.execute(sql, params).all()
    result = db.execute(sql).all()
    result = [store._asdict() for store in result]
    # for task in result:
    #     task["done"] = bool(task["done"])
    print(f"DB操作の結果: {result}")

    return result


def update_favorite_stores(
    store_body: list,
    db: Session,
    user_id: int,
):
    print(f"suzukistore_body{store_body}")
    print(f"suzukiuser_id{user_id}")

    placeholder_values = ",".join(str(int(x)) for x in store_body)

    sql = text(
        f"""
        UPDATE users_favorite_stores
        SET favorite = JSON_ARRAY({placeholder_values})
        WHERE user_id = :user_id
        """
    )
    # params = {"user_id": user_id, "favorite": json_favorite}
    params = {"user_id": user_id}
    print(f"SQL: {sql}\nParams: {params}")
    result = db.execute(sql, params)
    db.commit()
    # if result is not None:
    #     result = result._asdict()
    #     result["done"] = bool(result["done"])
    print(f"DB操作の結果aaa: {result}")

    return result
