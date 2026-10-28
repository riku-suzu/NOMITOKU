import os
from collections.abc import Iterator
from pathlib import Path

from sqlalchemy import TextClause, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

DB_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg2://root@db:5432/demo")
SQLITE_SCHEMA = Path(__file__).parent / "sqlite_schema.sql"


def _create_engine(url: str) -> Engine:
    if not url.startswith("sqlite"):
        return create_engine(url, echo=True)

    # ローカル開発用: SQLite の場合はテーブルを自動作成する
    engine = create_engine(url, echo=True, connect_args={"check_same_thread": False})
    raw = engine.raw_connection()
    try:
        raw.driver_connection.executescript(SQLITE_SCHEMA.read_text())
    finally:
        raw.close()
    return engine


db_engine = _create_engine(DB_URL)
db_session = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)


def get_db() -> Iterator[Session]:
    with db_session() as session:
        yield session


def fetch_one(db: Session, sql: TextClause, params: dict | None = None) -> dict | None:
    """1行だけ取得して dict で返す（見つからなければ None）"""
    row = db.execute(sql, params or {}).first()
    return row._asdict() if row is not None else None


def fetch_all(db: Session, sql: TextClause, params: dict | None = None) -> list[dict]:
    """すべての行を dict のリストで返す"""
    return [row._asdict() for row in db.execute(sql, params or {}).all()]
