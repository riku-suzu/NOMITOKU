"""
位置まわりの共通処理（距離の計算・表示、地図の埋め込みURL）
"""
import math

EARTH_RADIUS_M = 6371000


def distance_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """2点間の距離（メートル）。ハーバーサインの公式で求める"""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return EARTH_RADIUS_M * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def format_distance(meters: float) -> str:
    """一覧に出す距離の表記（1km 未満は m、それ以上は km で小数1桁）"""
    return f"{int(meters)}m" if meters < 1000 else f"{meters / 1000:.1f}km"


def map_embed_url(lat, lng) -> str:
    """詳細ページに埋め込む Google マップの URL"""
    return f"https://maps.google.com/maps?q={lat},{lng}&z=17&output=embed"


def nearest_first(stores_with_distance: list[tuple[float, dict]]) -> list[dict]:
    """(距離, お店) の組を近い順に並べて、お店だけを返す"""
    return [store for _, store in sorted(stores_with_distance, key=lambda pair: pair[0])]
