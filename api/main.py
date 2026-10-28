import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.extra_modules.auth import routers as auth
from api.routers import user, store


app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(store.router)

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
