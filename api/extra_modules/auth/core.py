import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

import api.cruds.user as user_crud
import api.extra_modules.auth.schema as auth_schemas
from api.db import get_db

# トークンの署名鍵。本番では環境変数 SECRET_KEY に設定する。
# 未設定のときは起動のたびに作り直す（再起動するとログインし直しになる）
SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()

    expire = (
        datetime.now(timezone.utc) + expires_delta
        if expires_delta
        else datetime.now(timezone.utc) + timedelta(minutes=15)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    db: Session = Depends(get_db),
    token: str | None = Depends(oauth2_scheme),
) -> dict:
    """
    tokenを検証し、userを返します。

    tokenはheaderのAuthorizationから取得します。
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if token is None:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise credentials_exception

    email = payload.get("sub")
    if email is None:
        raise credentials_exception

    token_data = auth_schemas.TokenData(email=email)

    user = user_crud.get_user_by_email(db, token_data.email)
    if user is None:
        raise credentials_exception

    return user
