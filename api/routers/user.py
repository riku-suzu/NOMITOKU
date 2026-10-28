from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

import api.cruds.user as user_crud
from api.db import get_db
from api.extra_modules.auth.core import get_current_user

router = APIRouter()


def to_public_user(user: dict) -> dict:
    """画面に返してよい項目だけにする（パスワードのハッシュは返さない）"""
    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "nickname": user.get("nickname"),
    }


@router.post("/user")
def create_user(
    user: dict = Body(),
    db: Session = Depends(get_db),
):
    db_user = user_crud.get_user_by_email(db, email=user.get("email"))
    # すでに登録されているメールアドレスの場合
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_db_user = user_crud.create_user(db, user)
    return to_public_user(new_db_user)


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return to_public_user(current_user)



@router.get("/me/favoritestores")
def get_favorite_stores(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    favorite_stores = user_crud.get_favorite_stores_by_user(db,current_user['id'])
    if  favorite_stores is None:
        raise HTTPException(status_code=404, detail="favorite_stores not found")

    return favorite_stores
