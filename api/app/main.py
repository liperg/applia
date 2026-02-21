from fastapi import FastAPI

from app.api.router import api_router

app = FastAPI(
    title="Dra Lia BFF API",
    version="0.1.0",
    description="Backend-for-Frontend API for Dra Lia mobile app (MVP).",
)

app.include_router(api_router)

@app.get("/health")
def health():
    return {"status": "ok"}
