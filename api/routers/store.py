import logging

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

import api.cruds.store as store_crud
import api.google_places as google_places
import api.hotpepper as hotpepper
from api.db import get_db
from api.extra_modules.auth.core import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/stores/{store_id}/coupons")
def get_store_coupons(store_id: int):
    if not hotpepper.scraping_enabled():
        raise HTTPException(status_code=404, detail="Coupon scraping is disabled")
    try:
        return hotpepper.fetch_coupons(hotpepper.to_shop_id(store_id))
    except Exception as e:
        logger.warning("[Hot Pepper] coupon fetch failed: %s", e)
        raise HTTPException(status_code=502, detail="Failed to fetch coupons")


@router.get("/stores/nearby")
def get_nearby_stores(
    lat: float,
    lng: float,
):
    # ホットペッパーを優先し、使えないときは Google Places で探す
    if hotpepper.api_key():
        try:
            return hotpepper.nearby_stores(lat, lng)
        except Exception as e:
            logger.warning("[Hot Pepper] search failed, falling back to Google Places: %s", e)

    if not google_places.api_key():
        logger.warning("[Places API] GOOGLE_PLACES_API_KEY is not set")
        raise HTTPException(status_code=503, detail="Places API key is not configured")
    return google_places.nearby_stores(lat, lng)


@router.get("/stores")
def list_stores(
    db: Session = Depends(get_db),
):
    return store_crud.get_multiple_stores(db)


@router.get("/store/{store_id}")
def get_store(
    store_id: int,
    db: Session = Depends(get_db),
):
    # 詳細ページを直接開いた（再読み込みした）ときはホットペッパーから取り直す
    if hotpepper.api_key():
        try:
            shop = hotpepper.get_shop(hotpepper.to_shop_id(store_id))
            if shop:
                return hotpepper.to_store(shop)
        except Exception as e:
            logger.warning("[Hot Pepper] shop fetch failed: %s", e)

    store = store_crud.get_store(db, store_id=store_id)
    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.put('/update_favorite')
def update_favorite_stores(
    store_body=Body(),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    store_crud.update_favorite_stores(db, current_user["id"], store_body)
