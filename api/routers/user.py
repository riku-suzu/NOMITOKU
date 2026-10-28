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
    # すでに登録されているメールアドレスの場合
    if user_crud.get_user_by_email(db, email=user.get("email")):
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
    return user_crud.get_favorite_stores_by_user(db, current_user["id"])
