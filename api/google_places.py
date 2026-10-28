"""
Google Places API 連携（ホットペッパーが使えないときの予備）

- お店の検索: Places API (New) の searchNearby（GOOGLE_PLACES_API_KEY が必要）
- クーポン: 実際の情報は取れないので、デモ用の文言をお店ごとに割り当てる
"""
import logging
import os
from datetime import datetime

import requests as req

from api import geo

API_URL = "https://places.googleapis.com/v1/places:searchNearby"
FIELD_MASK = "places.id,places.displayName,places.location,places.internationalPhoneNumber,places.regularOpeningHours"
SEARCH_RADIUS_M = 1000.0
MAX_RESULTS = 20

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

logger = logging.getLogger(__name__)


def api_key() -> str:
    return os.environ.get("GOOGLE_PLACES_API_KEY", "")


def _search(lat: float, lng: float) -> list[dict]:
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key(),
        "X-Goog-FieldMask": FIELD_MASK,
    }
    body = {
        "includedTypes": ["bar", "japanese_restaurant"],
        "maxResultCount": MAX_RESULTS,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": SEARCH_RADIUS_M,
            }
        },
        "languageCode": "ja",
    }
    # 失敗しても画面は「見つかりませんでした」として扱えるよう、空のリストを返す
    try:
        resp = req.post(API_URL, json=body, headers=headers, timeout=15)
        resp_json = resp.json()
        logger.debug("[Places API] status=%s body=%s", resp.status_code, resp_json)
        return resp_json.get("places", [])
    except Exception as e:
        logger.warning("[Places API] exception: %s", e)
        return []


def _today_hours(place: dict) -> str:
    weekday_text = place.get("regularOpeningHours", {}).get("weekdayDescriptions", [])
    today_idx = datetime.now().weekday()  # 0=月曜, 6=日曜（Google APIと同じ順序）
    return weekday_text[today_idx] if len(weekday_text) > today_idx else ""


def nearby_stores(lat: float, lng: float) -> list[dict]:
    """現在地の近くのお店を、近い順にフロント向けの形で返す"""
    stores = []
    for place in _search(lat, lng):
        name = place.get("displayName", {}).get("text", "")
        if not name:
            continue

        loc = place.get("location", {})
        place_lat = loc.get("latitude", 0)
        place_lng = loc.get("longitude", 0)
        meters = geo.distance_m(lat, lng, place_lat, place_lng)
        store_id = abs(hash(place.get("id", ""))) % (10**9)

        stores.append((meters, {
            "store_id": store_id,
            "store_name": name,
            "distance": geo.format_distance(meters),
            "coupon": DEMO_COUPONS[store_id % len(DEMO_COUPONS)],
            "note": _today_hours(place),
            "phonenumber": place.get("internationalPhoneNumber", ""),
            "map_url": geo.map_embed_url(place_lat, place_lng),
        }))
    return geo.nearest_first(stores)
