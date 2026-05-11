from sqlalchemy import text
from sqlalchemy.orm import Session


def create_task(
    db: Session,
    task_create: dict,
    user_id: int,
):
    sql = text(
        """
        INSERT INTO tasks (title, due_date, user_id)
        VALUES (:title, :due_date, :user_id)
        """
    )
    params = {
        "title": task_create.get("title"),
        "due_date": task_create.get("due_date"),
        "user_id": user_id,
    }

    print(f"SQL: {sql}\nParams: {params}")
    res = db.execute(sql, params)
    db.commit()
    new_task_id = res.lastrowid  # DBが最後に挿入した行のIDを取得
    new_task = get_task(db, task_id=new_task_id)
    print(f"DB操作の結果: {new_task}")

    return new_task


def get_task(
    db: Session,
    task_id: int,
):
    sql = text(
        """
        SELECT * FROM tasks
        WHERE id = :id
        """
    )
    params = {"id": task_id}

    print(f"SQL: {sql}\nParams: {params}")
    result = db.execute(sql, params).first()
    if result is not None:
        result = result._asdict()
    print(f"DB操作の結果: {result}")

    return result


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








def update_task(
    db: Session,
    task_update: dict,
    original: dict,
):
    sql = text(
        """
        UPDATE tasks
        SET title = :title, due_date = :due_date, img_path = :img_path
        WHERE id = :id
        """
    )
    params = original.copy()
    if task_update.get("title") is not None:
        params["title"] = task_update.get("title")
    if task_update.get("due_date") is not None:
        params["due_date"] = task_update.get("due_date")
    if task_update.get("img_path") is not None:
        params["img_path"] = task_update.get("img_path")

    print(f"SQL: {sql}\nParams: {params}")
    db.execute(sql, params)
    db.commit()
    updated_task = get_task(db, task_id=original.get("id"))
    print(f"DB操作の結果: {updated_task}")

    return updated_task


def delete_task(db: Session, original: dict):
    sql = text(
        """
        DELETE FROM tasks
        WHERE id = :id
        """
    )
    params = {
        "id": original.get("id"),
    }

    print(f"SQL: {sql}\nParams: {params}")
    db.execute(sql, params)
    db.commit()


