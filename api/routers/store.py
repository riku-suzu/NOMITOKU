import math
import os
from datetime import datetime
import requests as req
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

import api.cruds.store as store_crud
from api.db import get_db
from api.extra_modules.auth.core import get_current_user

router = APIRouter()

DEMO_COUPONS = [
    "生ビール半額",
    "ハイボール100円",
    "唐揚げ無料",
    "2杯目半額",
    "おつまみ1品サービス",
    "ドリンク1杯無料",
    "餃子半額",
    "日本酒1合サービス",
    "チューハイ150円",
    "枝豆サービス",
]

def _haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def _fmt_dist(m):
    return f"{int(m)}m" if m < 1000 else f"{m/1000:.1f}km"


@router.get("/stores/nearby")
def get_nearby_stores(
    lat: float,
    lng: float,
):
    api_key = os.environ.get("GOOGLE_PLACES_API_KEY", "")
    if not api_key:
        print("[Places API] GOOGLE_PLACES_API_KEY is not set")
        raise HTTPException(status_code=503, detail="Places API key is not configured")
    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.internationalPhoneNumber,places.regularOpeningHours",
    }
    body = {
        "includedTypes": ["bar", "japanese_restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": 1000.0,
            }
        },
        "languageCode": "ja",
    }

    try:
        resp = req.post(url, json=body, headers=headers, timeout=15)
        resp_json = resp.json()
        print(f"[Places API] status={resp.status_code} body={resp_json}")
        places = resp_json.get("places", [])
    except Exception as e:
        print(f"[Places API] exception: {e}")
        places = []

    stores = []
    for place in places:
        name = place.get("displayName", {}).get("text", "")
        if not name:
            continue

        loc = place.get("location", {})
        ele_lat = loc.get("latitude", 0)
        ele_lon = loc.get("longitude", 0)
        dist_m = _haversine_m(lat, lng, ele_lat, ele_lon)

        place_id = place.get("id", "")
        store_id = abs(hash(place_id)) % (10**9)

        hours = place.get("regularOpeningHours", {})
        weekday_text = hours.get("weekdayDescriptions", [])
        today_idx = datetime.now().weekday()  # 0=月曜, 6=日曜（Google APIと同じ順序）
        note = weekday_text[today_idx] if len(weekday_text) > today_idx else ""

        stores.append({
            "store_id": store_id,
            "store_name": name,
            "distance": _fmt_dist(dist_m),
            "distance_m": dist_m,
            "coupon": DEMO_COUPONS[store_id % len(DEMO_COUPONS)],
            "note": note,
            "phonenumber": place.get("internationalPhoneNumber", ""),
            "map_url": f"https://maps.google.com/maps?q={ele_lat},{ele_lon}&z=17&output=embed",
        })

    stores.sort(key=lambda x: x["distance_m"])
    for s in stores:
        del s["distance_m"]
    return stores


@router.get("/stores")
def list_stores(
    db: Session = Depends(get_db),
):
    return store_crud.get_multiple_stores(db, user_id=None)


@router.get("/store/{store_id}")
def get_store(
    store_id: int,
    db: Session = Depends(get_db),
):
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
    store_crud.update_favorite_stores(store_body, db, current_user.get("id"))
