from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import auth, analytics, budgets, transactions, upload
from auth.middleware import AuthMiddleware
from config import settings
from db.connection import initialize_database

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthMiddleware)


@app.on_event("startup")
def startup() -> None:
    initialize_database()


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "where_is_my_money_going API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(upload.router, prefix=settings.api_prefix)
app.include_router(transactions.router, prefix=settings.api_prefix)
app.include_router(analytics.router, prefix=settings.api_prefix)
app.include_router(budgets.router, prefix=settings.api_prefix)