import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg2://root@db:5432/demo")

if DB_URL.startswith("sqlite"):
    # ローカル開発用: SQLite の場合はテーブルを自動作成する
    db_engine = create_engine(DB_URL, echo=True, connect_args={"check_same_thread": False})
    schema = (Path(__file__).parent / "sqlite_schema.sql").read_text()
    raw = db_engine.raw_connection()
    try:
        raw.driver_connection.executescript(schema)
    finally:
        raw.close()
else:
    db_engine = create_engine(DB_URL, echo=True)

db_session = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)


Base = declarative_base()


def get_db():
    with db_session() as session:
        yield session
