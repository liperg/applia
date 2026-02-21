"""GET /v1/me - user profile by Firebase uid (T024)."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_firebase_uid
from app.database import get_db
from app.services.user_service import get_or_create_user

router = APIRouter()


@router.get("/me")
def me(
    firebase_uid: Annotated[str, Depends(get_current_firebase_uid)],
    db: Annotated[Session, Depends(get_db)],
):
    user = get_or_create_user(db, firebase_uid)
    return {
        "id": user.id,
        "firebaseUid": user.firebase_uid,
        "displayName": user.display_name,
        "avatarUrl": user.avatar_url,
    }
