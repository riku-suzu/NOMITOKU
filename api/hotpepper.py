"""
ホットペッパーグルメ連携

- お店の検索: 公式 グルメサーチAPI（HOTPEPPER_API_KEY が必要）
- クーポン文言: 店舗の「クーポン・地図」ページをスクレイピング
  個人利用の範囲に限るため ENABLE_COUPON_SCRAPING=1 のときだけ動く（本番では設定しない）
  負荷をかけないよう、リクエスト間隔を空けて結果をキャッシュする
"""
import html
import os
import re
import threading
import time
import unicodedata

import requests as req

API_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/"
SHOP_URL = "https://www.hotpepper.jp/str{shop_id}/map/"
IZAKAYA = "G001"
USER_AGENT = "NomitokuPersonalDev/0.1 (personal study project)"

MIN_INTERVAL_SEC = 1.0
CACHE_TTL_SEC = 6 * 60 * 60

_cache: dict[str, tuple[float, list[dict]]] = {}
_lock = threading.Lock()
_last_request_at = 0.0


def api_key() -> str:
    return os.environ.get("HOTPEPPER_API_KEY", "")


def scraping_enabled() -> bool:
    return os.environ.get("ENABLE_COUPON_SCRAPING") == "1"


# ID は "J001145797" 形式。フロントのお気に入りは数値IDで扱うので相互変換する
def to_store_id(shop_id: str) -> int:
    return int(shop_id[1:])


def to_shop_id(store_id: int) -> str:
    return f"J{store_id:09d}"


# 検索範囲（API の range: 3=1km / 4=2km / 5=3km）。近くに少ないときは広げる
SEARCH_RANGES = (3, 4, 5)
MIN_RESULTS = 10


def _search(lat: float, lng: float, search_range: int) -> list[dict]:
    params = {
        "key": api_key(),
        "lat": lat,
        "lng": lng,
        "range": search_range,
        "genre": IZAKAYA,
        "count": 100,
        "format": "json",
    }
    resp = req.get(API_URL, params=params, timeout=15)
    resp.raise_for_status()
    results = resp.json().get("results", {})
    if "error" in results:
        raise RuntimeError(f"Hot Pepper API error: {results['error']}")
    # サブジャンルが居酒屋の店も返ってくるので、メインジャンルで絞る
    return [s for s in results.get("shop", []) if s.get("genre", {}).get("code") == IZAKAYA]


def search_nearby(lat: float, lng: float) -> list[dict]:
    for search_range in SEARCH_RANGES:
        shops = _search(lat, lng, search_range)
        if len(shops) >= MIN_RESULTS:
            break
    return shops


def get_shop(shop_id: str) -> dict | None:
    params = {"key": api_key(), "id": shop_id, "format": "json"}
    resp = req.get(API_URL, params=params, timeout=15)
    resp.raise_for_status()
    shops = resp.json().get("results", {}).get("shop", [])
    return shops[0] if shops else None


def _normalize(value: str) -> str:
    # mobile_access などは半角カナが混ざるので全角にそろえる
    return unicodedata.normalize("NFKC", value or "").strip()


def _has(value: str) -> bool:
    return (value or "").startswith("あり")


def to_store(shop: dict) -> dict:
    """API の shop をフロント向けの形に変換する（距離は呼び出し側で付ける）"""
    station = shop.get("station_name", "")
    photo = shop.get("photo", {}).get("pc", {}).get("l", "")
    return {
        "store_id": to_store_id(shop["id"]),
        "store_name": shop.get("name", ""),
        "source": "hotpepper",
        "catch": shop.get("catch", ""),
        "genre": shop.get("genre", {}).get("name", ""),
        "photo": photo,
        # API には無いが、同じ画像の 480px 版が置かれていることが多い（無ければフロントで photo に戻す）
        "photo_large": re.sub(r"_238\.jpg$", "_480.jpg", photo),
        "budget": shop.get("budget", {}).get("name", ""),
        "station": f"{station}駅" if station else "",
        "access": _normalize(shop.get("mobile_access", "")),
        "address": shop.get("address", ""),
        "open": shop.get("open", ""),
        "free_drink": _has(shop.get("free_drink")),
        "free_food": _has(shop.get("free_food")),
        "private_room": _has(shop.get("private_room")),
        "lat": float(shop["lat"]),
        "lng": float(shop["lng"]),
        "map_url": f"https://maps.google.com/maps?q={shop['lat']},{shop['lng']}&z=17&output=embed",
        "hotpepper_url": shop.get("urls", {}).get("pc", ""),
        "coupon_url": shop.get("coupon_urls", {}).get("sp", ""),
    }


def _text(fragment: str) -> str:
    fragment = re.sub(r"<br\s*/?>", "\n", fragment)
    fragment = re.sub(r"<[^>]+>", "", fragment)
    return html.unescape(fragment).strip()


def parse_coupons(page: str) -> list[dict]:
    coupons = []
    seen = set()
    # 1クーポン = nameSection（名前）+ detailSection（条件の表）
    for chunk in page.split('class="nameSection"')[1:]:
        name_match = re.search(r'<p class="couponName">(.*?)</p>', chunk, re.S)
        if not name_match:
            continue
        name = _text(name_match.group(1))
        if name in seen:
            continue
        seen.add(name)

        conditions = {}
        detail = chunk.split("</table>", 1)[0]
        for th, td in re.findall(r"<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>", detail, re.S):
            conditions[_text(th).strip("【】")] = _text(td)

        coupons.append({"name": name, "conditions": conditions})
    return coupons


def fetch_coupons(shop_id: str) -> list[dict]:
    global _last_request_at

    with _lock:
        cached = _cache.get(shop_id)
        if cached and time.time() - cached[0] < CACHE_TTL_SEC:
            return cached[1]

        wait = MIN_INTERVAL_SEC - (time.time() - _last_request_at)
        if wait > 0:
            time.sleep(wait)
        _last_request_at = time.time()

        resp = req.get(
            SHOP_URL.format(shop_id=shop_id),
            headers={"User-Agent": USER_AGENT},
            timeout=15,
        )
        resp.raise_for_status()
        coupons = parse_coupons(resp.text)
        _cache[shop_id] = (time.time(), coupons)
        return coupons
