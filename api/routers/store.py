from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, Body
from sqlalchemy.orm import Session

import api.cruds.store as store_crud
from api.db import get_db
from api.extra_modules.auth.core import get_current_user
from api.extra_modules.image.core import save_image

router = APIRouter()





@router.get("/stores")
def list_stores(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return store_crud.get_multiple_stores(db, current_user.get("id"))




@router.get("/store/{store_id}")
def get_store(
    store_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    store = store_crud.get_store(db, store_id=store_id)

    # タスクが存在しない場合
    if store is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # # 他のユーザーのタスクを取得しようとした場合
    # if store.get("user_id") != current_user.get("id"):
    #     raise HTTPException(status_code=403, detail="Forbidden")

    return store


@router.get("/favorite_stores")
def get_favorite_stores(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # users_favorite_storesテーブルからcurrent_user["id"]のfavoriteを取得
    favorite_row = db.query(UsersFavoriteStores).filter_by(user_id=current_user["id"]).first()
    if favorite_row:
        return favorite_row.favorite  # 例: [1, 2, 3]
    else:
        return []


@router.put('/update_favorite')
def update_favorite_stores(
    store_body=Body(),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    print('update_favorite_suzuki')
    store_crud.update_favorite_stores(store_body,db,current_user.get("id"))