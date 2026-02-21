from fastapi import APIRouter

from app.api import me, documents

api_router = APIRouter(prefix="/v1", tags=["v1"])
api_router.include_router(me.router)
api_router.include_router(documents.router)
